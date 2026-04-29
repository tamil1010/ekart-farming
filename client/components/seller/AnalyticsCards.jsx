import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  ArrowUpRight, 
  Wallet 
} from 'lucide-react';
import { useData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const StatCard = ({ label, value, trend, trendValue, icon: Icon, isCurrency = true }) => (
  <div className="glass-card hover:border-brand-primary/20 transition-all duration-300 group overflow-hidden relative">
    <div className="relative z-10">
      <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="text-4xl font-black text-white tracking-tighter mb-1">
        {isCurrency && typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}
      </div>
      <div className={`text-[10px] font-black flex items-center gap-1 ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
        {trendValue} from last month
      </div>
    </div>
    
    {/* Decorative sparkline-like background */}
    <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
      <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path 
          d={trend === 'up' 
            ? "M0,35 Q20,30 40,32 T80,10 T100,5" 
            : "M0,5 Q20,10 40,8 T80,30 T100,35"} 
          fill="none" 
          stroke={trend === 'up' ? "#22c55e" : "#ef4444"} 
          strokeWidth="1.5" 
        />
      </svg>
    </div>
  </div>
);

const AnalyticsCards = () => {
  const { user } = useAuth();
  const { orders, products, stats } = useData();
  
  const currentUserId = user?._id || user?.id;
  
  // Calculate seller specific stats
  const sellerOrders = orders.filter(o => o.items?.some(item => (item.product?.sellerId || item.sellerId) === currentUserId));
  const sellerProducts = products.filter(p => p.sellerId === currentUserId);
  const paidOrders = sellerOrders.filter(o => o.paymentStatus === 'PAID');
  const pendingOrders = sellerOrders.filter(o => o.paymentStatus === 'PENDING');
  
  const totalEarnings = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingAmount = pendingOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockCount = sellerProducts.filter(p => p.stock <= 10).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard 
        label="Total Orders" 
        value={sellerOrders.length} 
        isCurrency={false}
        trend="up" 
        trendValue="+8.2%" 
      />
      <StatCard 
        label="Revenue (Net)" 
        value={totalEarnings} 
        trend="up" 
        trendValue="+12.4%" 
      />
      <StatCard 
        label="Pending Payouts" 
        value={pendingAmount} 
        trend="up" 
        trendValue="+4.1%" 
      />
      <StatCard 
        label="Yield Volume" 
        value={sellerProducts.length} 
        isCurrency={false}
        trend="up" 
        trendValue="+15%" 
      />
      <StatCard 
        label="Critical Stock" 
        value={lowStockCount} 
        isCurrency={false}
        trend={lowStockCount > 5 ? "down" : "up"} 
        trendValue={lowStockCount > 0 ? "Alert Active" : "Clean"} 
      />
    </div>
  );
};

export default AnalyticsCards;
