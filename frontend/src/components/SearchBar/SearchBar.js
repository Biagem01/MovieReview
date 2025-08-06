
import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, contentType }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, contentType);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder={`Search for ${contentType === 'tv' ? 'TV shows' : 'movies'}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
