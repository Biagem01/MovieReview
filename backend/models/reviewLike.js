const db = require('../config/database');

class ReviewLike {
  static async likeOrDislike({ review_id, user_id, is_like }) {
    const [existing] = await db.execute(
      'SELECT * FROM review_likes WHERE review_id = ? AND user_id = ?',
      [review_id, user_id]
    );

    if (existing.length > 0) {
      await db.execute(
        'UPDATE review_likes SET is_like = ? WHERE review_id = ? AND user_id = ?',
        [is_like, review_id, user_id]
      );
    } else {
      await db.execute(
        'INSERT INTO review_likes (review_id, user_id, is_like) VALUES (?, ?, ?)',
        [review_id, user_id, is_like]
      );
    }
  }

  static async countLikes(review_id) {
    const [likes] = await db.execute(
      'SELECT COUNT(*) AS count FROM review_likes WHERE review_id = ? AND is_like = 1',
      [review_id]
    );
    return likes[0].count;
  }

  static async countDislikes(review_id) {
    const [dislikes] = await db.execute(
      'SELECT COUNT(*) AS count FROM review_likes WHERE review_id = ? AND is_like = 0',
      [review_id]
    );
    return dislikes[0].count;
  }

  static async getUserReaction(review_id, user_id) {
    const [rows] = await db.execute(
      'SELECT is_like FROM review_likes WHERE review_id = ? AND user_id = ?',
      [review_id, user_id]
    );
    return rows[0]?.is_like ?? null;
  }

  static async getAll() {
  const [rows] = await db.execute('SELECT * FROM review_likes');
  return rows;
}

}

module.exports = ReviewLike;
