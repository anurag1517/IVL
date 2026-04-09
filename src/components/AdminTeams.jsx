import { useState, useEffect } from 'react';
import { getTeams, addTeam, updateTeam, deleteTeam } from '../services/db';

const AdminTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    const data = await getTeams();
    setTeams(data);
    setLoading(false);
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    await addTeam({ name: newTeamName });
    setNewTeamName('');
    fetchTeams();
  };

  const handleUpdateStats = async (id, field, value, currentVal) => {
    const numValue = parseInt(value) || 0;
    await updateTeam(id, { [field]: currentVal + numValue });
    fetchTeams();
  };

  const handleDeleteTeam = async (id) => {
    if(window.confirm('Are you sure you want to delete this team?')) {
      await deleteTeam(id);
      fetchTeams();
    }
  };

  if (loading) return <div>Loading teams...</div>;

  return (
    <div className="admin-content">
      <h2>Manage Teams / Points Table</h2>
      
      <form onSubmit={handleAddTeam} className="add-form glass-panel">
        <input 
          type="text" 
          placeholder="New Team Name" 
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
        />
        <button type="submit" className="btn-primary">Add Team</button>
      </form>

      <div className="teams-list">
        {teams.map(team => (
          <div key={team.id} className="team-admin-card glass-panel">
            <div className="team-header">
              <h3>{team.name}</h3>
              <button 
                onClick={() => handleDeleteTeam(team.id)} 
                className="btn-danger"
              >
                Delete
              </button>
            </div>
            <div className="team-stats-controls">
              <div className="stat-control">
                <span>Played: {team.played}</span>
                <button onClick={() => handleUpdateStats(team.id, 'played', 1, team.played)}>+</button>
                <button onClick={() => handleUpdateStats(team.id, 'played', -1, team.played)}>-</button>
              </div>
              <div className="stat-control">
                <span>Won: {team.won}</span>
                <button onClick={() => handleUpdateStats(team.id, 'won', 1, team.won)}>+</button>
                <button onClick={() => handleUpdateStats(team.id, 'won', -1, team.won)}>-</button>
              </div>
              <div className="stat-control">
                <span>Lost: {team.lost}</span>
                <button onClick={() => handleUpdateStats(team.id, 'lost', 1, team.lost)}>+</button>
                <button onClick={() => handleUpdateStats(team.id, 'lost', -1, team.lost)}>-</button>
              </div>
              <div className="stat-control">
                <span>Points: {team.points}</span>
                <button onClick={() => handleUpdateStats(team.id, 'points', 2, team.points)}>+2</button>
                <button onClick={() => handleUpdateStats(team.id, 'points', -2, team.points)}>-2</button>
              </div>
              <div className="stat-control">
                <span>Points Diff: {team.pointsDiff || 0}</span>
                <button onClick={() => handleUpdateStats(team.id, 'pointsDiff', 1, team.pointsDiff || 0)}>+</button>
                <button onClick={() => handleUpdateStats(team.id, 'pointsDiff', -1, team.pointsDiff || 0)}>-</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTeams;
