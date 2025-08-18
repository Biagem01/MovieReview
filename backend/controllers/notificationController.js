const Notification = require('../models/Notification');

class NotificationController {
  static async getUserNotifications(req, res) {
    try {
      const user_id = req.userId;
      const notifications = await Notification.getByUserId(user_id);
      res.json({ notifications });
    } catch (error) {
      console.error('Errore nel recuperare notifiche:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async markAsRead(req, res) {
    try {
      const user_id = req.userId;
      const notification_id = req.params.id;

      const updated = await Notification.markAsRead(notification_id, user_id);

      if (!updated) {
        return res.status(404).json({ message: 'Notifica non trovata o non autorizzato' });
      }

      res.json({ message: 'Notifica segnata come letta' });
    } catch (error) {
      console.error('Errore nel marcare notifica come letta:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async deleteNotification(req, res) {
    try {
      const user_id = req.userId;
      const notification_id = req.params.id;

      const deleted = await Notification.delete(notification_id, user_id);

      if (!deleted) {
        return res.status(404).json({ message: 'Notifica non trovata o non autorizzato' });
      }

      res.json({ message: 'Notifica eliminata' });
    } catch (error) {
      console.error('Errore nell\'eliminare notifica:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async countUnread(req, res) {
  try {
    const user_id = req.userId;
    const count = await Notification.countUnread(user_id);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Errore nel conteggio notifiche non lette:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

}

module.exports = NotificationController;
