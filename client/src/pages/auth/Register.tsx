import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Register: React.FC = () => {
  const [role, setRole] = useState<'CUSTOMER' | 'SELLER'>('CUSTOMER');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final role decision: email keywords take precedence for auto-assignment
    let finalRole = role;
    if (email.toLowerCase().includes('seller') || email.toLowerCase().includes('farmer')) {
      finalRole = 'SELLER';
    } else if (email.toLowerCase().includes('admin')) {
      // @ts-ignore
      finalRole = 'ADMIN';
    }

    // Save to a simulated "users" database in localStorage
    const usersMap = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    usersMap[email.toLowerCase()] = finalRole;
    localStorage.setItem('registeredUsers', JSON.stringify(usersMap));

    localStorage.setItem('hasRegistered', 'true');
    localStorage.setItem('registeredRole', finalRole);
    navigate('/login', { state: { registered: true } });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-4">
            <Leaf className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold">Join the Community</h1>
          <p className="text-text-secondary mt-2">Start your digital farming journey today.</p>
        </div>

        <div className="flex gap-4 mb-8">
           <button 
            onClick={() => setRole('CUSTOMER')}
            className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${role === 'CUSTOMER' ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-brand-dark text-text-secondary hover:border-brand-primary/50'}`}
          >
            <User className="w-6 h-6" />
            <span className="font-medium">Customer</span>
          </button>
          <button 
            onClick={() => setRole('SELLER')}
            className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${role === 'SELLER' ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-brand-dark text-text-secondary hover:border-brand-primary/50'}`}
          >
            <ShieldCheck className="w-6 h-6" />
            <span className="font-medium">Seller</span>
          </button>
        </div>

        <div className="mb-6 p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-xl">
          <p className="text-xs text-brand-primary font-bold flex items-center gap-2 italic">
            <Mail className="w-4 h-4" /> 
            Note: Use an email containing 'seller', 'farmer', or 'admin' to auto-assign roles.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Full Name</label>
            <input type="text" className="input-field w-full" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Email</label>
            <input 
              type="email" 
              className="input-field w-full" 
              placeholder="john@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Password</label>
            <input type="password" className="input-field w-full" placeholder="••••••••" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Confirm Password</label>
            <input type="password" className="input-field w-full" placeholder="••••••••" required />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg">
              Create Account
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-sm text-text-secondary">
          Already have an account? <Link to="/login" className="text-brand-primary hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
