import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowRight, AlertCircle, Loader2, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">

        {success ? (
          <div className="text-center space-y-6">
            {/* Success icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)' }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: 'rgb(34,197,94)' }} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Password Reset!</h2>
              <p className="text-text-muted text-sm">Your password has been updated. Redirecting to login in 3 seconds...</p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-bg-main font-bold py-3 px-4 rounded-xl transition-all active:scale-95"
            >
              Go to Login Now
            </button>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <h1 className="text-3xl text-text-primary font-bold tracking-tight mb-2">Reset Password</h1>
              <p className="text-text-muted text-sm">Set a new secure password for your account.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex items-center gap-3">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-primary px-1">New Password</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 pr-12 text-text-primary text-sm focus:border-brand-primary outline-none transition-all placeholder:text-text-muted"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-primary px-1">Confirm Password</label>
                <div className="relative">
                  <input
                    required
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 pr-12 text-text-primary text-sm focus:border-brand-primary outline-none transition-all placeholder:text-text-muted"
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPassword && (
                  <p className={`text-[10px] font-bold px-1 ${password === confirmPassword ? 'text-brand-primary' : 'text-red-500'}`}>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-secondary text-bg-main font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <>Reset Password <ArrowRight className="w-4 h-4" /></>
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

export default ResetPassword;