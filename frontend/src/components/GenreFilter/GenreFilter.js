
import React from 'react';

const GenreFilter = ({ genres, selectedGenre, onGenreChange }) => {
  return (
    <div className="form-group">
      <label>Filter by Genre:</label>
      <select 
        value={selectedGenre} 
        onChange={(e) => onGenreChange(e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map(genre => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenreFilter;
