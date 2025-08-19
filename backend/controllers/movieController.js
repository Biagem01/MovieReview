const Movie = require('../models/Movie');
const axios = require('axios');

const TMDB_API_KEY = '8657cf1a9db8333bc15a68ee00eba376';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

class MovieController {
  // ✅ Popular Movies (con caching su DB)
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

      // Salva in DB se non esistono
      for (const movie of movies) {
        const exists = await Movie.findById(movie.id);
        if (!exists) {
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

  // ✅ Dettagli film/serie
  static async getDetails(req, res) {
    try {
      const { type, id } = req.params;
      if (type !== 'movie' && type !== 'tv') {
        return res.status(400).json({ message: 'Invalid type parameter' });
      }

      let data;
      if (type === 'movie') {
        let movie = await Movie.findById(id);
        if (movie) {
          data = movie;
        } else {
          const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
          data = response.data;
          await Movie.create({
            id: data.id,
            title: data.title,
            overview: data.overview,
            poster_path: data.poster_path,
            backdrop_path: data.backdrop_path,
            release_date: data.release_date,
            vote_average: data.vote_average,
            vote_count: data.vote_count,
            genre_ids: data.genres.map(g => g.id)
          });
        }
      } else {
        const response = await axios.get(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`);
        data = response.data;
      }

      res.json({ data });
    } catch (error) {
      console.error('Get details error:', error);
      res.status(500).json({ message: 'Error fetching details' });
    }
  }

  // ✅ Ricerca film
  static async searchMovies(req, res) {
    try {
      const { query, page = 1 } = req.query;
      if (!query) return res.status(400).json({ message: 'Search query is required' });

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

  // ✅ Ricerca serie TV
  static async searchTVShows(req, res) {
    try {
      const { query, page = 1 } = req.query;
      if (!query) return res.status(400).json({ message: 'Search query is required' });

      const response = await axios.get(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);

      res.json({
        tvShows: response.data.results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Search TV shows error:', error);
      res.status(500).json({ message: 'Error searching TV shows' });
    }
  }

  // ✅ Generi
  static async getGenres(req, res) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
      res.json({ genres: response.data.genres });
    } catch (error) {
      console.error('Get genres error:', error);
      res.status(500).json({ message: 'Error fetching genres' });
    }
  }

  // ✅ TV Popolari
  static async getPopularTVShows(req, res) {
    try {
      const page = req.query.page || 1;
      const url = `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`;
      const response = await axios.get(url);

      res.json({
        tvShows: response.data.results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Get popular TV shows error:', error);
      res.status(500).json({ message: 'Error fetching TV shows' });
    }
  }

  // ✅ Now Playing
  static async getNowPlaying(req, res) {
    try {
      const page = req.query.page || 1;
      const url = `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}&language=it-IT`;
      const response = await axios.get(url);

      res.json({
        movies: response.data.results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Get now playing movies error:', error);
      res.status(500).json({ message: 'Error fetching now playing movies' });
    }
  }

  // ✅ Top Rated
  static async getTopRated(req, res) {
    try {
      const page = req.query.page || 1;
      const url = `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}&language=it-IT`;
      const response = await axios.get(url);

      res.json({
        movies: response.data.results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Get top rated movies error:', error);
      res.status(500).json({ message: 'Error fetching top rated movies' });
    }
  }

  // ✅ Upcoming
  static async getUpcoming(req, res) {
    try {
      const page = req.query.page || 1;
      const url = `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}&language=it-IT`;
      const response = await axios.get(url);

      res.json({
        movies: response.data.results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Get upcoming movies error:', error);
      res.status(500).json({ message: 'Error fetching upcoming movies' });
    }
  }

  // ✅ Home Data
  static async getHomeData(req, res) {
    try {
      const [
        trendingRes,
        popularRes,
        nowPlayingRes,
        topRatedRes,
        topRatedTVRes,
        tvRes,
        upcomingRes,
      ] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`),
        axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`),
        axios.get(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`),
        axios.get(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`),
        axios.get(`${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}`),
        axios.get(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`),
        axios.get(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`),
      ]);

      res.json({
        trending: trendingRes.data.results.slice(0, 10),
        popularMovies: popularRes.data.results.slice(0, 10),
        nowPlaying: nowPlayingRes.data.results.slice(0, 10),
        topRatedMovies: topRatedRes.data.results.slice(0, 10),
        topRatedTV: topRatedTVRes.data.results.slice(0, 10),
        popularTV: tvRes.data.results.slice(0, 10),
        upcoming: upcomingRes.data.results.slice(0, 10),
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
      res.status(500).json({ message: 'Error loading home data' });
    }
  }

  // ✅ Search Multi
  static async searchMulti(req, res) {
    try {
      const { query, page = 1 } = req.query;
      if (!query) return res.status(400).json({ message: 'Search query is required' });

      const response = await axios.get(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
      const results = response.data.results.filter(
        item => item.media_type === 'movie' || item.media_type === 'tv'
      );

      res.json({
        results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Search multi error:', error);
      res.status(500).json({ message: 'Error searching movies and TV shows' });
    }
  }

  // ✅ Credits
  static async getCredits(req, res) {
    try {
      const { type, id } = req.params;
      if (type !== 'movie' && type !== 'tv') {
        return res.status(400).json({ message: 'Invalid type parameter' });
      }

      const url = `${TMDB_BASE_URL}/${type}/${id}/credits?api_key=${TMDB_API_KEY}&language=it-IT`;
      const response = await axios.get(url);

      res.json({
        cast: response.data.cast,
        crew: response.data.crew,
      });
    } catch (error) {
      console.error('Errore nel recupero dei credits:', error.message);
      res.status(500).json({ message: 'Errore nel recupero di cast e crew' });
    }
  }

  // ✅ Videos
  static async getVideos(req, res) {
    try {
      const { type, id } = req.params;
      if (type !== 'movie' && type !== 'tv') {
        return res.status(400).json({ message: 'Invalid type parameter' });
      }

      const url = `${TMDB_BASE_URL}/${type}/${id}/videos?api_key=${TMDB_API_KEY}&language=it-IT`;
      const response = await axios.get(url);
      const videos = response.data.results.filter(
        video => ['Trailer', 'Teaser', 'Clip'].includes(video.type) && video.site === 'YouTube'
      );

      res.json({ videos });
    } catch (error) {
      console.error('Errore nel recupero dei video:', error.message);
      res.status(500).json({ message: 'Errore nel recupero dei video' });
    }
  }

  // ✅ Similar
  static async getSimilar(req, res) {
    try {
      const { type, id } = req.params;
      const page = req.query.page || 1;
      if (type !== 'movie' && type !== 'tv') {
        return res.status(400).json({ message: 'Invalid type parameter' });
      }

      const url = `${TMDB_BASE_URL}/${type}/${id}/similar?api_key=${TMDB_API_KEY}&language=it-IT&page=${page}`;
      const response = await axios.get(url);

      res.json({
        results: response.data.results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Errore nel recupero dei contenuti simili:', error.message);
      res.status(500).json({ message: 'Errore nel recupero dei contenuti simili' });
    }
  }

  // ✅ Top Rated TV
  static async getTopRatedTV(req, res) {
    try {
      const page = req.query.page || 1;
      const url = `${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&page=${page}&language=it-IT`;
      const response = await axios.get(url);

      res.json({
        tvShows: response.data.results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Get top rated TV error:', error);
      res.status(500).json({ message: 'Error fetching top rated TV shows' });
    }
  }

  // ✅ Trending Movies
  static async getTrendingMovies(req, res) {
    try {
      const page = req.query.page || 1;
      const url = `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&page=${page}`;
      const response = await axios.get(url);

      res.json({
        movies: response.data.results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Get trending movies error:', error);
      res.status(500).json({ message: 'Error fetching trending movies' });
    }
  }

  // ✅ Trending TV
  static async getTrendingTVShows(req, res) {
    try {
      const page = req.query.page || 1;
      const url = `${TMDB_BASE_URL}/trending/tv/day?api_key=${TMDB_API_KEY}&page=${page}`;
      const response = await axios.get(url);

      res.json({
        tvShows: response.data.results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Get trending TV shows error:', error);
      res.status(500).json({ message: 'Error fetching trending TV shows' });
    }
  }

  // ✅ On Air TV
  static async getOnAirTVShows(req, res) {
    try {
      const page = req.query.page || 1;
      const url = `${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&page=${page}`;
      const response = await axios.get(url);

      res.json({
        tvShows: response.data.results,
        total_pages: response.data.total_pages,
        current_page: page
      });
    } catch (error) {
      console.error('Get on-air TV shows error:', error);
      res.status(500).json({ message: 'Error fetching on-air TV shows' });
    }
  }

  // ✅ Season Details
  static async getSeasonDetails(req, res) {
    try {
      const { id, seasonNumber } = req.params;
      const url = `${TMDB_BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`;
      const response = await axios.get(url);

      res.json(response.data);
    } catch (error) {
      console.error('Errore nel recupero dei dettagli stagione:', error.message);
      res.status(500).json({ message: 'Errore nel recupero dei dettagli della stagione' });
    }
  }

  // ✅ Episode Details
  static async getEpisodeDetails(req, res) {
    try {
      const { id, seasonNumber, episodeNumber } = req.params;
      const url = `${TMDB_BASE_URL}/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${TMDB_API_KEY}`;
      const response = await axios.get(url);

      res.json(response.data);
    } catch (error) {
      console.error('Errore nel recupero dei dettagli episodio:', error.message);
      res.status(500).json({ message: 'Errore nel recupero dei dettagli dell\'episodio' });
    }
  }
}

module.exports = MovieController;
