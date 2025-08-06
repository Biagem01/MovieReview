
const express = require('express');
const FavoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, FavoriteController.addToFavorites);
router.delete('/:type/:movie_id', authMiddleware, FavoriteController.removeFromFavorites);

router.get('/', authMiddleware, FavoriteController.getUserFavorites);
router.get('/check/:movie_id', authMiddleware, FavoriteController.checkIfFavorite);

module.exports = router;
