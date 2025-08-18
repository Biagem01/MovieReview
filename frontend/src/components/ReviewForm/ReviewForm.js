import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ReviewForm.css';

const StarRating = ({ rating, setRating, selectedStar, setSelectedStar }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${rating >= star ? 'filled' : ''} ${selectedStar === star ? 'selected' : ''}`}
          onClick={() => {
            setRating(star);
            setSelectedStar(star);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setRating(star);
              setSelectedStar(star);
            }
          }}
          aria-label={`${star} star`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewForm = ({ movieId,type, existingReview, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [selectedStar, setSelectedStar] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Ref per focus dopo chiusura modale
  const deleteButtonRef = useRef(null);

  // Ref per salvare la posizione scroll
  const scrollPosition = useRef(0);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.review_text || '');
      setSelectedStar(null);
    } else {
      setSelectedStar(null);
    }
  }, [existingReview]);

  // Blocca scroll mantenendo posizione quando modale aperta
  useEffect(() => {
    if (showDeleteConfirm) {
      scrollPosition.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';

      window.scrollTo(0, scrollPosition.current);
      // Ritorna focus al bottone delete dopo chiusura
      deleteButtonRef.current?.focus();
    }

    return () => {
      // Cleanup in caso di smontaggio
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
    };
  }, [showDeleteConfirm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reviewData = {
        movie_id: movieId,
        rating,
        review_text: reviewText,
         type,
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
        setSelectedStar(null);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
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
      <>
        <div className="existing-review">
          <h3>Your Review</h3>
          <div className="review-content">
            <div className="review-rating">{'⭐'.repeat(existingReview.rating)}</div>
            <p className="review-text">{existingReview.review_text}</p>
          </div>
          <div className="review-actions">
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit
            </button>
            <button
              ref={deleteButtonRef} // ref qui per il focus
              onClick={(e) => {
                e.stopPropagation();
                // Rimuoviamo lo scrollTo in cima per mantenere la posizione
                setShowDeleteConfirm(true);
              }}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div
            className="modal-overlay"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h4>Conferma Eliminazione</h4>
              <p>Sei sicuro di voler eliminare questa recensione?</p>
              <div className="modal-buttons">
                <button
                  className="confirm-btn"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    handleDelete();
                  }}
                >
                  Sì, elimina
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="review-form">
      <h3>{existingReview ? 'Edit Your Review' : 'Write a Review'}</h3>

      <form onSubmit={handleSubmit}>
        <div className="rating-group">
          <label>Rating:</label>
          <StarRating
            rating={rating}
            setRating={setRating}
            selectedStar={selectedStar}
            setSelectedStar={setSelectedStar}
          />
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
            {loading
              ? 'Submitting...'
              : existingReview
              ? 'Update Review'
              : 'Submit Review'}
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
