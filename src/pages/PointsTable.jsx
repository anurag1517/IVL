import { useEffect, useState } from 'react';
import { getTeams } from '../services/db';
import './PointsTable.css';

const PointsTable = () => {
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
      <h1 className="page-title">Points Table</h1>
      
      {loading ? (
        <div className="loading">Loading standings...</div>
      ) : (
        <div className="table-wrapper glass-panel">
          <table className="points-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>Played</th>
                <th>Won</th>
                <th>Lost</th>
                <th>Points Diff</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No team data available</td>
                </tr>
              ) : (
                teams.map((team, index) => (
                  <tr key={team.id}>
                    <td>{index + 1}</td>
                    <td className="team-name">{team.name}</td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.lost}</td>
                    <td>{team.pointsDiff || 0}</td>
                    <td className="team-points">{team.points}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PointsTable;
