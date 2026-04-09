import { useEffect, useState } from 'react';
import { getTeams } from '../services/db';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      const data = await getTeams();
      setTeams(data);
      setLoading(false);
    };
    loadTeams();
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">League Teams</h1>
      
      {loading ? (
        <div className="loading">Loading teams...</div>
      ) : (
        <div className="teams-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {teams.length === 0 ? (
            <p className="no-data">No teams available yet.</p>
          ) : (
            teams.map(team => (
              <div key={team.id} className="team-card glass-panel" style={{
                padding: '2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-base)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'var(--color-primary)',
                  boxShadow: '0 0 15px var(--color-primary-glow)'
                }}>
                  {team.name.charAt(0)}
                </div>
                <h2>{team.name}</h2>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  <p>Points: <span style={{color: 'var(--color-secondary)'}}>{team.points}</span></p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Teams;
