
const db = require('../config/database');


class Watchlist {
  static async add(user_id, movie_id, type) {
    try {
      const [result] = await db.execute(
        'INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)',
        [user_id, movie_id]
      );
      return result.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Movie already in watchlist');
      }
      throw error;
    }
  }

  static async remove(user_id, movie_id, type) {
    const [result] = await db.execute(
      'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [user_id, movie_id]
    );
    
    return result.affectedRows > 0;
  }

  static async findByUserId(user_id, type = null) {
    const [rows] = await db.execute(
      `SELECT w.*, m.* 
       FROM watchlist w 
       LEFT JOIN movies m ON w.movie_id = m.id 
       WHERE w.user_id = ? 
       ORDER BY w.created_at DESC`,
      [user_id]
    );
    return rows;
  }

  static async checkIfInWatchlist(user_id, movie_id, type) {
    const [rows] = await db.execute(
      'SELECT id FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [user_id, movie_id]
    );
    return rows.length > 0;
  }
}

module.exports = Watchlist;


