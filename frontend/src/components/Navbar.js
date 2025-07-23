
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            MovieReview
          </Link>
          
          <div className="navbar-menu">
            <Link to="/" className="navbar-link">Home</Link>
            
            {currentUser ? (
              <>
                <Link to="/favorites" className="navbar-link">Favorites</Link>
                <Link to="/watchlist" className="navbar-link">Watchlist</Link>
                <Link to="/profile" className="navbar-link">Profile</Link>
                <button onClick={handleLogout} className="btn btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
