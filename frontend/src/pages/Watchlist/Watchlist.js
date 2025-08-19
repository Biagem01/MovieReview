import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../../components/MovieCard/MovieCard';
import '../Favorites/Lists.css';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/watchlist`);
        setWatchlist(res.data.watchlist || []);
      } catch (err) {
        console.error('Errore nel fetch della watchlist:', err);
        setWatchlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

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
