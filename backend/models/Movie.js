
const db = require('../config/database');

class Movie {
  static async create(movieData) {
    const { id, title, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, genre_ids } = movieData;
    
    const [result] = await db.execute(
      'INSERT INTO movies (id, title, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, genre_ids) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), overview = VALUES(overview), poster_path = VALUES(poster_path), backdrop_path = VALUES(backdrop_path), release_date = VALUES(release_date), vote_average = VALUES(vote_average), vote_count = VALUES(vote_count), genre_ids = VALUES(genre_ids)',
      [id, title, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, JSON.stringify(genre_ids)]
    );
    
    return result;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM movies WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async getAll(limit = 20, offset = 0) {
    const [rows] = await db.execute(
      'SELECT * FROM movies ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }
}

module.exports = Movie;
