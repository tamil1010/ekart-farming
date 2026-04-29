import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Store, User, Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const Register = () => {
  const [role, setRole] = useState('CUSTOMER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role
      });
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          (typeof err.response?.data === 'string' ? err.response.data : null) ||
                          'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-10 text-center">
          <h1 className="text-3xl text-text-primary font-bold tracking-tight mb-2">Create an account</h1>
          <p className="text-text-muted text-sm">
            Join the decentralized agricultural network today.
          </p>
        </div>

        <div className="flex gap-4 mb-10">
           <button 
            onClick={() => setRole('CUSTOMER')}
            className={`flex-1 py-3 px-4 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest ${role === 'CUSTOMER' ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-white/5 bg-white/5 text-text-muted hover:text-white hover:border-white/20'}`}
          >
            Customer
          </button>
          <button 
            onClick={() => setRole('SELLER')}
            className={`flex-1 py-3 px-4 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest ${role === 'SELLER' ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-white/5 bg-white/5 text-text-muted hover:text-white hover:border-white/20'}`}
          >
            Seller
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex flex-col gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-primary px-1">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-text-primary text-sm focus:border-brand-primary outline-none transition-all placeholder:text-text-muted" 
              placeholder="Evil Rabbit" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-primary px-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-text-primary text-sm focus:border-brand-primary outline-none transition-all placeholder:text-text-muted" 
              placeholder="example@acm.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-primary px-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-text-primary text-sm focus:border-brand-primary outline-none transition-all placeholder:text-text-muted" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-primary px-1">Confirm Password</label>
            <input 
              type="password" 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-text-primary text-sm focus:border-brand-primary outline-none transition-all placeholder:text-text-muted" 
              placeholder="••••••••" 
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required 
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-bg-main font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center underline-none"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create account"}
            </button>
          </div>
        </form>

        <p className="text-center mt-10 text-xs font-medium text-text-muted">
          Already have an account? <Link to="/login" className="text-brand-primary hover:underline ml-1">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
