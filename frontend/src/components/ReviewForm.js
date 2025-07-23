
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewForm.css';

const ReviewForm = ({ movieId, existingReview, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.review_text || '');
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reviewData = {
        movie_id: movieId,
        rating,
        review_text: reviewText
      };

      if (existingReview) {
        await axios.put(`/api/reviews/${existingReview.id}`, reviewData);
      } else {
        await axios.post('/api/reviews', reviewData);
      }

      onReviewSubmit();
      setIsEditing(false);
      
      if (!existingReview) {
        setRating(5);
        setReviewText('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await axios.delete(`/api/reviews/${existingReview.id}`);
      onReviewSubmit();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  if (existingReview && !isEditing) {
    return (
      <div className="existing-review">
        <h3>Your Review</h3>
        <div className="review-content">
          <div className="review-rating">
            {'⭐'.repeat(existingReview.rating)}
          </div>
          <p className="review-text">{existingReview.review_text}</p>
        </div>
        <div className="review-actions">
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            Edit
          </button>
          <button onClick={handleDelete} className="delete-btn">
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form">
      <h3>{existingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="rating-group">
          <label>Rating:</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>
        
        <div className="text-group">
          <label>Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            rows={4}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
          {existingReview && (
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
