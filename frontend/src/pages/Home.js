
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import Pagination from '../components/Pagination';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, [currentPage, searchQuery, selectedGenre]);

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
      let url = '';
      if (searchQuery) {
        url = `/api/movies/search?query=${encodeURIComponent(searchQuery)}&page=${currentPage}`;
      } else {
        url = `/api/movies/popular?page=${currentPage}`;
      }

      const response = await axios.get(url);
      setMovies(response.data.movies);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

  const filteredMovies = selectedGenre 
    ? movies.filter(movie => movie.genre_ids?.includes(parseInt(selectedGenre)))
    : movies;

  return (
    <div className="container">
      <h1>Popular Movies</h1>
      
      <SearchBar onSearch={handleSearch} />
      <GenreFilter 
        genres={genres} 
        selectedGenre={selectedGenre}
        onGenreChange={handleGenreChange}
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="movie-grid">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          {filteredMovies.length === 0 && (
            <div>No movies found.</div>
          )}

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Home;
