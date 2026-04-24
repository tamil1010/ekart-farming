import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  ClipboardList, 
  IndianRupee, 
  TrendingUp, 
  Users, 
  Settings,
  Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const sellerLinks = [
    { to: '/seller/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/seller/marketplace', icon: Store, label: 'Marketplace' },
    { to: '/seller/orders', icon: ClipboardList, label: 'Store Orders' },
    { to: '/seller/pricing', icon: TrendingUp, label: 'Live Pricing' },
    { to: '/seller/transactions', icon: IndianRupee, label: 'Transactions' },
    { to: '/seller/payments', icon: Settings, label: 'Store Earnings' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/products', icon: Package, label: 'Manage Products' },
    { to: '/admin/orders', icon: ClipboardList, label: 'Manage Orders' },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : sellerLinks;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[var(--color-bg-card)] border-r border-[var(--color-border-main)] flex flex-col p-4">
      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-brand-primary/10 text-brand-primary' 
                : 'text-text-secondary hover:bg-bg-surface hover:text-white'}
            `}
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-[var(--color-border-main)]">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-text-secondary truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
