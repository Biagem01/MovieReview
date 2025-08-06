const Favorite = require('../models/Favorite');
const Movie = require('../models/Movie');

class FavoriteController {
static async addToFavorites(req, res) {
  try {
    const user_id = req.userId;
    const movieDataRaw = req.body; // qui arriva tutto l'oggetto film

    const movieData = {
      id: movieDataRaw.id,
      title: movieDataRaw.title ?? null,
      overview: movieDataRaw.overview ?? null,
      poster_path: movieDataRaw.poster_path ?? null,
      backdrop_path: movieDataRaw.backdrop_path ?? null,
      release_date: movieDataRaw.release_date ?? null,
      vote_average: movieDataRaw.vote_average ?? null,
      vote_count: movieDataRaw.vote_count ?? null,
      genre_ids: movieDataRaw.genre_ids ? JSON.stringify(movieDataRaw.genre_ids) : null,
      type: movieDataRaw.type ?? 'movie'  // fallback a movie se non arriva
    };

    // Salvo o aggiorno il film nella tabella movies
    await Movie.create(movieData);

    // Aggiungo il film/serie tv ai preferiti con il type
    await Favorite.add(user_id, movieData.id, movieData.type);

    res.status(201).json({ message: 'Movie added to favorites' });
  } catch (error) {
    if (error.message === 'Movie already in favorites') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Add to favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

  static async removeFromFavorites(req, res) {
  try {
    const { movie_id, type } = req.params;  // <-- aggiungi type qui!
    const user_id = req.userId;

    // Passa type anche al model
    const removed = await Favorite.remove(user_id, movie_id, type);

    if (!removed) {
      return res.status(404).json({ message: 'Movie not found in favorites' });
    }

    res.json({ message: 'Movie removed from favorites' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


  static async getUserFavorites(req, res) {
    try {
      const user_id = req.userId;
      const favorites = await Favorite.findByUserId(user_id);

      res.json({ favorites });
    } catch (error) {
      console.error('Get user favorites error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async checkIfFavorite(req, res) {
  try {
    const { movie_id } = req.params;
    const user_id = req.userId;
    const type = req.query.type || 'movie'; // 👈 prendi anche il type dalla query

    const isFavorite = await Favorite.checkIfFavorite(user_id, movie_id, type);

    res.json({ isFavorite });
  } catch (error) {
    console.error('Check if favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

}

module.exports = FavoriteController;
