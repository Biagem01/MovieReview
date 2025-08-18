import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';  // IMPORTA QUI
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages//Login/Login';
import Register from './pages/Register/Register';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Favorites from './pages/Favorites/Favorites';
import Watchlist from './pages/Watchlist/Watchlist';
import Profile from './pages/Profile/Profile';
import BrowseSection from './pages/BrowseSection/BrowseSection';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider> {/* AVVOLGI QUI */}
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/:type/:id" element={<MovieDetail />} />
                <Route path="/browse" element={<BrowseSection />} />

                <Route 
                  path="/favorites" 
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/watchlist" 
                  element={
                    <ProtectedRoute>
                      <Watchlist />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
