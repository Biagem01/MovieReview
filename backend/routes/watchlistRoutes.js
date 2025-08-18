
const express = require('express');
const WatchlistController = require('../controllers/watchlistController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, WatchlistController.addToWatchlist);
router.delete('/:type/:movie_id', authMiddleware, WatchlistController.removeFromWatchlist);
router.get('/', authMiddleware, WatchlistController.getUserWatchlist);
router.get('/check/:movie_id', authMiddleware, WatchlistController.checkIfInWatchlist);

module.exports = router;
