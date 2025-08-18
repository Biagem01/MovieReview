import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const { fetchUnreadCount } = useNotification();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [movieReviews, setMovieReviews] = useState([]);
  const [tvReviews, setTvReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const allReviews = response.data.reviews || [];
        setMovieReviews(allReviews.filter(r => r.type === 'movie'));
        setTvReviews(allReviews.filter(r => r.type === 'tv'));
      } catch (error) {
        console.error('Errore nel caricamento delle recensioni:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (currentUser) fetchReviews();
  }, [currentUser]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const notifs = Array.isArray(res.data.notifications) ? res.data.notifications : [];
        setNotifications(notifs);
      } catch (error) {
        console.error('Errore nel caricamento notifiche:', error);
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };

    if (currentUser) fetchNotifications();
  }, [currentUser]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: 1 } : notif
        )
      );

      fetchUnreadCount();
    } catch (error) {
      console.error('Errore nel segnare notifica come letta:', error);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profile_image', selectedFile);

    setUploading(true);
    try {
      alert('Profile image upload functionality would be implemented here');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>

        <div className="top-section">
          <div className="profile-info">
            <div className="profile-image-section">
              {currentUser?.profile_image ? (
                <img
                  src={`/uploads/profiles/${currentUser.profile_image}`}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="default-avatar">
                  {currentUser?.username?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  id="profile-image-input"
                />
                <label htmlFor="profile-image-input" className="upload-label">
                  Choose Image
                </label>

                {selectedFile && (
                  <button
                    onClick={handleImageUpload}
                    disabled={uploading}
                    className="upload-btn"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                )}
              </div>
            </div>

            <div className="user-details">
              <div className="detail-item">
                <label>Username:</label>
                <span>{currentUser?.username}</span>
              </div>

              <div className="detail-item">
                <label>Email:</label>
                <span>{currentUser?.email}</span>
              </div>

              <div className="detail-item">
                <label>Member since:</label>
                <span>
                  {currentUser?.created_at
                    ? new Date(currentUser.created_at).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="notifications-section">
            <h2>🔔 Notifiche</h2>
            {loadingNotifications ? (
              <p>Caricamento notifiche...</p>
            ) : notifications.length === 0 ? (
              <p>Nessuna notifica al momento.</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}
                  title={notif.is_read ? "Letta" : "Clicca per segnare come letta e visualizzare"}
                >
                  <p>
                    {notif.sender_username && (
                      <strong>{notif.sender_username}</strong>
                    )}{' '}
                    {notif.message}
                  </p>
                  <small>{new Date(notif.created_at).toLocaleString()}</small>

                  <div className="notification-actions">
                    {!notif.is_read && (
                      <button
                        className="mark-read-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        aria-label="Segna notifica come letta"
                      >
                        ✓ Segna come letta
                      </button>
                    )}

                    {(notif.movie_id && notif.type) && (
                      <button
                        className="details-btn"
                        onClick={() => {
                          const route = notif.type === 'movie' ? `/movie/${notif.movie_id}` : `/tv/${notif.movie_id}`;
                          navigate(route);
                        }}
                        aria-label="Vai ai dettagli"
                      >
                        → Vai ai dettagli
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="reviews-section">
          <h2>🎬 Recensioni Film</h2>
          {loadingReviews ? (
            <p>Caricamento...</p>
          ) : movieReviews.length === 0 ? (
            <p>Nessuna recensione per film trovata.</p>
          ) : (
            movieReviews.map((review) => (
              <Link
                key={review.id}
                to={`/movie/${review.movie_id}`}
                className="review-card-link"
              >
                <div className="review-card">
                  <p><strong>Film:</strong> {review.title}</p>
                  <p><strong>Valutazione:</strong> {review.rating}/5</p>
                  <p><strong>Commento:</strong> {review.review_text}</p>
                  <p><em>{new Date(review.created_at).toLocaleDateString()}</em></p>
                  <p className="details-hint">→ Vai ai dettagli</p>
                </div>
              </Link>
            ))
          )}

          <h2 style={{ marginTop: '2rem' }}>📺 Recensioni Serie TV</h2>
          {loadingReviews ? (
            <p>Caricamento...</p>
          ) : tvReviews.length === 0 ? (
            <p>Nessuna recensione per serie TV trovata.</p>
          ) : (
            tvReviews.map((review) => (
              <Link
                key={review.id}
                to={`/tv/${review.movie_id}`}
                className="review-card-link"
              >
                <div className="review-card">
                  <p><strong>Serie:</strong> {review.title}</p>
                  <p><strong>Valutazione:</strong> {review.rating}/10</p>
                  <p><strong>Commento:</strong> {review.review_text}</p>
                  <p><em>{new Date(review.created_at).toLocaleDateString()}</em></p>
                  <p className="details-hint">→ Vai ai dettagli</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
