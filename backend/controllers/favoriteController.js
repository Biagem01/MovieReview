
const Favorite = require('../models/Favorite');

class FavoriteController {
  static async addToFavorites(req, res) {
    try {
      const { movie_id } = req.body;
      const user_id = req.userId;

      await Favorite.add(user_id, movie_id);
      
      res.status(201).json({ message: 'Movie added to favorites' });
    } catch (error) {
      if (error.message === 'Movie already in favorites') {
        return res.status(400).json({ message: error.message });
      }
      console.error('Add to favorites error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async removeFromFavorites(req, res) {
    try {
      const { movie_id } = req.params;
      const user_id = req.userId;

      const removed = await Favorite.remove(user_id, movie_id);
      
      if (!removed) {
        return res.status(404).json({ message: 'Movie not found in favorites' });
      }

      res.json({ message: 'Movie removed from favorites' });
    } catch (error) {
      console.error('Remove from favorites error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getUserFavorites(req, res) {
    try {
      const user_id = req.userId;
      const favorites = await Favorite.findByUserId(user_id);
      
      res.json({ favorites });
    } catch (error) {
      console.error('Get user favorites error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async checkIfFavorite(req, res) {
    try {
      const { movie_id } = req.params;
      const user_id = req.userId;

      const isFavorite = await Favorite.checkIfFavorite(user_id, movie_id);
      
      res.json({ isFavorite });
    } catch (error) {
      console.error('Check if favorite error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = FavoriteController;
