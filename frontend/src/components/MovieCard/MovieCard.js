import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie, contentType, currentPage }) => {
  const navigate = useNavigate();
  const placeholderUrl = 'https://via.placeholder.com/500x750?text=No+Image';

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : placeholderUrl;

  // Determina il tipo di contenuto, prioritizzando prop contentType, altrimenti movie.type
  const type = contentType
    ? (contentType === 'tv' ? 'tv' : 'movie')
    : (movie.type === 'tv' ? 'tv' : 'movie');

  const movieId = movie.id || movie.movie_id;

  const formatVote = (vote) => {
    const parsed = parseFloat(vote);
    return !isNaN(parsed) ? parsed.toFixed(1) : 'N/A';
  };

  // Gestisce il click: salva posizione scroll e naviga a dettaglio
  const handleClick = (e) => {
    e.preventDefault();

    // Salva posizione scroll nella history.state
    const currentState = window.history.state || {};
    window.history.replaceState(
      { ...currentState, scrollPosition: window.scrollY },
      ''
    );

    // Naviga alla pagina dettaglio con query page
    navigate(`/${type}/${movieId}?page=${currentPage}&type=${type}`);

  };

  return (
    <div className="movie-card">
      {movieId ? (
        <a href={`/${type}/${movieId}?page=${currentPage}&type=${type}`} className="movie-link" onClick={handleClick}>
          <img
            src={imageUrl}
            alt={movie.title || movie.name}
            className="movie-poster"
            onError={(e) => {
              if (e.target.src !== placeholderUrl) {
                e.target.src = placeholderUrl;
              }
            }}
          />
          <div className="movie-info">
            <h3 className="movie-title">{movie.title || movie.name}</h3>
            <p className="movie-year">
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : movie.first_air_date
                  ? new Date(movie.first_air_date).getFullYear()
                  : 'N/A'}
            </p>
            <div className="movie-rating">
              ⭐ {formatVote(movie.vote_average)}
            </div>
          </div>
        </a>
      ) : (
        <div className="movie-info no-link">
          <img
            src={imageUrl}
            alt={movie.title || movie.name}
            className="movie-poster"
            onError={(e) => {
              if (e.target.src !== placeholderUrl) {
                e.target.src = placeholderUrl;
              }
            }}
          />
          <h3 className="movie-title">{movie.title || movie.name}</h3>
          <p className="movie-year">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : movie.first_air_date
                ? new Date(movie.first_air_date).getFullYear()
                : 'N/A'}
          </p>
          <div className="movie-rating">
            ⭐ {formatVote(movie.vote_average)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
