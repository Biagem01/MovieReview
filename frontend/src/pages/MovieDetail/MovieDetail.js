import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import ReviewList from '../../components/ReviewList/ReviewList';
import CastCrew from '../../components/CastCrew/CastCrew';
import VideoGallery from '../../components/VideoGallery/VideoGallery';
import SimilarContent from '../../components/SimilarContent/SimilarContent';
import SeasonDetail from '../../components/SeasonDetail/SeasonDetail';  // Import nuovo componente

import './MovieDetail.css';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const MovieDetail = () => {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const pageFromQuery = parseInt(searchParams.get('page')) || 1;

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [tmdbReviews, setTmdbReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
    fetchTmdbReviews();
    if (currentUser) {
      checkFavoriteStatus();
      checkWatchlistStatus();
      fetchUserReview();
    }
    setSelectedSeasonNumber(null); // reset quando cambio film/serie
  }, [id, currentUser, type]);

  const fetchMovieDetails = async () => {
    try {
      const backendResponse = await axios.get(`${BASE_URL}/api/movies/${type}/${id}`);
      const backendMovie = backendResponse.data.data;

      const tmdbResponse = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}`,
        { params: { api_key: process.env.REACT_APP_TMDB_API_KEY, language: 'it-IT' } }
      );
      const tmdbMovie = tmdbResponse.data;

      if (type === 'tv' && tmdbMovie.seasons) {
        setSeasons(tmdbMovie.seasons.map(season => season.season_number));
      } else {
        setSeasons([]);
      }

      const combinedMovie = {
        ...backendMovie,
        vote_average_tmdb: tmdbMovie.vote_average,
        release_date_tmdb: tmdbMovie.release_date || tmdbMovie.first_air_date,
        title: backendMovie.title || tmdbMovie.title || tmdbMovie.name,
        overview: backendMovie.overview || tmdbMovie.overview,
        poster_path: backendMovie.poster_path || tmdbMovie.poster_path,
        backdrop_path: backendMovie.backdrop_path || tmdbMovie.backdrop_path,
      };

      setMovie(combinedMovie);
    } catch (error) {
      console.error('Errore nel caricamento dei dettagli:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/reviews/${type}/${id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Errore durante il fetch delle recensioni utenti:', error);
    }
  };

  const fetchTmdbReviews = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}/reviews`,
        { params: { api_key: process.env.REACT_APP_TMDB_API_KEY } }
      );
      setTmdbReviews(response.data.results || []);
    } catch (error) {
      console.error('Errore nel caricamento delle recensioni da TMDb:', error);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/reviews/user/${currentUser.id}/${type}/${id}`);
      setUserReview(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setUserReview(null);
      } else {
        console.error('Errore nel fetch della recensione utente:', err);
      }
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/favorites/check/${id}`, { params: { type } });
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Errore nel check dei preferiti:', error);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/watchlist/check/${id}`, { params: { type } });
      setInWatchlist(response.data.inWatchlist);
    } catch (error) {
      console.error('Errore nel check della watchlist:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`${BASE_URL}/api/favorites/${type}/${id}`);
        setIsFavorite(false);
      } else {
        await axios.post(`${BASE_URL}/api/favorites`, { ...movie, type });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Errore toggle preferito:', error);
    }
  };

  const handleWatchlistToggle = async () => {
    try {
      if (inWatchlist) {
        await axios.delete(`${BASE_URL}/api/watchlist/${type}/${id}`);
        setInWatchlist(false);
      } else {
        await axios.post(`${BASE_URL}/api/watchlist`, { movie_id: id, type });
        setInWatchlist(true);
      }
    } catch (error) {
      console.error('Errore toggle watchlist:', error);
    }
  };

  const handleReviewSubmit = () => {
    fetchReviews();
    fetchUserReview();
  };

  const formatVote = (vote) => (typeof vote === 'number' ? vote.toFixed(1) : 'N/A');

  const getAverageUserRating = () => {
    if (!reviews.length) return null;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`}>⭐</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half">⭐½</span>);
    }

    while (stars.length < 5) {
      stars.push(<span key={`empty-${stars.length}`}>☆</span>);
    }

    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  const handleBackClick = () => {
    const currentState = window.history.state || {};
    window.history.replaceState(
      { ...currentState, scrollPosition: window.scrollY },
      ''
    );
    navigate(-1);
  };

  if (loading) return <div className="loading">Caricamento dettagli in corso...</div>;
  if (!movie) return <div className="error">Elemento non trovato</div>;

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
        <div className="main-content">
          <button className="back-button" onClick={handleBackClick}>
            ← Torna alla lista
          </button>

          <div className="movie-header">
            <img
              src={imageUrl}
              alt={movie.title || movie.name}
              className="movie-poster-large"
            />
            <div className="movie-info">
              <h1>{movie.title || movie.name}</h1>
              <p className="movie-overview">{movie.overview}</p>
              <div className="movie-stats">
                <div className="stat">
                  <strong>⭐ TMDb:</strong> {formatVote(movie.vote_average_tmdb)} / 10
                </div>
                <div className="stat">
                  <strong>🧑‍💻 Utenti:</strong>
                  {getAverageUserRating() !== null ? (
                    <>
                      <span style={{ marginLeft: '5px' }}>
                        {renderStarRating(getAverageUserRating())}
                      </span>
                      <span style={{ marginLeft: '8px' }}>
                        (
                        {getAverageUserRating().toFixed(1)} / 5 su {reviews.length}{' '}
                        voto{reviews.length !== 1 ? 'i' : ''})
                      </span>
                    </>
                  ) : (
                    <span> Nessuna valutazione</span>
                  )}
                </div>

                <div className="stat">
                  <strong>📅 Uscita:</strong> {formatDate(movie.release_date_tmdb)}
                </div>
              </div>

              {currentUser && (
                <div className="action-buttons">
                  <button
                    onClick={handleFavoriteToggle}
                    className={`action-btn ${isFavorite ? 'active' : ''}`}
                  >
                    {isFavorite ? '❤️ Rimuovi dai preferiti' : '🤍 Aggiungi ai preferiti'}
                  </button>
                  <button
                    onClick={handleWatchlistToggle}
                    className={`action-btn ${inWatchlist ? 'active' : ''}`}
                  >
                    {inWatchlist ? '📋 Rimuovi dalla Watchlist' : '📝 Aggiungi alla Watchlist'}
                  </button>
                </div>
              )}
            </div>

            <CastCrew id={id} type={type} />
          </div>

          <VideoGallery id={id} type={type} />

          <SimilarContent id={id} type={type} />

          {type === 'tv' && (
            <div className="tv-details-section">
              <h2>Stagioni</h2>
              <div className="season-buttons">
                {seasons.map((seasonNumber) => (
                  <button
                    key={seasonNumber}
                    onClick={() => setSelectedSeasonNumber(seasonNumber)}
                    className={selectedSeasonNumber === seasonNumber ? 'active' : ''}
                  >
                    Stagione {seasonNumber}
                  </button>
                ))}
              </div>

              {selectedSeasonNumber && (
                <SeasonDetail tvId={id} seasonNumber={selectedSeasonNumber} />
              )}
            </div>
          )}

          <div className="reviews-section">
            <h2>Recensioni degli utenti</h2>
            {currentUser && (
              <ReviewForm
                movieId={id}
                type={type}
                existingReview={userReview}
                onReviewSubmit={handleReviewSubmit}
              />
            )}
            <ReviewList reviews={reviews} currentUser={currentUser} />

            <h3>Recensioni pubbliche da TMDb</h3>
            {tmdbReviews.length > 0 ? (
              tmdbReviews.map((rev) => (
                <div key={rev.id} className="tmdb-review">
                  <p>
                    <strong>{rev.author}</strong> ha scritto:
                  </p>
                  <p>{rev.content.length > 300 ? rev.content.slice(0, 300) + '...' : rev.content}</p>
                  <a href={rev.url} target="_blank" rel="noopener noreferrer">
                    Leggi tutta la recensione
                  </a>
                  <hr />
                </div>
              ))
            ) : (
              <p className="no-reviews">Nessuna recensione pubblica trovata su TMDb.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
