import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Tag,
  PieChart,
  Target,
  MessageSquare,
  Globe,
  HelpCircle,
  TrendingDown,
  Gift,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const sellerLinks = [
    { section: 'Menu', items: [
      { to: '/seller/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/seller/marketplace', icon: Package, label: 'Inventory' },
      { to: '/seller/orders', icon: ShoppingCart, label: 'Orders' },
      { to: '/seller/transactions', icon: BarChart3, label: 'Transactions' },
      { to: '/seller/analytics', icon: PieChart, label: 'Analytics' },
    ]},
    { section: 'Help', items: [
      { to: '/profile', icon: User, label: 'Profile' },
      { to: '/support', icon: HelpCircle, label: 'Support' },
      { to: '/settings', icon: Settings, label: 'Setting' },
    ]}
  ];

  const adminLinks = [
    { section: 'Menu', items: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboards' },
      { to: '/admin/users', icon: Users, label: 'Users' },
      { to: '/admin/products', icon: Target, label: 'Integration' },
      { to: '/admin/orders', icon: ShoppingCart, label: 'Global Orders' },
    ]},
    { section: 'Help', items: [
      { to: '/profile', icon: User, label: 'Profile' },
      { to: '/support', icon: HelpCircle, label: 'Support' },
      { to: '/settings', icon: Settings, label: 'Setting' },
    ]}
  ];

  const sections = user?.role === 'ADMIN' ? adminLinks : sellerLinks;

  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-80px)] w-72 bg-bg-main border-r border-white/5 z-40 hidden md:flex flex-col p-6">
      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
             <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{section.section}</h4>
             <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => 
                      isActive ? 'sidebar-link-active' : 'sidebar-link'
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
             </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button
          onClick={logout}
          className="sidebar-link w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>System Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
