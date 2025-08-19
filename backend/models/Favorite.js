const db = require('../config/database');

class Favorite {
  // Aggiungi un film ai preferiti
  static async add(user_id, movie_id, type = 'movie') {
    try {
      if (!user_id || !movie_id) {
        throw new Error('user_id o movie_id mancanti');
      }

      // Controlla se esiste già
      const [exists] = await db.execute(
        'SELECT id FROM favorites WHERE user_id = ? AND movie_id = ? AND type = ?',
        [user_id, movie_id, type]
      );

      if (exists.length > 0) {
        throw new Error('Movie already in favorites');
      }

      const [result] = await db.execute(
        'INSERT INTO favorites (user_id, movie_id, type) VALUES (?, ?, ?)',
        [user_id, movie_id, type]
      );

      return result.insertId;

    } catch (error) {
      console.error('Favorite.add error:', error.message);
      throw error;
    }
  }

  // Rimuovi un film dai preferiti
  static async remove(user_id, movie_id, type = 'movie') {
    try {
      if (!user_id || !movie_id) {
        throw new Error('user_id o movie_id mancanti');
      }

      const [result] = await db.execute(
        'DELETE FROM favorites WHERE user_id = ? AND movie_id = ? AND type = ?',
        [user_id, movie_id, type]
      );

      return result.affectedRows > 0;

    } catch (error) {
      console.error('Favorite.remove error:', error.message);
      throw error;
    }
  }

  // Trova tutti i preferiti di un utente
  static async findByUserId(user_id) {
    try {
      if (!user_id) {
        throw new Error('user_id mancante');
      }

      const [rows] = await db.execute(
        `SELECT 
           m.id AS movie_id,
           m.title,
           m.poster_path,
           m.backdrop_path,
           m.vote_average,
           m.release_date,
           f.type
         FROM favorites f
         LEFT JOIN movies m ON f.movie_id = m.id
         WHERE f.user_id = ?
         ORDER BY f.created_at DESC`,
        [user_id]
      );

      return rows;

    } catch (error) {
      console.error('Favorite.findByUserId error:', error.message);
      throw error;
    }
  }

  // Controlla se un film è già nei preferiti
  static async checkIfFavorite(user_id, movie_id, type = 'movie') {
    try {
      if (!user_id || !movie_id) {
        throw new Error('user_id o movie_id mancanti');
      }

      const [rows] = await db.execute(
        'SELECT id FROM favorites WHERE user_id = ? AND movie_id = ? AND type = ?',
        [user_id, movie_id, type]
      );

      return rows.length > 0;

    } catch (error) {
      console.error('Favorite.checkIfFavorite error:', error.message);
      throw error;
    }
  }
}

module.exports = Favorite;
