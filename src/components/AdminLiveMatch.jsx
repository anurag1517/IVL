import { useState, useEffect } from 'react';
import { getTeams, updateTeam } from '../services/db';

const AdminLiveMatch = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pre-Match Config
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [format, setFormat] = useState('3'); // 3 or 5 sets
  const [matchActive, setMatchActive] = useState(false);

  // In-Match State
  const [currentSet, setCurrentSet] = useState(1);
  const [sets, setSets] = useState([]); // Array of { t1: score, t2: score }
  const [currentScore, setCurrentScore] = useState({ t1: 0, t2: 0 });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const data = await getTeams();
    setTeams(data);
    setLoading(false);
  };

  const startMatch = () => {
    if (!team1Id || !team2Id || team1Id === team2Id) {
      alert("Please select two distinct teams");
      return;
    }
    setMatchActive(true);
    setCurrentSet(1);
    setSets([]);
    setCurrentScore({ t1: 0, t2: 0 });
  };

  const handleScore = (team, delta) => {
    setCurrentScore(prev => ({
      ...prev,
      [team]: Math.max(0, prev[team] + delta)
    }));
  };

  const nextSet = () => {
    setSets(prev => [...prev, currentScore]);
    setCurrentScore({ t1: 0, t2: 0 });
    setCurrentSet(prev => prev + 1);
  };

  const finishMatch = async () => {
    if (!window.confirm("Are you sure you want to finish this match and update the points table automatically?")) return;
    
    // Include the current set if scores exist
    let finalSets = [...sets];
    if (currentScore.t1 > 0 || currentScore.t2 > 0 || sets.length === 0) {
        finalSets.push(currentScore);
    }

    // Determine sets won and points diff
    let t1SetsWon = 0;
    let t2SetsWon = 0;
    let t1TotalPoints = 0;
    let t2TotalPoints = 0;

    finalSets.forEach(s => {
      t1TotalPoints += s.t1;
      t2TotalPoints += s.t2;
      if (s.t1 > s.t2) t1SetsWon++;
      if (s.t2 > s.t1) t2SetsWon++;
    });

    const matchWinner = t1SetsWon > t2SetsWon ? 't1' : (t2SetsWon > t1SetsWon ? 't2' : 'draw');
    const t1PointsDiff = t1TotalPoints - t2TotalPoints;
    const t2PointsDiff = t2TotalPoints - t1TotalPoints;

    // Fetch absolute team data to guarantee correct increments
    const fullT1 = teams.find(t => t.id === team1Id);
    const fullT2 = teams.find(t => t.id === team2Id);

    if(!fullT1 || !fullT2) return;

    try {
      // Update Team 1
      await updateTeam(team1Id, {
        played: fullT1.played + 1,
        won: fullT1.won + (matchWinner === 't1' ? 1 : 0),
        lost: fullT1.lost + (matchWinner === 't2' ? 1 : 0),
        points: fullT1.points + (matchWinner === 't1' ? 2 : 0),
        pointsDiff: (fullT1.pointsDiff || 0) + t1PointsDiff
      });

      // Update Team 2
      await updateTeam(team2Id, {
        played: fullT2.played + 1,
        won: fullT2.won + (matchWinner === 't2' ? 1 : 0),
        lost: fullT2.lost + (matchWinner === 't1' ? 1 : 0),
        points: fullT2.points + (matchWinner === 't2' ? 2 : 0),
        pointsDiff: (fullT2.pointsDiff || 0) + t2PointsDiff
      });

      alert("Match Finished! Points table updated.");
      setMatchActive(false);
      fetchTeams(); // refresh state
    } catch (error) {
      console.error("Error finalizing match", error);
      alert("Error saving match results!");
    }
  };

  if (loading) return <div>Loading Live Match Module...</div>;

  const getTeamName = (id) => teams.find(t => t.id === id)?.name || 'Unknown';

  return (
    <div className="admin-content">
      <h2>Live Match Tracker</h2>

      {!matchActive ? (
        <div className="live-setup glass-panel">
          <h3>Set Up New Match</h3>
          <div className="form-row mt-3">
            <select value={team1Id} onChange={(e) => setTeam1Id(e.target.value)} required>
              <option value="">Select Team 1</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <span style={{color:'var(--color-primary)', fontWeight:'bold'}}>VS</span>
            <select value={team2Id} onChange={(e) => setTeam2Id(e.target.value)} required>
              <option value="">Select Team 2</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-row mt-3">
            <label>Match Format:</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="3">Best of 3 Sets</option>
              <option value="5">Best of 5 Sets</option>
            </select>
          </div>
          <button onClick={startMatch} className="btn-primary mt-3 w-100">Start Match</button>
        </div>
      ) : (
        <div className="live-tracker glass-panel">
          <div className="tracker-header">
            <h3>Set {currentSet} <span>(Best of {format})</span></h3>
            <button onClick={() => setMatchActive(false)} className="btn-secondary">Abort Match</button>
          </div>

          <div className="scoreboard">
            {/* Team 1 Board */}
            <div className="team-board">
              <h4>{getTeamName(team1Id)}</h4>
              <div className="score-display">{currentScore.t1}</div>
              <div className="score-controls">
                <button onClick={() => handleScore('t1', -1)} className="btn-danger">-</button>
                <button onClick={() => handleScore('t1', 1)} className="btn-primary">+</button>
              </div>
            </div>

            <div className="vs-divider">VS</div>

            {/* Team 2 Board */}
            <div className="team-board">
              <h4>{getTeamName(team2Id)}</h4>
              <div className="score-display">{currentScore.t2}</div>
              <div className="score-controls">
                <button onClick={() => handleScore('t2', -1)} className="btn-danger">-</button>
                <button onClick={() => handleScore('t2', 1)} className="btn-primary">+</button>
              </div>
            </div>
          </div>

          <div className="previous-sets">
            {sets.length > 0 && <h4>Previous Sets</h4>}
            {sets.map((s, idx) => (
              <div key={idx} className="set-result">
                Set {idx + 1}: {s.t1} - {s.t2}
              </div>
            ))}
          </div>

          <div className="match-actions mt-3">
            {(currentSet < parseInt(format)) ? (
              <button onClick={nextSet} className="btn-secondary">Next Set</button>
            ) : null}
            <button onClick={finishMatch} className="btn-primary">Finish & Save Result</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLiveMatch;
