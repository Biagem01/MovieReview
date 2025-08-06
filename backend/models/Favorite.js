const db = require('../config/database');

class Favorite {
  static async add(user_id, movie_id, type = 'movie') {
    try {
      // Controllo se già esiste il preferito per quel user, movie e type
      const [exists] = await db.execute(
        'SELECT * FROM favorites WHERE user_id = ? AND movie_id = ? AND type = ?',
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
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Movie already in favorites');
      }
      throw error;
    }
  }

  static async remove(user_id, movie_id, type = 'movie') {
    const [result] = await db.execute(
      'DELETE FROM favorites WHERE user_id = ? AND movie_id = ? AND type = ?',
      [user_id, movie_id, type]
    );

    return result.affectedRows > 0;
  }

  static async findByUserId(user_id) {
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
  }

  static async checkIfFavorite(user_id, movie_id, type = 'movie') {
    const [rows] = await db.execute(
      'SELECT id FROM favorites WHERE user_id = ? AND movie_id = ? AND type = ?',
      [user_id, movie_id, type]
    );
    return rows.length > 0;
  }
}

module.exports = Favorite;
