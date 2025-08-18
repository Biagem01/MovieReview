import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VideoGallery.css';

const VideoGallery = ({ id, type }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`/api/movies/${type}/${id}/videos`);
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error('Errore nel caricamento dei video:', error);
      }
    };

    fetchVideos();
  }, [id, type]);

  if (!videos.length) {
    return null; // o <p>Nessun video disponibile</p>
  }

  return (
    <div className="video-gallery">
      <h2>🎬 Trailer e Video Promozionali</h2>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-item">
            <iframe
              title={video.name}
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.key}`}
              allowFullScreen
            />
            <p className="video-title">{video.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
