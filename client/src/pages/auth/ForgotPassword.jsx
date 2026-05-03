import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Mail, ArrowRight, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

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
      if (res.dev_debug_link) setDebugLink(res.dev_debug_link);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">

        {successMessage ? (
          <div className="text-center space-y-6">
            {/* Success icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)' }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: 'rgb(34,197,94)' }} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Check your email</h2>
              <p className="text-text-muted text-sm">{successMessage}</p>
            </div>

            {debugLink && (
              <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl text-left space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Dev Mode — Reset Link</p>
                </div>
                <p className="text-xs text-text-secondary">
                  Sent to <strong className="text-white">{email}</strong>
                </p>
                <Link
                  to={debugLink}
                  className="text-brand-primary text-xs font-bold hover:underline flex items-center gap-1"
                >
                  Click to Reset Password <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-bg-main font-bold py-3 px-4 rounded-xl transition-all active:scale-95"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <h1 className="text-3xl text-text-primary font-bold tracking-tight mb-2">Forgot Password</h1>
              <p className="text-text-muted text-sm">Enter your email and we'll send you a reset link.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex items-center gap-3">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-primary px-1">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-text-primary text-sm focus:border-brand-primary outline-none transition-all placeholder:text-text-muted"
                  placeholder="m@gmail.com"
                />
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-secondary text-bg-main font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-medium text-text-muted hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;