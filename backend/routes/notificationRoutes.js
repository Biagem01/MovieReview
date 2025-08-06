const express = require('express');
const authMiddleware = require('../middleware/auth');
const NotificationController = require('../controllers/notificationController');

const router = express.Router();

router.get('/', authMiddleware, NotificationController.getUserNotifications);
router.put('/:id/read', authMiddleware, NotificationController.markAsRead);
router.delete('/:id', authMiddleware, NotificationController.deleteNotification);
router.get('/unread/count', authMiddleware, NotificationController.countUnread);


module.exports = router;
