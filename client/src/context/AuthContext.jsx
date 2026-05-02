import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set default auth header for axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get('/api/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error('Check auth failed', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await axios.post('/api/auth/login', credentials);
    const { user, token } = res.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    const { user, token } = res.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };


  const forgotPassword = async (email) => {
    const res = await axios.post('/api/auth/forgot-password', { email });
    return res.data;
  };

  const resetPassword = async (token, password) => {
    const res = await axios.post(
      `/api/auth/reset-password/${token}`,
      { password }
    );
    return res.data;
  };

  const updateUserProfile = async (updates) => {
    try {
      const res = await axios.patch('/api/auth/profile', updates);
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error('Update profile failed', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
    user, 
    loading, 
    login, 
    register, 
    logout, 
    forgotPassword,     // 🔥 ADD THIS
    resetPassword,      // 🔥 ALSO ADD THIS
    updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
