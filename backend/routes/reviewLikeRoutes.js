const express = require('express');
const authMiddleware = require('../middleware/auth');
const ReviewLikeController = require('../controllers/reviewLikeController');

const router = express.Router();

// Route più specifiche prima
router.get('/:review_id/user-reaction', authMiddleware, ReviewLikeController.getUserReaction);
router.get('/:review_id/reactions', ReviewLikeController.getReactions);
router.post('/:review_id/reaction', authMiddleware, ReviewLikeController.react);

// Route generica alla fine
router.get('/', ReviewLikeController.getAll);

module.exports = router;
