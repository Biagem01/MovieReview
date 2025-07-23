
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <img 
        src={movie.poster_path 
          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` 
          : '/placeholder.jpg'
        }
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-rating">
          ⭐ {movie.vote_average?.toFixed(1)}
        </div>
        <div className="movie-release-date">
          {new Date(movie.release_date).getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
