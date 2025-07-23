
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
    if (currentUser) {
      checkFavoriteStatus();
      checkWatchlistStatus();
      fetchUserReview();
    }
  }, [id, currentUser]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/movie/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await axios.get(`/api/reviews/user/${currentUser.id}/movie/${id}`);
      setUserReview(response.data);
    } catch (error) {
      // User hasn't reviewed this movie yet
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await axios.get(`/api/favorites/check/${id}`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const response = await axios.get(`/api/watchlist/check/${id}`);
      setInWatchlist(response.data.inWatchlist);
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`/api/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await axios.post('/api/favorites', { movie_id: id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleWatchlistToggle = async () => {
    try {
      if (inWatchlist) {
        await axios.delete(`/api/watchlist/${id}`);
        setInWatchlist(false);
      } else {
        await axios.post('/api/watchlist', { movie_id: id });
        setInWatchlist(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  const handleReviewSubmit = () => {
    fetchReviews();
    fetchUserReview();
  };

  if (loading) {
    return <div className="loading">Loading movie details...</div>;
  }

  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  return (
    <div className="movie-detail">
      {backdropUrl && (
        <div 
          className="movie-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}
      
      <div className="movie-content">
        <div className="movie-header">
          <img src={imageUrl} alt={movie.title} className="movie-poster-large" />
          
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p className="movie-overview">{movie.overview}</p>
            
            <div className="movie-stats">
              <div className="stat">
                <strong>Rating:</strong> ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
              </div>
              <div className="stat">
                <strong>Release Date:</strong> {movie.release_date || 'N/A'}
              </div>
            </div>

            {currentUser && (
              <div className="action-buttons">
                <button 
                  onClick={handleFavoriteToggle}
                  className={`action-btn ${isFavorite ? 'active' : ''}`}
                >
                  {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                </button>
                
                <button 
                  onClick={handleWatchlistToggle}
                  className={`action-btn ${inWatchlist ? 'active' : ''}`}
                >
                  {inWatchlist ? '📋 Remove from Watchlist' : '📝 Add to Watchlist'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          
          {currentUser && (
            <ReviewForm 
              movieId={id}
              existingReview={userReview}
              onReviewSubmit={handleReviewSubmit}
            />
          )}
          
          <ReviewList reviews={reviews} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
