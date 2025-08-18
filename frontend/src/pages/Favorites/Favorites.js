import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../../components/MovieCard/MovieCard';
import './Lists.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/favorites');
      // Assumendo che il backend risponda con { favorites: [...] }
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading favorites...</div>;
  }

  return (
    <div className="lists-page">
      <h1>My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="empty-list">
          <p>You haven't added any movies to your favorites yet.</p>
        </div>
      ) : (
        <div className="movies-grid">
          {favorites.map(favorite => (
            <MovieCard key={favorite.movie_id} movie={favorite} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
