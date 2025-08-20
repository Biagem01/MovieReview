import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const { currentUser, updateCurrentUser } = useAuth(); // Aggiornato: prendo anche la funzione per aggiornare lo state
  const { fetchUnreadCount } = useNotification();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [movieReviews, setMovieReviews] = useState([]);
  const [tvReviews, setTvReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // Fetch user reviews
  useEffect(() => {
    if (!currentUser) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/reviews/user`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const allReviews = res.data.reviews || [];
        setMovieReviews(allReviews.filter(r => r.type === 'movie'));
        setTvReviews(allReviews.filter(r => r.type === 'tv'));
      } catch (err) {
        console.error('Errore nel caricamento delle recensioni:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [currentUser]);

  // Fetch notifications
  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/notifications`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        setNotifications(Array.isArray(res.data.notifications) ? res.data.notifications : []);
      } catch (err) {
        console.error('Errore nel caricamento notifiche:', err);
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${BASE_URL}/api/notifications/${notificationId}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: 1 } : n))
      );
      fetchUnreadCount();
    } catch (err) {
      console.error('Errore nel segnare notifica come letta:', err);
    }
  };

  const handleFileSelect = (e) => setSelectedFile(e.target.files[0]);

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('profile_image', selectedFile);

    setUploading(true);
    try {
      const res = await axios.put(`${BASE_URL}/api/auth/profile/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      // Aggiorna currentUser con la nuova immagine
      updateCurrentUser({ ...currentUser, profile_image: res.data.profile_image });
      setSelectedFile(null);
      alert('Immagine caricata con successo!');
    } catch (err) {
      console.error('Errore upload immagine:', err);
      alert('Errore caricamento immagine');
    } finally {
      setUploading(false);
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
                <img src={`${BASE_URL}/uploads/${currentUser.profile_image}`} alt="Profile" className="profile-image" />
              ) : (
                <div className="default-avatar">{currentUser?.username?.charAt(0).toUpperCase()}</div>
              )}

              <div className="image-upload">
                <input type="file" accept="image/*" onChange={handleFileSelect} id="profile-image-input" />
                <label htmlFor="profile-image-input" className="upload-label">Choose Image</label>
                {selectedFile && (
                  <button onClick={handleImageUpload} disabled={uploading} className="upload-btn">
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                )}
              </div>
            </div>

            <div className="user-details">
              <div className="detail-item"><label>Username:</label> <span>{currentUser?.username}</span></div>
              <div className="detail-item"><label>Email:</label> <span>{currentUser?.email}</span></div>
              <div className="detail-item"><label>Member since:</label> <span>{currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'N/A'}</span></div>
            </div>
          </div>

          <div className="notifications-section">
            <h2>🔔 Notifiche</h2>
            {loadingNotifications ? (
              <p>Caricamento notifiche...</p>
            ) : notifications.length === 0 ? (
              <p>Nessuna notifica al momento.</p>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}>
                  <p>{notif.sender_username && <strong>{notif.sender_username}</strong>} {notif.message}</p>
                  <small>{new Date(notif.created_at).toLocaleString()}</small>
                  <div className="notification-actions">
                    {!notif.is_read && (
                      <button onClick={e => { e.stopPropagation(); markAsRead(notif.id); }} className="mark-read-btn">✓ Segna come letta</button>
                    )}
                    {notif.movie_id && notif.type && (
                      <button onClick={() => navigate(notif.type === 'movie' ? `/movie/${notif.movie_id}` : `/tv/${notif.movie_id}`)} className="details-btn">→ Vai ai dettagli</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="reviews-section">
          <h2>🎬 Recensioni Film</h2>
          {loadingReviews ? <p>Caricamento...</p> :
            movieReviews.length === 0 ? <p>Nessuna recensione per film trovata.</p> :
              movieReviews.map(review => (
                <Link key={review.id} to={`/movie/${review.movie_id}`} className="review-card-link">
                  <div className="review-card">
                    <p><strong>Film:</strong> {review.title}</p>
                    <p><strong>Valutazione:</strong> {review.rating}/5</p>
                    <p><strong>Commento:</strong> {review.review_text}</p>
                    <p><em>{new Date(review.created_at).toLocaleDateString()}</em></p>
                    <p className="details-hint">→ Vai ai dettagli</p>
                  </div>
                </Link>
              ))
          }

          <h2 style={{ marginTop: '2rem' }}>📺 Recensioni Serie TV</h2>
          {loadingReviews ? <p>Caricamento...</p> :
            tvReviews.length === 0 ? <p>Nessuna recensione per serie TV trovata.</p> :
              tvReviews.map(review => (
                <Link key={review.id} to={`/tv/${review.movie_id}`} className="review-card-link">
                  <div className="review-card">
                    <p><strong>Serie:</strong> {review.title}</p>
                    <p><strong>Valutazione:</strong> {review.rating}/10</p>
                    <p><strong>Commento:</strong> {review.review_text}</p>
                    <p><em>{new Date(review.created_at).toLocaleDateString()}</em></p>
                    <p className="details-hint">→ Vai ai dettagli</p>
                  </div>
                </Link>
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default Profile;
