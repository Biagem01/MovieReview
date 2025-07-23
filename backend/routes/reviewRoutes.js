
const express = require('express');
const ReviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');

const router = express.Router();

router.post('/', authMiddleware, validateReview, ReviewController.createReview);
router.get('/movie/:movie_id', ReviewController.getMovieReviews);
router.get('/user', authMiddleware, ReviewController.getUserReviews);
router.put('/:id', authMiddleware, validateReview, ReviewController.updateReview);
router.delete('/:id', authMiddleware, ReviewController.deleteReview);

module.exports = router;
