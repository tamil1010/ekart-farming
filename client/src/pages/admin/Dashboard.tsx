import React from 'react';
import { Users, Package, ShoppingCart, IndianRupee, ShieldAlert, CheckCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '1,240', icon: Users, color: 'text-blue-500' },
    { label: 'Active Sellers', value: '85', icon: ShieldAlert, color: 'text-orange-500' },
    { label: 'Total Products', value: '4,520', icon: Package, color: 'text-emerald-500' },
    { label: 'Daily Volume', value: '₹2.4L', icon: IndianRupee, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Control Center</h1>
        <p className="text-text-secondary mt-1">Platform-wide overview and management tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-text-secondary">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl bg-bg-surface ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card">
          <h2 className="text-xl font-bold mb-6">System Health</h2>
          <div className="space-y-6">
            {[
              { label: 'API Gateway', status: 'Healthy', time: '12ms' },
              { label: 'Database Sync', status: 'Healthy', time: '100%' },
              { label: 'Payment Webhooks', status: 'Healthy', time: 'Synced' },
              { label: 'CDN Assets', status: 'Healthy', time: '0.2s' },
            ].map((system, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-bg-surface rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">{system.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-text-secondary">{system.time}</span>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase">Online</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card border-brand-dark/30">
          <h2 className="text-xl font-bold mb-6">Recent Reports</h2>
          <div className="space-y-4">
            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
              <p className="text-sm font-bold text-red-400">Suspicious Activity</p>
              <p className="text-xs text-text-secondary mt-1">User ID: #USR-882 reported for fraudulent listing.</p>
              <button className="mt-3 text-xs font-bold text-red-500 hover:underline">Review Account</button>
            </div>
            <div className="p-4 bg-bg-surface rounded-xl">
              <p className="text-sm font-bold">New Seller Request</p>
              <p className="text-xs text-text-secondary mt-1">Punjab Agro Cooperatives wants to join as a Bulk Seller.</p>
              <button className="mt-3 text-xs font-bold text-brand-primary hover:underline">Approve Request</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
