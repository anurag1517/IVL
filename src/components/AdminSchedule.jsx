import { useState, useEffect } from 'react';
import { getMatches, addMatch, deleteMatch } from '../services/db';

const AdminSchedule = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    date: '',
    time: '',
    venue: '',
    status: 'upcoming'
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const data = await getMatches();
    setMatches(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMatch = async (e) => {
    e.preventDefault();
    if (!formData.team1 || !formData.team2 || !formData.date) return;
    
    await addMatch(formData);
    setFormData({
      team1: '',
      team2: '',
      date: '',
      time: '',
      venue: '',
      status: 'upcoming'
    });
    fetchMatches();
  };

  const handleDeleteMatch = async (id) => {
    if(window.confirm('Are you sure you want to delete this match?')) {
      await deleteMatch(id);
      fetchMatches();
    }
  };

  if (loading) return <div>Loading schedule...</div>;

  return (
    <div className="admin-content">
      <h2>Manage Schedule</h2>
      
      <form onSubmit={handleAddMatch} className="add-form glass-panel flex-column">
        <div className="form-row">
          <input type="text" name="team1" placeholder="Team 1" value={formData.team1} onChange={handleChange} required />
          <span>vs</span>
          <input type="text" name="team2" placeholder="Team 2" value={formData.team2} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>
        <input type="text" name="venue" placeholder="Venue Location" value={formData.venue} onChange={handleChange} />
        
        <button type="submit" className="btn-primary mt-2">Add Match</button>
      </form>

      <div className="matches-list mt-3">
        {matches.map(match => (
          <div key={match.id} className="match-admin-card glass-panel">
            <div className="match-info">
              <strong>{match.team1} vs {match.team2}</strong>
              <p>{match.date} | {match.time} | {match.venue}</p>
            </div>
            <button onClick={() => handleDeleteMatch(match.id)} className="btn-danger">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSchedule;
