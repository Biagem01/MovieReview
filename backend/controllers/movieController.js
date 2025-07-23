
const Movie = require('../models/Movie');
const axios = require('axios');

const TMDB_API_KEY = '8657cf1a9db8333bc15a68ee00eba376';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

class MovieController {
  static async getPopularMovies(req, res) {
    try {
      const page = req.query.page || 1;
      const genre = req.query.genre;
      
      let url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
      
      if (genre) {
        url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&with_genres=${genre}`;
      }

      const response = await axios.get(url);
      const movies = response.data.results;

      // Cache movies in database
      for (const movie of movies) {
        await Movie.create({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          genre_ids: movie.genre_ids
        });
      }

      res.json({
        movies,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Get popular movies error:', error);
      res.status(500).json({ message: 'Error fetching movies' });
    }
  }

  static async getMovieDetails(req, res) {
    try {
      const { id } = req.params;
      
      // Try to get from database first
      let movie = await Movie.findById(id);
      
      if (!movie) {
        // Fetch from TMDB API
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
        const movieData = response.data;
        
        // Cache in database
        await Movie.create({
          id: movieData.id,
          title: movieData.title,
          overview: movieData.overview,
          poster_path: movieData.poster_path,
          backdrop_path: movieData.backdrop_path,
          release_date: movieData.release_date,
          vote_average: movieData.vote_average,
          vote_count: movieData.vote_count,
          genre_ids: movieData.genres.map(g => g.id)
        });
        
        movie = movieData;
      }

      res.json({ movie });
    } catch (error) {
      console.error('Get movie details error:', error);
      res.status(500).json({ message: 'Error fetching movie details' });
    }
  }

  static async searchMovies(req, res) {
    try {
      const { query, page = 1 } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const response = await axios.get(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
      
      res.json({
        movies: response.data.results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Search movies error:', error);
      res.status(500).json({ message: 'Error searching movies' });
    }
  }

  static async getGenres(req, res) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
      res.json({ genres: response.data.genres });
    } catch (error) {
      console.error('Get genres error:', error);
      res.status(500).json({ message: 'Error fetching genres' });
    }
  }
}

module.exports = MovieController;
