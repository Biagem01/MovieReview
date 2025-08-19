import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    axios.defaults.baseURL = BASE_URL;

    // Interceptor per usare sempre il token aggiornato
    const interceptor = axios.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        delete config.headers['Authorization'];
      }
      return config;
    });

    // Carica inizialmente il numero di notifiche non lette
    fetchUnreadCount();

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('/api/notifications/unread/count');
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error('Errore fetch unread count:', error);
      setUnreadCount(0);
    }
  };

  const value = { unreadCount, setUnreadCount, fetchUnreadCount };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
