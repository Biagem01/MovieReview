const express = require('express');
const authMiddleware = require('../middleware/auth');
const NotificationController = require('../controllers/notificationController');

const router = express.Router();

// Route specifica prima di quelle con :id
router.get('/unread/count', authMiddleware, NotificationController.countUnread);

// Route generiche con :id
router.get('/', authMiddleware, NotificationController.getUserNotifications);
router.put('/:id/read', authMiddleware, NotificationController.markAsRead);
router.delete('/:id', authMiddleware, NotificationController.deleteNotification);

module.exports = router;
