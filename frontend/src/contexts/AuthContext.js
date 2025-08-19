import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Imposta baseURL di Axios
    axios.defaults.baseURL = BASE_URL;

    // Interceptor per aggiungere sempre il token corrente
    const interceptor = axios.interceptors.request.use(config => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        config.headers['Authorization'] = `Bearer ${storedToken}`;
      } else {
        delete config.headers['Authorization'];
      }
      return config;
    });

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }

    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  // Fetch dell'utente loggato
  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Errore nel fetch dell’utente:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setCurrentUser(user);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login fallito' 
      };
    }
  };

  // Registrazione
  const register = async (username, email, password) => {
    try {
      await axios.post('/api/auth/register', { username, email, password });
      return { success: true, message: 'Registrazione avvenuta con successo' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registrazione fallita' 
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  const value = { currentUser, login, register, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
