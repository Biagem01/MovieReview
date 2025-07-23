
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, currentPage]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/api/movies/genres');
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        ...(selectedGenre && { genre: selectedGenre })
      };
      
      const response = await axios.get('/api/movies/popular', { params });
      setMovies(response.data.movies);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="home">
      <h1>Popular Movies</h1>
      
      <div className="filters">
        <select 
          value={selectedGenre} 
          onChange={(e) => handleGenreChange(e.target.value)}
          className="genre-select"
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
