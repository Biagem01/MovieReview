import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../../components/MovieCard/MovieCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Home.css';

const MAX_TOTAL_PAGES = 500;
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // States
  const [contentType, setContentType] = useState('');
  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [homeData, setHomeData] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const initialLoadDone = useRef(false);

  // 1. Sync state with URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryFromURL = searchParams.get('search') || '';
    const pageFromURL = parseInt(searchParams.get('page')) || 1;
    const genreFromURL = searchParams.get('genre') || '';
    const typeFromURL = searchParams.get('type') || '';

    setSearchQuery(queryFromURL);
    setCurrentPage(pageFromURL);
    setSelectedGenre(genreFromURL);
    setContentType(typeFromURL);

    initialLoadDone.current = true;
  }, [location.search]);

  // 2. Fetch genres for movies
  useEffect(() => {
    if (contentType === 'movie') {
      fetchGenres();
    } else {
      setGenres([]);
      setSelectedGenre('');
    }
  }, [contentType]);

  // 3. Fetch items
  useEffect(() => {
    if (!initialLoadDone.current) return;

    if (contentType === 'movie' || contentType === 'tv' || contentType === '') {
      fetchItems();
    } else {
      setItems([]);
      setTotalPages(1);
      setLoading(false);
    }
  }, [contentType, searchQuery, selectedGenre, currentPage]);

  // 4. Fetch home data
  useEffect(() => {
    if (!initialLoadDone.current) return;

    if (contentType !== 'movie' && contentType !== 'tv') {
      const fetchHomeData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${BASE_URL}/api/movies/home`);
          setHomeData(response.data);
        } catch (error) {
          console.error('Error fetching home data:', error);
          setHomeData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchHomeData();
    } else {
      setHomeData(null);
    }
  }, [contentType]);

  // 5. Scroll top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch functions
  const fetchGenres = async () => {
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
      let response;

      if (searchQuery.trim()) {
        if (!contentType) {
          // Multi search
          response = await axios.get(`${BASE_URL}/api/movies/search-multi`, {
            params: { query: searchQuery, page: currentPage },
          });

          const filtered = (response.data.results || []).filter(
            (item) => item.media_type === 'movie' || item.media_type === 'tv'
          );

          setItems(filtered);
          setTotalPages(Math.min(response.data.total_pages || 1, MAX_TOTAL_PAGES));
        } else {
          // Specific search
          const endpoint = contentType === 'movie'
            ? `${BASE_URL}/api/movies/search`
            : `${BASE_URL}/api/movies/search-tv`;
          response = await axios.get(endpoint, {
            params: { query: searchQuery, page: currentPage },
          });

          const dataItems = contentType === 'movie' ? response.data.movies : response.data.tvShows;
          setItems(dataItems || []);
          setTotalPages(Math.min(response.data.total_pages || 1, MAX_TOTAL_PAGES));
        }
      } else {
        // Popular items
        const endpoint = contentType === 'movie'
          ? `${BASE_URL}/api/movies/popular`
          : `${BASE_URL}/api/movies/popular-tv`;
        const params = {
          page: currentPage,
          ...(contentType === 'movie' && selectedGenre ? { genre: selectedGenre } : {}),
        };

        response = await axios.get(endpoint, { params });
        const dataItems = contentType === 'movie' ? response.data.movies : response.data.tvShows;
        setItems(dataItems || []);
        setTotalPages(Math.min(response.data.total_pages || 1, MAX_TOTAL_PAGES));
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const buildSearchParams = (overrides = {}) => {
    const params = new URLSearchParams();

    const search = overrides.search !== undefined ? overrides.search : searchQuery;
    const genre = overrides.genre !== undefined ? overrides.genre : selectedGenre;
    const page = overrides.page !== undefined ? overrides.page : currentPage;
    const type = overrides.type !== undefined ? overrides.type : contentType;

    if (search) params.set('search', search);
    if (type) params.set('type', type);
    if (genre && type === 'movie') params.set('genre', genre);
    params.set('page', page);

    return `/?${params.toString()}`;
  };

  // Handlers
  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
    navigate(buildSearchParams({ genre: genreId, page: 1 }));
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    navigate(buildSearchParams({ page }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query.trim());
    setCurrentPage(1);
    navigate(buildSearchParams({ search: query.trim(), page: 1 }));
  };

  const handleContentTypeChange = (type) => {
    setContentType(type);
    setSearchQuery('');
    setSelectedGenre('');
    setCurrentPage(1);
    navigate(buildSearchParams({ type, search: '', genre: '', page: 1 }));
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 7;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(currentPage - 2, 2);
      let endPage = Math.min(currentPage + 2, totalPages - 1);

      if (currentPage <= 3) {
        startPage = 2;
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
        endPage = totalPages - 1;
      }

      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading {contentType === 'movie' ? 'movies' : contentType === 'tv' ? 'TV shows' : 'content'}...</p>
      </div>
    );
  }

  const isStaticHome = contentType !== 'movie' && contentType !== 'tv' && !searchQuery;

  return (
    <div className="imdb-style">
      {/* Hero Section */}
      {isStaticHome && homeData?.trending?.length > 0 && (
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Discover Your Next Favorite</h1>
          <p>Millions of movies, TV shows, and people to discover. Explore now.</p>
          <div className="hero-search-container">
            <SearchBar onSearch={handleSearch} contentType={contentType} />
          </div>
        </div>
      </div>
)}

      {/* Main Content */}
      <div className="main-container">
        {!isStaticHome && (
          <div className="search-header">
            <SearchBar onSearch={handleSearch} contentType={contentType} />
          </div>
        )}

        {/* Content Type Tabs */}
        <div className="content-type-tabs">
          <button
            className={contentType === '' ? 'active' : ''}
            onClick={() => handleContentTypeChange('')}
          >
            All
          </button>
          <button
            className={contentType === 'movie' ? 'active' : ''}
            onClick={() => handleContentTypeChange('movie')}
          >
            Movies
          </button>
          <button
            className={contentType === 'tv' ? 'active' : ''}
            onClick={() => handleContentTypeChange('tv')}
          >
            TV Shows
          </button>
        </div>

        {isStaticHome ? (
          <>
            {/* Featured Sections */}
            <section className="featured-section">
              <div className="section-header">
                <h2>Trending Now</h2>
                <div className="section-controls">
                  <button
                  className="view-all"
                  onClick={() => navigate(`/browse?section=trending&type=movie`)}
                >
                  View All
                </button>

                </div>
              </div>
              <div className="horizontal-scroll">
                {homeData?.trending?.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} contentType="movie" featured />
                ))}
              </div>
            </section>

            <section className="featured-section">
              <div className="section-header">
                <h2>Popular Movies</h2>
                <div className="section-controls">
                  <button
                  className="view-all"
                  onClick={() => navigate(`/browse?section=popular&type=movie`)}
                >
                  View All
                </button>
                </div>
              </div>
              <div className="horizontal-scroll">
                {homeData?.popularMovies?.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} contentType="movie" />
                ))}
              </div>
            </section>

            <section className="featured-section">
              <div className="section-header">
                <h2>Now Playing</h2>
                <div className="section-controls">
                   <button
                  className="view-all"
                  onClick={() => navigate(`/browse?section=now-playing&type=movie`)}
                >
                  View All
                </button>
                </div>
              </div>
              <div className="horizontal-scroll">
                {homeData?.nowPlaying?.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} contentType="movie" />
                ))}
              </div>
            </section>

            <section className="featured-section">
              <div className="section-header">
                <h2>Popular TV Shows</h2>
                <div className="section-controls">
                   <button
                  className="view-all"
                  onClick={() => navigate(`/browse?section=popular&type=tv`)}
                >
                  View All
                </button>
                </div>
              </div>
              <div className="horizontal-scroll">
                {homeData?.popularTV?.map((tv) => (
                  <MovieCard key={tv.id} movie={tv} contentType="tv" />
                ))}
              </div>
            </section>

            <section className="featured-section">
            <div className="section-header">
              <h2>Top Rated Movies</h2>
              <div className="section-controls">
                 <button
                  className="view-all"
                  onClick={() => navigate(`/browse?section=top-rated&type=movie`)}
                >
                  View All
                </button>
              </div>
            </div>
            <div className="horizontal-scroll">
              {homeData?.topRatedMovies?.map((movie) => (
                <MovieCard key={movie.id} movie={movie} contentType="movie" />
              ))}
            </div>
          </section>

          <section className="featured-section">
            <div className="section-header">
              <h2>Top Rated TV Shows</h2>
              <div className="section-controls">
                 <button
                  className="view-all"
                  onClick={() => navigate(`/browse?section=top-rated&type=tv`)}
                >
                  View All
                </button>
              </div>
            </div>
            <div className="horizontal-scroll">
              {homeData?.topRatedTV?.map((tv) => (
                <MovieCard key={tv.id} movie={tv} contentType="tv" />
              ))}
            </div>
          </section>

          <section className="featured-section">
          <div className="section-header">
            <h2>Upcoming Movies</h2>
            <div className="section-controls">
              <button
                className="view-all"
                onClick={() => navigate('/browse?section=upcoming&type=movie')}
              >
                View All
              </button>
            </div>
          </div>
          <div className="horizontal-scroll">
            {homeData?.upcoming?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} contentType="movie" />
            ))}
          </div>
        </section>
          </>
        ) : (
          <>
            {/* Search Results */}
            <div className="results-header">
              <h1>
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : contentType === 'movie'
                  ? 'Popular Movies'
                  : 'Popular TV Shows'}
              </h1>
              
              {contentType === 'movie' && !searchQuery && (
                <div className="filters">
                  <select
                    value={selectedGenre}
                    onChange={(e) => handleGenreChange(e.target.value)}
                    className="genre-select"
                  >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
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
                    contentType={item.media_type || contentType}
                    currentPage={currentPage}
                  />
                ))
              ) : (
                <div className="no-results">
                  <p>No results found.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  &laquo; Prev
                </button>

                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={page}>
                    {index !== 0 && page !== getPageNumbers()[index - 1] + 1 && (
                      <span className="ellipsis">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  Next &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="scroll-to-top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Home;