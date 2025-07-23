
const db = require('../config/database');

class Favorite {
  static async add(user_id, movie_id) {
    try {
      const [result] = await db.execute(
        'INSERT INTO favorites (user_id, movie_id) VALUES (?, ?)',
        [user_id, movie_id]
      );
      return result.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Movie already in favorites');
      }
      throw error;
    }
  }

  static async remove(user_id, movie_id) {
    const [result] = await db.execute(
      'DELETE FROM favorites WHERE user_id = ? AND movie_id = ?',
      [user_id, movie_id]
    );
    
    return result.affectedRows > 0;
  }

  static async findByUserId(user_id) {
    const [rows] = await db.execute(
      `SELECT f.*, m.* 
       FROM favorites f 
       LEFT JOIN movies m ON f.movie_id = m.id 
       WHERE f.user_id = ? 
       ORDER BY f.created_at DESC`,
      [user_id]
    );
    return rows;
  }

  static async checkIfFavorite(user_id, movie_id) {
    const [rows] = await db.execute(
      'SELECT id FROM favorites WHERE user_id = ? AND movie_id = ?',
      [user_id, movie_id]
    );
    return rows.length > 0;
  }
}

module.exports = Favorite;
