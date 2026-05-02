import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle, Loader2, CheckCircle, ArrowLeft, Shield } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [debugLink, setDebugLink] = useState('');
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    setDebugLink('');

    try {
      const res = await forgotPassword(email);
      setSuccessMessage(res.message);
      if (res.dev_debug_link) {
        setDebugLink(res.dev_debug_link);
      }
    } catch (err) {
    console.error(err); // 👈 shows real error in console
    setError(err.response?.data?.error || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.05),transparent_40%)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="glass-card p-10 border-brand-primary/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-primary/20">
               <Shield className="w-8 h-8 text-brand-primary" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em] italic mb-2">Forgot Password</h1>
            <p className="text-text-secondary text-xs font-bold uppercase tracking-widest italic">Enter your email to reset access.</p>
          </div>

          {successMessage ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto border border-brand-primary/30">
                 <CheckCircle className="w-10 h-10 text-brand-primary" />
              </div>
              <div className="space-y-4">
                <p className="text-text-secondary text-xs leading-relaxed italic font-bold">
                  {successMessage}
                </p>
                
                <div className="mt-6 p-6 bg-white/5 rounded-2xl border border-white/5 text-left space-y-4">
                     <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                        <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">Simulation: Reset Email Received</p>
                     </div>
                     <p className="text-[11px] text-text-secondary leading-relaxed italic">
                        "We received a request to reset your password. Use the link below to set a new one for your account (<strong>{email}</strong>)."
                     </p>
                     <div className="pt-2">
                        <Link to={debugLink} className="text-brand-primary text-xs font-black hover:text-white transition-colors flex items-center gap-2 group">
                           RESET MY PASSWORD <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                </div>

                <button 
                  onClick={() => navigate('/login')}
                  className="mt-6 btn-terminal py-4 w-full uppercase tracking-widest text-[10px]"
                >
                  Return to Base
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex items-center gap-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all placeholder:text-text-muted"
                    placeholder="entity@example.com"
                  />
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full btn-terminal py-5 text-bg-main text-sm font-black uppercase tracking-[0.2em] group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Transmit Link <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </form>
          )}

          {!successMessage && (
            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <Link 
                to="/login"
                className="inline-flex items-center gap-2 text-[10px] font-black text-text-muted hover:text-white uppercase tracking-widest transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
