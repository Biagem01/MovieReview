const express = require('express');
const MovieController = require('../controllers/movieController');

const router = express.Router();

// Route generiche
router.get('/home', MovieController.getHomeData);
router.get('/popular', MovieController.getPopularMovies);
router.get('/popular-tv', MovieController.getPopularTVShows);
router.get('/search', MovieController.searchMovies);
router.get('/search-tv', MovieController.searchTVShows);
router.get('/search-multi', MovieController.searchMulti);
router.get('/genres', MovieController.getGenres);
router.get('/now-playing', MovieController.getNowPlaying);
router.get('/top-rated', MovieController.getTopRated);
router.get('/upcoming', MovieController.getUpcoming);
router.get('/trending', MovieController.getTrendingMovies);
router.get('/trending-tv', MovieController.getTrendingTVShows);
router.get('/on-air', MovieController.getOnAirTVShows);
router.get('/movies/top-rated', MovieController.getTopRated);
router.get('/tv/top-rated', MovieController.getTopRatedTV);





module.exports = router;