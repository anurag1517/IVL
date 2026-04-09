import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-highlight">IVL</span>
        </Link>
        
        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </div>
        
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/teams" className={`nav-link ${isActive('/teams')}`} onClick={closeMenu}>Teams</Link>
          <Link to="/schedule" className={`nav-link ${isActive('/schedule')}`} onClick={closeMenu}>Schedule</Link>
          <Link to="/points" className={`nav-link ${isActive('/points')}`} onClick={closeMenu}>Points Table</Link>
          <Link to="/admin" className="admin-btn mobile-admin-btn" onClick={closeMenu}>Admin</Link>
        </div>

        <div className="nav-actions">
          <Link to="/admin" className="admin-btn desktop-admin-btn">Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
