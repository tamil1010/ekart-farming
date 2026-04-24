import React from 'react';
import { IndianRupee, ShoppingBag, Package, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const AnalyticsCards: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = useData();

  const analyticsStats = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: IndianRupee, change: '+12.5%', color: 'text-emerald-500', path: '/seller/transactions' },
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, change: 'Lifetime', color: 'text-blue-500', path: '/seller/orders' },
    { label: 'Total Products', value: stats.totalProducts.toString(), icon: Package, change: 'Live', color: 'text-orange-500', path: '/seller/marketplace' },
    { label: 'Pending Payout', value: `₹${stats.pendingPayments}`, icon: Clock, change: 'Next 48h', color: 'text-purple-500', path: '/seller/payments' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {analyticsStats.map((stat, idx) => (
        <div 
          key={idx} 
          onClick={() => navigate(stat.path)}
          className="glass-card flex flex-col gap-4 cursor-pointer hover:border-brand-primary/50 transition-all group"
        >
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl bg-bg-surface ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
              <TrendingUp className="w-3 h-3" />
              {stat.change}
            </div>
          </div>
          <div>
            <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold mt-1">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
