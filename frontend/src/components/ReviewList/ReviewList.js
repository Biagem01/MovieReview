import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewList.css';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const ReviewList = ({ reviews, currentUser }) => {
  const [likes, setLikes] = useState({}); 
  // { reviewId: {likes: n, dislikes: m, userLike: 'like' | 'dislike' | null } }

  useEffect(() => {
    const fetchLikes = async () => {
      const formatted = {};
      for (const review of reviews) {
        try {
          const reactionsRes = await axios.get(`${BASE_URL}/api/review-likes/${review.id}/reactions`);
          
          let userReaction = null;
          if (currentUser) {
            const userReactionRes = await axios.get(`${BASE_URL}/api/review-likes/${review.id}/user-reaction`);
            userReaction = userReactionRes.data.reaction;
          }

          formatted[review.id] = {
            likes: reactionsRes.data.likes,
            dislikes: reactionsRes.data.dislikes,
            userLike: userReaction === 1 ? 'like' : userReaction === 0 ? 'dislike' : null,
          };
        } catch (error) {
          console.error(`Errore caricamento reazioni review ${review.id}`, error);
          formatted[review.id] = { likes: 0, dislikes: 0, userLike: null };
        }
      }
      setLikes(formatted);
    };

    if (reviews.length) {
      fetchLikes();
    }
  }, [reviews, currentUser]);

  const handleLikeDislike = async (reviewId, type) => {
    if (!currentUser) {
      alert('Devi essere loggato per mettere like o dislike!');
      return;
    }

    try {
      const is_like = type === 'like' ? 1 : 0;
      await axios.post(`${BASE_URL}/api/review-likes/${reviewId}/reaction`, { is_like });

      setLikes(prev => {
        const current = prev[reviewId] || { likes: 0, dislikes: 0, userLike: null };
        const newState = { ...current };

        if (current.userLike === type) {
          newState[type + 's'] -= 1;
          newState.userLike = null;
        } else {
          if (current.userLike) {
            newState[current.userLike + 's'] -= 1;
          }
          newState[type + 's'] += 1;
          newState.userLike = type;
        }

        return { ...prev, [reviewId]: newState };
      });
    } catch (error) {
      console.error('Errore nel mettere like/dislike', error);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet. Be the first to review this movie!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map(review => {
        const likeData = likes[review.id] || { likes: 0, dislikes: 0, userLike: null };

        return (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                {review.profile_image ? (
                  <img
                    src={`/uploads/profiles/${review.profile_image}`}
                    alt={`${review.username}'s profile`}
                    className="reviewer-avatar"
                  />
                ) : (
                  <div className="reviewer-placeholder">👤</div>
                )}
                <div>
                  <span className="reviewer-name">{review.username}</span>
                  <div className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="review-rating">{'⭐'.repeat(review.rating)}</div>
            </div>

            {review.review_text && <p className="review-text">{review.review_text}</p>}

            <div className="review-actions">
              <button
                className={`like-button ${likeData.userLike === 'like' ? 'active' : ''}`}
                onClick={() => handleLikeDislike(review.id, 'like')}
              >
                👍 {likeData.likes}
              </button>
              <button
                className={`dislike-button ${likeData.userLike === 'dislike' ? 'active' : ''}`}
                onClick={() => handleLikeDislike(review.id, 'dislike')}
              >
                👎 {likeData.dislikes}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
