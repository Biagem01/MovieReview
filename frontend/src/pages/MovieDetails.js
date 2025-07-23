
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const MovieDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
    if (currentUser) {
      checkFavoriteStatus();
      checkWatchlistStatus();
    }
  }, [id, currentUser]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/movie/${id}`);
      setReviews(response.data.reviews);
      
      if (currentUser) {
        const currentUserReview = response.data.reviews.find(
          review => review.user_id === currentUser.id
        );
        setUserReview(currentUserReview);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await axios.get('/api/favorites');
      const favorite = response.data.favorites.find(fav => fav.movie_id === parseInt(id));
      setIsFavorite(!!favorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const response = await axios.get('/api/watchlist');
      const watchlistItem = response.data.watchlist.find(item => item.movie_id === parseInt(id));
      setIsInWatchlist(!!watchlistItem);
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`/api/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await axios.post('/api/favorites', { movie_id: parseInt(id) });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const toggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await axios.delete(`/api/watchlist/${id}`);
        setIsInWatchlist(false);
      } else {
        await axios.post('/api/watchlist', { movie_id: parseInt(id) });
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviews();
  };

  if (loading || !movie) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="movie-details">
        <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
          <img 
            src={movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
              : '/placeholder.jpg'
            }
            alt={movie.title}
            style={{ width: '300px', borderRadius: '8px' }}
          />
          
          <div style={{ flex: 1 }}>
            <h1>{movie.title}</h1>
            <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
            <p><strong>Rating:</strong> ⭐ {movie.vote_average?.toFixed(1)}/10</p>
            <p><strong>Overview:</strong> {movie.overview}</p>
            
            {currentUser && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={toggleFavorite}
                  className={`btn ${isFavorite ? 'btn-danger' : 'btn-primary'}`}
                >
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                
                <button 
                  onClick={toggleWatchlist}
                  className={`btn ${isInWatchlist ? 'btn-danger' : 'btn-primary'}`}
                >
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            )}
          </div>
        </div>

        {currentUser && (
          <div className="card">
            <h3>{userReview ? 'Edit Your Review' : 'Write a Review'}</h3>
            <ReviewForm 
              movieId={parseInt(id)}
              existingReview={userReview}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        )}

        <div className="card">
          <h3>Reviews ({reviews.length})</h3>
          <ReviewList reviews={reviews} onReviewUpdated={handleReviewSubmitted} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
