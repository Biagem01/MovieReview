
const Watchlist = require('../models/Watchlist');

class WatchlistController {
  static async addToWatchlist(req, res) {
    try {
      const { movie_id } = req.body;
      const user_id = req.userId;

      await Watchlist.add(user_id, movie_id);
      
      res.status(201).json({ message: 'Movie added to watchlist' });
    } catch (error) {
      if (error.message === 'Movie already in watchlist') {
        return res.status(400).json({ message: error.message });
      }
      console.error('Add to watchlist error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async removeFromWatchlist(req, res) {
    try {
      const { movie_id } = req.params;
      const user_id = req.userId;

      const removed = await Watchlist.remove(user_id, movie_id);
      
      if (!removed) {
        return res.status(404).json({ message: 'Movie not found in watchlist' });
      }

      res.json({ message: 'Movie removed from watchlist' });
    } catch (error) {
      console.error('Remove from watchlist error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getUserWatchlist(req, res) {
    try {
      const user_id = req.userId;
      const watchlist = await Watchlist.findByUserId(user_id);
      
      res.json({ watchlist });
    } catch (error) {
      console.error('Get user watchlist error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async checkIfInWatchlist(req, res) {
    try {
      const { movie_id } = req.params;
      const user_id = req.userId;

      const inWatchlist = await Watchlist.checkIfInWatchlist(user_id, movie_id);
      
      res.json({ inWatchlist });
    } catch (error) {
      console.error('Check if in watchlist error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = WatchlistController;
