const db = require('../config/database');

class Review {
  static async create(reviewData) {
    const { user_id, movie_id, rating, review_text, type = 'movie' } = reviewData;

    const [result] = await db.execute(
      'INSERT INTO reviews (user_id, movie_id, rating, review_text, type) VALUES (?, ?, ?, ?, ?)',
      [user_id, movie_id, rating, review_text, type]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM reviews WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByMovieId(movie_id, type = 'movie') {
    const [rows] = await db.execute(
      `SELECT r.*, u.username, u.profile_image 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.movie_id = ? AND r.type = ? 
       ORDER BY r.created_at DESC`,
      [movie_id, type]
    );
    return rows;
  }

  static async findByUserId(user_id) {
    const [rows] = await db.execute(
      'SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  }

  static async findByUserAndMovie(user_id, movie_id, type = null) {
    let query = 'SELECT * FROM reviews WHERE user_id = ? AND movie_id = ?';
    const params = [user_id, movie_id];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    const [rows] = await db.execute(query, params);
    return rows[0];
  }

  static async update(id, user_id, updateData) {
    const { rating, review_text } = updateData;
    
    const [result] = await db.execute(
      'UPDATE reviews SET rating = ?, review_text = ? WHERE id = ? AND user_id = ?',
      [rating, review_text, id, user_id]
    );
    
    return result.affectedRows > 0;
  }

  static async delete(id, user_id) {
    const [result] = await db.execute(
      'DELETE FROM reviews WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = Review;
