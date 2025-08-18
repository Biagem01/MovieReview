const ReviewLike = require('../models/reviewLike');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

class ReviewLikeController {
  static async react(req, res) {
    try {
      const { review_id } = req.params;
      const { is_like } = req.body;
      const user_id = req.userId;

      await ReviewLike.likeOrDislike({ review_id, user_id, is_like });

      // Trova l'autore della recensione
     const review = await Review.findById(review_id);


      if (review && review.user_id !== user_id) {
        const message = is_like
          ? 'ha messo "Mi piace" alla tua recensione.'
          : 'non ha apprezzato la tua recensione.';

        await Notification.create({
          user_id: review.user_id,
          sender_id: user_id,
          type: 'review_reaction',
          message,
          review_id: review_id,
        });
      }

      res.json({ message: 'Reaction saved' });
    } catch (error) {
      console.error('Review like error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getAll(req, res) {
    try {
      const allReactions = await ReviewLike.getAll();
      res.json(allReactions);
    } catch (error) {
      console.error('Errore nel getAll review likes:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getReactions(req, res) {
    try {
      const { review_id } = req.params;
      const likes = await ReviewLike.countLikes(review_id);
      const dislikes = await ReviewLike.countDislikes(review_id);
      res.json({ likes, dislikes });
    } catch (error) {
      console.error('Get reactions error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getUserReaction(req, res) {
    try {
      const { review_id } = req.params;
      const user_id = req.userId;
      const reaction = await ReviewLike.getUserReaction(review_id, user_id);
      res.json({ reaction });
    } catch (error) {
      console.error('Get user reaction error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = ReviewLikeController;
