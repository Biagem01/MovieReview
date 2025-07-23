
import React from 'react';
import './ReviewList.css';

const ReviewList = ({ reviews, currentUser }) => {
  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet. Be the first to review this movie!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map(review => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <div className="reviewer-info">
              {review.profile_image && (
                <img 
                  src={`/uploads/profiles/${review.profile_image}`} 
                  alt={review.username}
                  className="reviewer-avatar"
                />
              )}
              <span className="reviewer-name">{review.username}</span>
            </div>
            <div className="review-rating">
              {'⭐'.repeat(review.rating)}
            </div>
          </div>
          
          {review.review_text && (
            <p className="review-text">{review.review_text}</p>
          )}
          
          <div className="review-date">
            {new Date(review.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
