import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CastCrew.css';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const CastCrew = ({ id, type }) => {
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/movies/${type}/${id}/credits`);
        setCast(response.data.cast || []);
        setCrew(response.data.crew || []);
      } catch (error) {
        console.error('Errore nel caricamento di cast e crew:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id && type) {
      fetchCredits();
    }
  }, [id, type]);

  if (loading) return <p>Caricamento cast e crew...</p>;

  return (
    <div className="cast-crew">
      <h2>Cast</h2>
      <div className="cast-list">
        {cast.slice(0, 10).map((actor) => (
          <div className="person-card" key={actor.id}>
            <img
              className="person-image"
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                  : '/placeholder-profile.jpg'
              }
              alt={actor.name}
            />
            <div className="person-info">
              <strong className="person-name">{actor.name}</strong>
              <span className="person-role">{actor.character}</span>
            </div>
          </div>
        ))}
      </div>

      <h2>Crew principale</h2>
      <div className="crew-list">
        {crew
          .filter((member) =>
            ['Director', 'Writer', 'Screenplay', 'Producer'].includes(member.job)
          )
          .slice(0, 6)
          .map((member) => (
            <div className="person-card" key={member.credit_id}>
              <img
                className="person-image"
                src={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                    : '/placeholder-profile.jpg'
                }
                alt={member.name}
              />
              <div className="person-info">
                <strong className="person-name">{member.name}</strong>
                <span className="person-role">{member.job}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CastCrew;
