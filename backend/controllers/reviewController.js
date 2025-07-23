
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { validationResult } = require('express-validator');

class ReviewController {
  static async createReview(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { movie_id, rating, review_text } = req.body;
      const user_id = req.userId;

      // Check if review already exists
      const existingReview = await Review.findByUserAndMovie(user_id, movie_id);
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this movie' });
      }

      const reviewId = await Review.create({
        user_id,
        movie_id,
        rating,
        review_text
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
      const { movie_id } = req.params;
      const reviews = await Review.findByMovieId(movie_id);
      
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
      
      res.json({ reviews });
    } catch (error) {
      console.error('Get user reviews error:', error);
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
