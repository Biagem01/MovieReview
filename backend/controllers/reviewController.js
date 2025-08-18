const Review = require('../models/Review');
const { validationResult } = require('express-validator');
const axios = require('axios');

class ReviewController {
  static async createReview(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { movie_id, rating, review_text, type } = req.body;  // <-- aggiunto type
      const user_id = req.userId;

      // Check if review already exists
      const existingReview = await Review.findByUserAndMovie(user_id, movie_id, type);
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this movie' });
      }

      const reviewId = await Review.create({
        user_id,
        movie_id,
        rating,
        review_text,
        type
      });

      res.status(201).json({
        message: 'Review created successfully',
        reviewId
      });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getMovieReviews(req, res) {
  try {
    const { movie_id, type = 'movie' } = req.params;  // default a movie
    const reviews = await Review.findByMovieId(movie_id, type);
    res.json({ reviews });
  } catch (error) {
    console.error('Get movie reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


  static async getUserReviews(req, res) {
    try {
      const user_id = req.userId;
      const reviews = await Review.findByUserId(user_id);

      // TMDb API key da env
      const apiKey = process.env.TMDB_API_KEY;

      // Funzione per recuperare titolo da TMDb per ogni recensione
      const fetchTitle = async (type, movie_id) => {
        try {
          const response = await axios.get(`https://api.themoviedb.org/3/${type}/${movie_id}`, {
            params: { api_key: apiKey, language: 'it-IT' }
          });
          return response.data.title || response.data.name || 'Titolo non trovato';
        } catch (err) {
          console.error(`Errore fetching titolo per ${type} ${movie_id}:`, err.message);
          return 'Titolo non trovato';
        }
      };

      // Recupera i titoli paralleli con Promise.all
      const reviewsWithTitles = await Promise.all(
        reviews.map(async (review) => {
          const title = await fetchTitle(review.type, review.movie_id);
          return { ...review, title };
        })
      );

      res.json({ reviews: reviewsWithTitles });
    } catch (error) {
      console.error('Get user reviews error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  
 static async getUserReviewForMovie(req, res) {
  console.log('PARAMS:', req.params);
  try {
    const { user_id, type, movie_id } = req.params;
    const review = await Review.findByUserAndMovie(user_id, movie_id, type);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    console.error('Error fetching user review for movie:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

  static async updateReview(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { rating, review_text } = req.body;
      const user_id = req.userId;

      const updated = await Review.update(id, user_id, { rating, review_text });
      
      if (!updated) {
        return res.status(404).json({ message: 'Review not found or unauthorized' });
      }

      res.json({ message: 'Review updated successfully' });
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId;

      const deleted = await Review.delete(id, user_id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Review not found or unauthorized' });
      }

      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = ReviewController;
