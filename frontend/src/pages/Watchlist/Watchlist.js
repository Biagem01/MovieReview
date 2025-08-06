
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../../components/MovieCard/MovieCard';
import '../Favorites/Lists.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

 const fetchWatchlist = async () => {
  try {
    const response = await axios.get('/api/watchlist');
    setWatchlist(response.data.watchlist || []);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    setWatchlist([]);
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return <div className="loading">Loading watchlist...</div>;
  }

  return (
    <div className="lists-page">
      <h1>My Watchlist</h1>
      
      {watchlist.length === 0 ? (
        <div className="empty-list">
          <p>You haven't added any movies to your watchlist yet.</p>
        </div>
      ) : (
        <div className="movies-grid">
          {watchlist.map(item => (
            <MovieCard key={item.movie_id} movie={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
