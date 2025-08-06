const db = require('../config/database');

class Movie {
  static async create(movieData) {
    // Distrutturiamo con valori default null per evitare undefined
    // Per il titolo usiamo title o name (tv show)
    const {
      id,
      title,
      name,
      overview = null,
      poster_path = null,
      backdrop_path = null,
      release_date = null,
      vote_average = null,
      vote_count = null,
      genre_ids = null,
    } = movieData;

    // Se non esiste né title né name, fallback a null (ma da DB non deve essere null)
    const finalTitle = title || name || 'Untitled';

    // Conversione release_date in formato YYYY-MM-DD o null se non valida
    let formattedDate = null;
    if (release_date) {
      const dateObj = new Date(release_date);
      if (!isNaN(dateObj)) {
        formattedDate = dateObj.toISOString().split('T')[0]; // estrae solo la data senza tempo
      }
    }

    // Se genre_ids è un array, lo convertiamo in stringa JSON, altrimenti null
    const genreIdsStr = Array.isArray(genre_ids) ? JSON.stringify(genre_ids) : null;

    const [result] = await db.execute(
      `INSERT INTO movies 
       (id, title, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, genre_ids) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
         title = VALUES(title),
         overview = VALUES(overview),
         poster_path = VALUES(poster_path),
         backdrop_path = VALUES(backdrop_path),
         release_date = VALUES(release_date),
         vote_average = VALUES(vote_average),
         vote_count = VALUES(vote_count),
         genre_ids = VALUES(genre_ids)`,
      [id, finalTitle, overview, poster_path, backdrop_path, formattedDate, vote_average, vote_count, genreIdsStr]
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
