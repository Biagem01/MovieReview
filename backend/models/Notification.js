const db = require('../config/database');

class Notification {
 static async getByUserId(user_id) {
  const [rows] = await db.execute(
    `
    SELECT 
      n.id, 
      n.message, 
      n.is_read, 
      n.created_at, 
      n.review_id,
      r.movie_id, 
      r.type,
      u.username AS sender_username
    FROM notifications n
    LEFT JOIN users u ON n.sender_id = u.id
    LEFT JOIN reviews r ON n.review_id = r.id
    WHERE n.user_id = ?
    ORDER BY n.created_at DESC
    `,
    [user_id]
  );
  return rows;
}


  static async markAsRead(notification_id, user_id) {
    const [result] = await db.execute(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [notification_id, user_id]
    );
    return result.affectedRows > 0;
  }

  static async delete(notification_id, user_id) {
    const [result] = await db.execute(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [notification_id, user_id]
    );
    return result.affectedRows > 0;
  }

  static async create({ user_id, sender_id, type, message, review_id }) {
    const [result] = await db.execute(
      'INSERT INTO notifications (user_id, sender_id, type, message, review_id) VALUES (?, ?, ?, ?, ?)',
      [user_id, sender_id, type, message, review_id]
    );
    return result.insertId;
  }

  static async countUnread(user_id) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0',
      [user_id]
    );
    return rows[0].count;
  }
}

module.exports = Notification;
