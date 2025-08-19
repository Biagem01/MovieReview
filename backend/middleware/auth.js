const db = require('../config/database');

class Movie {
  // Cerca un film per id
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM movies WHERE id = ?',
      [id]
    );
    return rows[0] || null; // ritorna il film o null se non esiste
  }

  // Crea un nuovo film
  static async create(movieData) {
    const {
      id,
      title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      vote_average,
      vote_count,
      genre_ids,
      type
    } = movieData;

    const [result] = await db.execute(
      `INSERT INTO movies 
        (id, title, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, genre_ids, type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, genre_ids, type]
    );

    return result.insertId;
  }

  // Opzionale: funzione per aggiornare un film se vuoi gestire update
  static async update(id, movieData) {
    const {
      title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      vote_average,
      vote_count,
      genre_ids,
      type
    } = movieData;

    await db.execute(
      `UPDATE movies SET 
         title = ?, overview = ?, poster_path = ?, backdrop_path = ?, release_date = ?, 
         vote_average = ?, vote_count = ?, genre_ids = ?, type = ?
       WHERE id = ?`,
      [title, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, genre_ids, type, id]
    );
  }
}

module.exports = Movie;
