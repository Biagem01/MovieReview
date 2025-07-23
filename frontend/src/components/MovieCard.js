
import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-link">
        <img 
          src={imageUrl} 
          alt={movie.title}
          className="movie-poster"
          onError={(e) => {
            e.target.src = '/placeholder-movie.jpg';
          }}
        />
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-year">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </p>
          <div className="movie-rating">
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
