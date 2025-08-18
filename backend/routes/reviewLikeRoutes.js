const express = require('express');
const authMiddleware = require('../middleware/auth');
const ReviewLikeController = require('../controllers/reviewLikeController');

const router = express.Router();

router.get('/', ReviewLikeController.getAll); // <-- questa!
router.post('/:review_id/reaction', authMiddleware, ReviewLikeController.react);
router.get('/:review_id/reactions', ReviewLikeController.getReactions);
router.get('/:review_id/user-reaction', authMiddleware, ReviewLikeController.getUserReaction);

module.exports = router;
