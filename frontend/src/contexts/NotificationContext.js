import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Imposta baseURL e header Authorization
  useEffect(() => {
    axios.defaults.baseURL = BASE_URL;
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchUnreadCount();
  }, []);

  // Fetch del numero di notifiche non lette
  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('/api/notifications/unread/count');
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error('Errore fetch unread count:', error);
      setUnreadCount(0);
    }
  };

  const value = {
    unreadCount,
    setUnreadCount,
    fetchUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
