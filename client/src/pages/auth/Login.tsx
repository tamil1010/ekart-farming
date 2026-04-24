import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { Leaf, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasRegistered = localStorage.getItem('hasRegistered');
    const user = localStorage.getItem('user');
    
    // If not registered and not logged in, force registration
    if (!hasRegistered && !user) {
      navigate('/register', { replace: true });
    }
  }, [navigate]);

  const handleQuickLogin = async (testEmail: string, testPassword: string) => {
    try {
      setEmail(testEmail);
      setPassword(testPassword);
      await login({ email: testEmail, password: testPassword });
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (savedUser.role === 'SELLER') navigate('/seller/dashboard');
      else if (savedUser.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/shop');
    } catch (error) {
      setError('Quick login failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (savedUser.role === 'SELLER') navigate('/seller/dashboard');
      else if (savedUser.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/shop');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-4">
            <Leaf className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold">Welcome Back</h1>
          <p className="text-text-secondary mt-2 text-center">
            Login to your eKart Farming account to manage your marketplace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full pl-12"
                placeholder="farmer@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full pl-12"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg">
            Sign In
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-dark flex flex-col gap-4 text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account? <Link to="/register" className="text-brand-primary hover:underline">Register now</Link>
          </p>
          
          <div className="grid grid-cols-1 gap-2">
            <button 
                onClick={() => handleQuickLogin('customer@test.com', '123456')}
                className="text-xs text-text-secondary hover:text-brand-primary"
            >
                Quick Login: Customer
            </button>
            <button 
                onClick={() => handleQuickLogin('seller@test.com', '123456')}
                className="text-xs text-text-secondary hover:text-brand-primary"
            >
                Quick Login: Seller
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
