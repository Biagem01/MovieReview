const express = require('express');
const ReviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');

const router = express.Router();

// Route per creare recensione
router.post('/', authMiddleware, validateReview, ReviewController.createReview);

// Route per ottenere recensioni di un utente per un film specifico (più specifica)
router.get('/user/:user_id/:type/:movie_id', authMiddleware, ReviewController.getUserReviewForMovie);

// Route per ottenere tutte le recensioni di un utente
router.get('/user', authMiddleware, ReviewController.getUserReviews);

// Route generica per ottenere recensioni di un film (più generica)
router.get('/:type/:movie_id', ReviewController.getMovieReviews);

// Route per aggiornare recensione
router.put('/:id', authMiddleware, validateReview, ReviewController.updateReview);

// Route per cancellare recensione
router.delete('/:id', authMiddleware, ReviewController.deleteReview);

module.exports = router;
