import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { unreadCount, fetchUnreadCount } = useNotification();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('.navbar');
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUnreadCount();
    }
  }, [currentUser, fetchUnreadCount]);

  const renderLinks = () => (
    <>
      <Link to="/" className="nav-link" onClick={() => setIsMobileOpen(false)}>Home</Link>
      {currentUser ? (
        <>
          <Link to="/favorites" className="nav-link" onClick={() => setIsMobileOpen(false)}>Favorites</Link>
          <Link to="/watchlist" className="nav-link" onClick={() => setIsMobileOpen(false)}>Watchlist</Link>
          <Link to="/profile" className="nav-link profile-link" onClick={() => setIsMobileOpen(false)}>
            Profile
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="nav-link" onClick={() => setIsMobileOpen(false)}>Login</Link>
          <Link to="/register" className="nav-link" onClick={() => setIsMobileOpen(false)}>Register</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">🎬 MovieReviews</Link>

        {/* DESKTOP */}
        <div className="nav-content desktop-only">
          <div className="nav-menu">{renderLinks()}</div>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className={`hamburger ${isMobileOpen ? 'open' : ''}`}
          onClick={() => setIsMobileOpen((p) => !p)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileOpen && (
        <div className="mobile-menu">
          {renderLinks()}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
