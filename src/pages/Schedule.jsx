import { useEffect, useState } from 'react';
import { getMatches } from '../services/db';
import './Schedule.css';

const Schedule = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      const data = await getMatches();
      setMatches(data);
      setLoading(false);
    };
    loadMatches();
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">Match Schedule</h1>
      
      {loading ? (
        <div className="loading">Loading schedule...</div>
      ) : (
        <div className="schedule-grid">
          {matches.length === 0 ? (
            <p className="no-data">No matches scheduled yet.</p>
          ) : (
            matches.map((match) => (
              <div key={match.id} className="match-card glass-panel">
                <div className="match-date-time">
                  <span className="match-date">{new Date(match.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</span>
                  <span className="match-time">{match.time}</span>
                </div>
                <div className="match-teams">
                  <div className="team">{match.team1}</div>
                  <div className="vs">VS</div>
                  <div className="team">{match.team2}</div>
                </div>
                {match.venue && (
                  <div className="match-venue">
                    📍 {match.venue}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Schedule;
