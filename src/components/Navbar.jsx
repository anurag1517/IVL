import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-highlight">IVL</span>
        </Link>
        <div className="nav-links">
          <Link to="/teams" className={`nav-link ${isActive('/teams')}`}>Teams</Link>
          <Link to="/schedule" className={`nav-link ${isActive('/schedule')}`}>Schedule</Link>
          <Link to="/points" className={`nav-link ${isActive('/points')}`}>Points Table</Link>
        </div>
        <div className="nav-actions">
          <Link to="/admin" className="admin-btn">Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
