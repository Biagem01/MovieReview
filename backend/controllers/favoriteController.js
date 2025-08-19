const Favorite = require('../models/Favorite');
const Movie = require('../models/Movie');

class FavoriteController {
  // Aggiungi un film ai preferiti
  static async addToFavorites(req, res) {
    try {
      const user_id = req.userId;
      if (!user_id) {
        return res.status(401).json({ message: 'Utente non autenticato' });
      }

      const movieDataRaw = req.body;
      if (!movieDataRaw || !movieDataRaw.id) {
        return res.status(400).json({ message: 'Dati film mancanti o non validi' });
      }

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

      // Controllo se il film esiste già
      const existingMovie = await Movie.findById(movieData.id);
      if (!existingMovie) {
        await Movie.create(movieData);
      }

      // Aggiungi ai preferiti
      try {
        await Favorite.add(user_id, movieData.id, movieData.type);
      } catch (favError) {
        if (favError.message === 'Movie already in favorites') {
          return res.status(400).json({ message: favError.message });
        }
        console.error('Errore aggiunta ai preferiti:', favError);
        return res.status(500).json({ message: 'Errore durante l\'aggiunta ai preferiti', error: favError.message });
      }

      res.status(201).json({ message: 'Film aggiunto ai preferiti con successo' });

    } catch (error) {
      console.error('Errore generale addToFavorites:', error);
      res.status(500).json({ message: 'Errore interno del server', error: error.message });
    }
  }

  // Rimuovi un film dai preferiti
  static async removeFromFavorites(req, res) {
    try {
      const user_id = req.userId;
      if (!user_id) {
        return res.status(401).json({ message: 'Utente non autenticato' });
      }

      const { movie_id, type } = req.params;
      if (!movie_id) {
        return res.status(400).json({ message: 'ID film mancante' });
      }

      const removed = await Favorite.remove(user_id, movie_id, type || 'movie');

      if (!removed) {
        return res.status(404).json({ message: 'Film non trovato nei preferiti' });
      }

      res.json({ message: 'Film rimosso dai preferiti' });

    } catch (error) {
      console.error('Errore removeFromFavorites:', error);
      res.status(500).json({ message: 'Errore interno del server', error: error.message });
    }
  }

  // Ottieni tutti i preferiti dell'utente
  static async getUserFavorites(req, res) {
    try {
      const user_id = req.userId;
      if (!user_id) {
        return res.status(401).json({ message: 'Utente non autenticato' });
      }

      const favorites = await Favorite.findByUserId(user_id);
      res.json({ favorites });

    } catch (error) {
      console.error('Errore getUserFavorites:', error);
      res.status(500).json({ message: 'Errore interno del server', error: error.message });
    }
  }

  // Controlla se un film è nei preferiti
  static async checkIfFavorite(req, res) {
    try {
      const user_id = req.userId;
      if (!user_id) {
        return res.status(401).json({ message: 'Utente non autenticato' });
      }

      const { movie_id } = req.params;
      const type = req.query.type || 'movie';

      if (!movie_id) {
        return res.status(400).json({ message: 'ID film mancante' });
      }

      const isFavorite = await Favorite.checkIfFavorite(user_id, movie_id, type);
      res.json({ isFavorite });

    } catch (error) {
      console.error('Errore checkIfFavorite:', error);
      res.status(500).json({ message: 'Errore interno del server', error: error.message });
    }
  }
}

module.exports = FavoriteController;
