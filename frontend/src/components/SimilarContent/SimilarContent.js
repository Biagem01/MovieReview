// src/components/SimilarContent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../MovieCard/MovieCard';
import './SimilarContent.css';

const SimilarContent = ({ id, type }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const response = await axios.get(`/api/movies/${type}/${id}/similar`);
        setSimilar(response.data.results || []);
      } catch (error) {
        console.error('Errore nel recupero dei contenuti simili:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [id, type]);

  if (loading) return <p className="loading-text">Caricamento contenuti simili...</p>;
  if (!similar.length) return null;

  return (
    <div className="similar-section">
      <h2>🎬 Contenuti simili</h2>
      <div className="similar-grid">
        {similar.slice(0, 5).map((item) => (
          <MovieCard key={item.id} movie={item} contentType={type} />
        ))}
      </div>
    </div>
  );
};

export default SimilarContent;
