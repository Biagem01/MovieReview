import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('/api/notifications/unread/count', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Errore fetch unread count:', error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, fetchUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
