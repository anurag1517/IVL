import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container animate-fade-in">
      <section className="hero-section">
        <h1 className="hero-title">
          <span className="brand-highlight" style={{ wordSpacing: '0.3em' }}>IIEST VOLLEYBALL LEAGUE</span>
        </h1>
        <p className="hero-subtitle">
          Experience the spike, the passion, the intensity.
        </p>
        <div className="hero-actions">
          <Link to="/schedule" className="btn-primary">View Schedule</Link>
          <Link to="/teams" className="btn-secondary">Explore Teams</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
