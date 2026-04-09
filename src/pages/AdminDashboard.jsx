import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AdminTeams from '../components/AdminTeams';
import AdminSchedule from '../components/AdminSchedule';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schedule');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="admin-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Manage Schedule
        </button>
        <button 
          className={`tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          Manage Points Table
        </button>
      </div>

      <div className="admin-body">
        {activeTab === 'schedule' ? <AdminSchedule /> : <AdminTeams />}
      </div>
    </div>
  );
};

export default AdminDashboard;
