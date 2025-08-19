import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../../components/MovieCard/MovieCard';
import Pagination from '../../components/Pagination/Pagination';
import '../Home/Home.css';

const MAX_TOTAL_PAGES = 500;
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const BrowseSection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const section = searchParams.get('section') || 'popular';
  const type = searchParams.get('type') || 'movie';

  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedGenre('');
  }, [section, type]);

  useEffect(() => {
    fetchGenres();
  }, [type]);

  useEffect(() => {
    fetchItems();
  }, [section, type, selectedGenre, currentPage]);

  const fetchGenres = async () => {
    if (type !== 'movie') {
      setGenres([]);
      setSelectedGenre('');
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/api/movies/genres`);
      setGenres(response.data.genres || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setGenres([]);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let params = { page: currentPage };

      switch (section) {
        case 'trending':
          endpoint = type === 'movie' ? `/api/movies/trending` : `/api/movies/trending-tv`;
          break;
        case 'now-playing':
          endpoint = type === 'movie' ? `/api/movies/now-playing` : `/api/movies/on-air`;
          break;
        case 'top-rated':
          endpoint = type === 'movie' ? `/api/movies/top-rated` : `/api/movies/tv/top-rated`;
          break;
        case 'upcoming':
          endpoint = `/api/movies/upcoming`;
          params.type = type;
          break;
        case 'popular':
        default:
          endpoint = type === 'movie' ? `/api/movies/popular` : `/api/movies/popular-tv`;
      }

      if (type === 'movie' && selectedGenre) {
        params.genre = selectedGenre;
      }

      const response = await axios.get(`${BASE_URL}${endpoint}`, { params });
      const dataItems = type === 'movie' ? response.data.movies : response.data.tvShows;

      setItems(dataItems || []);
      setTotalPages(Math.min(response.data.total_pages || 1, MAX_TOTAL_PAGES));
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading {type === 'movie' ? 'movies' : 'TV shows'}...</p>
      </div>
    );
  }

  return (
    <div className="imdb-style browse-section">
      <div className="main-container">
        <div className="results-header">
          <h1>
            {section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} {type === 'movie' ? 'Movies' : 'TV Shows'}
          </h1>

          {type === 'movie' && genres.length > 0 && (
            <div className="filters">
              <select
                className="genre-select"
                value={selectedGenre}
                onChange={handleGenreChange}
              >
                <option value="">All Genres</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="results-grid">
          {items.length > 0 ? (
            items.map((item) => (
              <MovieCard
                key={item.id || item.movie_id}
                movie={item}
                contentType={type}
              />
            ))
          ) : (
            <div className="no-results">
              <p>No results found.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
};

export default BrowseSection;
