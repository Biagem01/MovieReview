const express = require('express');
const MovieController = require('../controllers/movieController');

const router = express.Router();

router.get('/popular', MovieController.getPopularMovies);
router.get('/search', MovieController.searchMovies);
router.get('/genres', MovieController.getGenres);
router.get('/:id', MovieController.getMovieDetails);

module.exports = router;