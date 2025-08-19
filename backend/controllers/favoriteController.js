const Favorite = require('../models/Favorite');
const Movie = require('../models/Movie');

class FavoriteController {
  static async addToFavorites(req, res) {
    try {
      const user_id = req.userId;
      const movieDataRaw = req.body; // oggetto film dalla richiesta

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
        type: movieDataRaw.type ?? 'movie'
      };

      // Controllo se il film esiste già nella tabella movies
      const existingMovie = await Movie.findById(movieData.id);
      if (!existingMovie) {
        await Movie.create(movieData); // crea il film solo se non esiste
      }

      // Aggiungo il film ai preferiti
      try {
        await Favorite.add(user_id, movieData.id, movieData.type);
      } catch (favError) {
        if (favError.message === 'Movie already in favorites') {
          return res.status(400).json({ message: 'Movie already in favorites' });
        }
        throw favError;
      }

      res.status(201).json({ message: 'Movie added to favorites' });
    } catch (error) {
      console.error('Add to favorites error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async removeFromFavorites(req, res) {
    try {
      const { movie_id, type } = req.params;
      const user_id = req.userId;

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
      const type = req.query.type || 'movie';

      const isFavorite = await Favorite.checkIfFavorite(user_id, movie_id, type);
      res.json({ isFavorite });
    } catch (error) {
      console.error('Check if favorite error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = FavoriteController;
