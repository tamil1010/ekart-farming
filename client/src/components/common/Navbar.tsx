import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, LogOut, User, Menu, Leaf } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--color-bg-card)] border-b border-[var(--color-border-main)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-brand-primary font-display font-bold text-xl">
          <Leaf className="w-6 h-6" />
          <span>eKart Farming</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/shop" className="text-text-secondary hover:text-brand-primary transition-colors">Shop</Link>
          {user?.role === 'CUSTOMER' && <Link to="/orders" className="text-text-secondary hover:text-brand-primary transition-colors">My Orders</Link>}
          {user?.role === 'SELLER' && (
            <>
              <Link to="/seller/dashboard" className="text-text-secondary hover:text-brand-primary transition-colors">Seller Dashboard</Link>
              <Link to="/seller/marketplace" className="text-text-secondary hover:text-brand-primary transition-colors">Marketplace</Link>
            </>
          )}
          {user?.role === 'ADMIN' && <Link to="/admin/dashboard" className="text-text-secondary hover:text-brand-primary transition-colors">Admin Panel</Link>}
        </div>

        <div className="flex items-center gap-4">
          {user?.role === 'CUSTOMER' && (
            <Link to="/cart" className="relative p-2 text-text-secondary hover:text-brand-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-[10px] text-text-secondary uppercase tracking-wider">{user.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium hover:text-brand-primary transition-colors">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Join Platform</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
