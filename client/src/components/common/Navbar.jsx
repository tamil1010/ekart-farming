import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { ShoppingCart, LogOut, Search, Bell, Mail, Gift, ChevronDown, Store } from 'lucide-react';

const Navbar = ({ onLogoClick }) => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = (e) => {
    if (onLogoClick) {
      e.preventDefault();
      onLogoClick();
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-bg-main/60 backdrop-blur-2xl border-b border-white/5 h-24 shadow-2xl overflow-hidden">
      {/* Scanning line effect for Navbar */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
      
      <div className="h-full px-12 flex items-center justify-between gap-12 relative z-10">
        {/* Logo Section */}
        <div className="flex items-center gap-8 min-w-[240px]">
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-5 group">
            <div className="w-14 h-14 bg-brand-primary p-0.5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full bg-bg-main rounded-[14px] flex items-center justify-center">
                <Store className="w-8 h-8 text-brand-primary animate-pulse-slow" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-4xl tracking-tighter text-white leading-none">AgroMart<span className="text-brand-primary italic">Farming</span></span>
            </div>
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {user && (user.role === 'SELLER' || user.role === 'ADMIN') && (
            <Link 
              to={user.role === 'SELLER' ? "/seller/dashboard" : "/admin/dashboard"} 
              className="px-6 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary hover:bg-brand-primary hover:text-bg-main transition-all"
            >
              Control Terminal
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 pr-10 border-r border-white/5">
            {(!user || user.role === 'CUSTOMER') && (
              <Link to="/cart" className="w-14 h-14 flex items-center justify-center text-text-secondary hover:text-brand-primary bg-white/5 border border-white/5 hover:border-brand-primary/40 rounded-2xl transition-all relative group shadow-xl">
                <ShoppingCart className="w-6 h-6" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-primary text-bg-main text-[10px] font-black min-w-[24px] h-[24px] flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-bounce-slow">
                    {items.length}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* User Profile / Digital ID */}
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/profile" className="flex items-center gap-6 group cursor-pointer">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary/40 to-transparent p-[1.5px] group-hover:from-brand-primary transition-all duration-500">
                    <div className="w-full h-full bg-bg-main rounded-[14.5px] flex items-center justify-center overflow-hidden border border-white/10 relative">
                      <img 
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                        alt="avatar" 
                        className="w-12 h-12 transition-all group-hover:scale-110 object-cover"
                      />
                      {/* ID Scan Overlay */}
                      <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-primary border-4 border-bg-main rounded-full animate-pulse" />
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-12 h-12 flex items-center justify-center text-text-muted hover:text-red-500 bg-red-500/5 hover:bg-red-500/20 border border-white/5 hover:border-red-500/40 rounded-2xl transition-all"
                title="Disconnect"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm font-bold text-text-secondary hover:text-brand-primary transition-all">Login</Link>
              <Link to="/register" className="btn-terminal py-3 px-8 text-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
