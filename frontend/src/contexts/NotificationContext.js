import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      const res = await axios.get('/api/notifications/unread/count', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error('Errore fetch unread count:', error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    // Imposta baseURL globale
    axios.defaults.baseURL = BASE_URL;

    fetchUnreadCount();
    
    // Aggiorna il count ogni minuto
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const value = { unreadCount, setUnreadCount, fetchUnreadCount };

  return (
    <NotificationContext.Provider value={value}>
      {!loading && children}
    </NotificationContext.Provider>
  );
};
