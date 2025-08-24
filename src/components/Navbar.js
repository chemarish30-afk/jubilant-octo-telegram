import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/bookshelf" style={{ color: 'white', textDecoration: 'none' }}>
            📚 Secure Book Reader
          </Link>
        </div>
        
        <ul className="navbar-nav">
          <li>
            <Link to="/bookshelf">Bookshelf</Link>
          </li>
          {user && user.is_admin && (
            <li>
              <Link to="/upload">Upload Book</Link>
            </li>
          )}
        </ul>
        
        <div className="navbar-user">
          <span>Welcome, {user.username}</span>
          {user.is_admin && <span>(Admin)</span>}
          <button 
            onClick={onLogout}
            className="btn btn-secondary"
            style={{ padding: '5px 10px', fontSize: '14px' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
