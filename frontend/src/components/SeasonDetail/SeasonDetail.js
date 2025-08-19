import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SeasonDetail.css'; // Se vuoi, puoi aggiungere uno stile dedicato

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const SeasonDetail = ({ tvId, seasonNumber }) => {
  const [seasonData, setSeasonData] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodeDetails, setEpisodeDetails] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [loadingEpisode, setLoadingEpisode] = useState(false);

  useEffect(() => {
    if (!seasonNumber) return;

    const fetchSeason = async () => {
      setLoadingSeason(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/movies/tv/${tvId}/season/${seasonNumber}`);
        setSeasonData(res.data);
        setSelectedEpisode(null);
        setEpisodeDetails(null);
      } catch (err) {
        console.error('Errore caricamento stagione:', err);
        setSeasonData(null);
      } finally {
        setLoadingSeason(false);
      }
    };

    fetchSeason();
  }, [tvId, seasonNumber]);

  const fetchEpisode = async (episodeNumber) => {
    setLoadingEpisode(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/movies/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);
      setEpisodeDetails(res.data);
      setSelectedEpisode(episodeNumber);
    } catch (err) {
      console.error('Errore caricamento episodio:', err);
      setEpisodeDetails(null);
    } finally {
      setLoadingEpisode(false);
    }
  };

  if (!seasonNumber) return <p>Seleziona una stagione per visualizzarne gli episodi.</p>;
  if (loadingSeason) return <p>Caricamento dettagli stagione...</p>;
  if (!seasonData) return <p>Nessun dato disponibile per questa stagione.</p>;

  return (
    <div className="season-detail">
      <h3>Stagione {seasonNumber}</h3>
      <ul className="episode-list">
        {seasonData.episodes.map(episode => (
          <li key={episode.id}>
            <button
              onClick={() => fetchEpisode(episode.episode_number)}
              className={selectedEpisode === episode.episode_number ? 'active' : ''}
            >
              {episode.episode_number}. {episode.name}
            </button>
          </li>
        ))}
      </ul>

      {loadingEpisode && <p>Caricamento dettagli episodio...</p>}

      {episodeDetails && !loadingEpisode && (
        <div className="episode-details">
          <h4>
            Episodio {episodeDetails.episode_number}: {episodeDetails.name}
          </h4>
          <p>{episodeDetails.overview || 'Nessuna descrizione disponibile.'}</p>
          {episodeDetails.still_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${episodeDetails.still_path}`}
              alt={episodeDetails.name}
              className="episode-image"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SeasonDetail;
