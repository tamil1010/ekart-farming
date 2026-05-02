import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const savedUser = JSON.parse(user);
      if (savedUser.role === 'SELLER') navigate('/seller/dashboard', { replace: true });
      else if (savedUser.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else navigate('/shop', { replace: true });
    }
  }, [navigate]);

  const handleQuickLogin = async (testEmail, testPassword) => {
    setIsLoading(true);
    setError('');
    try {
      setEmail(testEmail);
      setPassword(testPassword);
      await login({ email: testEmail, password: testPassword });
      navigate('/'); // useAuth handles redirection or App.jsx routes handle it
    } catch (error) {
      setError('Quick login failed. User might not exist yet.');
    } finally {
      setIsLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Invalid credentials. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-10 text-center">
          <h1 className="text-3xl text-text-primary font-bold tracking-tight mb-2">Sign in to your account</h1>
          <p className="text-text-muted text-sm">
            Welcome back! Select a method to sign in.
          </p>
        </div>


        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex items-center gap-3">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-primary px-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-text-primary text-sm focus:border-brand-primary outline-none transition-all placeholder:text-text-muted"
              placeholder="m@gmail.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
               <label className="text-xs font-bold text-text-primary">Password</label>
               <Link 
                to="/forgot-password" 
                className="text-[10px] font-bold text-text-muted hover:text-white transition-colors"
               >
                 Forgot password?
               </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-text-primary text-sm focus:border-brand-primary outline-none transition-all placeholder:text-text-muted"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-bg-main font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
          </button>

        </form>

        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-text-muted">
            Don't have an account? <Link to="/register" className="text-brand-primary hover:underline ml-1">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
