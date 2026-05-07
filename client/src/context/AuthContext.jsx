import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

axios.defaults.baseURL = "https://ekart-farming.onrender.com";

const AuthContext = createContext();

// ✅ Toast Context
const ToastContext = createContext();

// ✅ Toast Component
const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md text-sm font-semibold min-w-[280px] max-w-[380px] animate-in slide-in-from-right-8 duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-500/40 text-emerald-200'
              : toast.type === 'error'
              ? 'bg-red-900/90 border-red-500/40 text-red-200'
              : toast.type === 'warning'
              ? 'bg-yellow-900/90 border-yellow-500/40 text-yellow-200'
              : 'bg-gray-900/90 border-gray-500/40 text-gray-200'
          }`}
        >
          {/* Icon */}
          <span className="text-lg flex-shrink-0">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>

          {/* Message */}
          <span className="flex-1">{toast.message}</span>

          {/* Close button */}
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// ✅ Combined Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // ✅ Toast functions
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const toast = {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    warning: (msg) => showToast(msg, 'warning'),
    info: (msg) => showToast(msg, 'info'),
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
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
    try {
      const res = await axios.post('/api/auth/login', credentials);
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);
      return user;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      toast.error(msg);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      toast.success('Account created successfully!');
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      toast.error(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('You have been logged out.');
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      toast.success('Reset link sent! Check your email.');
      return res.data;
    } catch (err) {
      toast.error('Failed to send reset link.');
      throw err;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, { password });
      toast.success('Password reset successful! Please login.');
      return res.data;
    } catch (err) {
      toast.error('Password reset failed. Link may have expired.');
      throw err;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      const res = await axios.patch('/api/auth/profile', updates);
      setUser(res.data);
      toast.success('Profile updated successfully!');
      return res.data;
    } catch (err) {
      toast.error('Failed to update profile.');
      throw err;
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      <AuthContext.Provider value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateUserProfile,
        toast,
      }}>
        {children}
        {/* ✅ Toast rendered here so it's always on top */}
        <Toast toasts={toasts} removeToast={removeToast} />
      </AuthContext.Provider>
    </ToastContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// ✅ Use this anywhere to show toasts without auth
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within an AuthProvider');
  return context;
};
