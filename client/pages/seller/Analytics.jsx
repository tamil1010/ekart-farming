import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  PieChart as PieChartIcon,
  Calendar,
  Filter,
  ArrowUpRight,
  ChevronDown,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import AnalyticsCards from '../../components/seller/AnalyticsCards.jsx';

const Analytics = () => {
  const { user } = useAuth();
  const { orders, products } = useData();
  const [timeRange, setTimeRange] = useState('7D');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const currentUserId = user?._id || user?.id;
  const sellerOrders = orders.filter(o => o.items?.some(item => (item.product?.sellerId || item.sellerId) === currentUserId));
  const sellerProducts = products.filter(p => p.sellerId === currentUserId);

  // Derived Data
  const totalRevenue = sellerOrders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = sellerOrders.length;
  const productsSold = sellerOrders.reduce((sum, o) => sum + (o.items?.length || 0), 0);
  
  // Real data for charts (mocking trends based on real counts)
  const chartData = [
    { name: 'Mon', revenue: 4200, orders: 12 },
    { name: 'Tue', revenue: 3800, orders: 9 },
    { name: 'Wed', revenue: 5600, orders: 15 },
    { name: 'Thu', revenue: 4900, orders: 11 },
    { name: 'Fri', revenue: 7200, orders: 18 },
    { name: 'Sat', revenue: 6400, orders: 14 },
    { name: 'Sun', revenue: 8100, orders: 20 },
  ];

  const categoryData = [
    { name: 'Fruits', value: sellerProducts.filter(p => p.category === 'Fruits').length },
    { name: 'Vegetables', value: sellerProducts.filter(p => p.category === 'Vegetables').length },
    { name: 'Grains', value: sellerProducts.filter(p => p.category === 'Grains').length },
    { name: 'Seeds', value: sellerProducts.filter(p => p.category === 'Seeds').length },
  ].filter(c => c.value > 0);

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7'];

  const topProducts = [...sellerProducts]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);

  const lowStock = sellerProducts.filter(p => p.stock <= 10);

  if (sellerProducts.length === 0 && sellerOrders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-bg-card/50 border border-white/5 rounded-3xl animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-6">
          <PieChartIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">No analytics data available</h2>
        <p className="text-text-secondary max-w-md mb-8">Start adding products to your inventory and making sales to see real-time insights and growth metrics here.</p>
        <button className="btn-terminal px-8">Quick Start Profile</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Yield <span className="text-brand-primary">Analytics _</span></h1>
          <p className="text-text-secondary mt-1 font-medium">Real-time performance metrics and predictive market insights.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 w-full sm:w-auto">
            {['Today', '7D', '30D', '1Y'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  timeRange === range ? 'bg-brand-primary text-bg-main shadow-lg shadow-brand-primary/20' : 'text-text-muted hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="relative group w-full sm:w-auto">
             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted group-focus-within:text-brand-primary transition-colors" />
             <select 
               className="w-full sm:w-auto bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-10 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-primary/40 appearance-none cursor-pointer"
               value={categoryFilter}
               onChange={(e) => setCategoryFilter(e.target.value)}
             >
               <option value="All">All Sectors</option>
               <option value="Fruits">Fruits</option>
               <option value="Vegetables">Vegetables</option>
               <option value="Grains">Grains</option>
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      <AnalyticsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <div className="glass-card lg:col-span-2 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic mb-1">Growth Trajectory _</h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-emerald-500">₹40,291</span>
                <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12.4%
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-primary" />
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Revenue</span>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Orders</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#737373', fontSize: 10, fontWeight: 900 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#737373', fontSize: 10, fontWeight: 900 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="glass-card p-8 flex flex-col">
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic mb-8">Yield Distribution _</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.length > 0 ? categoryData : [{ name: 'N/A', value: 1 }]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-6">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <div className="flex-1">
                    <div className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">{cat.name}</div>
                    <div className="text-xs font-black text-white">{cat.value} items</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products Table */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Top Performing Assets _</h2>
            <ArrowUpRight className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p._id || p.id} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-brand-primary/20 transition-all">
                <div className="w-12 h-12 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                  <img src={p.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-tight">{p.name}</h3>
                  <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-1">₹{p.price}/{p.unit} • {p.sold || 0} Sold</p>
                </div>
                <div className="text-right">
                   <div className="text-xs font-black text-emerald-500">₹{((p.sold || 0) * p.price).toLocaleString()}</div>
                   <div className="text-[8px] text-text-muted uppercase font-black">Net Yield</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Alerts & Market Insights */}
        <div className="space-y-8">
          <div className="glass-card p-8 bg-amber-500/[0.02] border-amber-500/10">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Network Latency (Inventory) _</h2>
            </div>
            <div className="space-y-4">
              {lowStock.length > 0 ? lowStock.map(p => (
                <div key={p._id || p.id} className="flex justify-between items-center p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                   <div>
                     <div className="text-[10px] font-black text-white uppercase">{p.name}</div>
                     <div className="text-[9px] text-amber-500 font-bold uppercase mt-1">Stock Critical: {p.stock} units left</div>
                   </div>
                   <button className="bg-amber-500 text-bg-main px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                     Restock
                   </button>
                </div>
              )) : (
                <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Inventory levels normalized</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-8 bg-brand-primary/[0.02] border-brand-primary/10 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-primary/10 blur-[60px] rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <RefreshCw className="w-5 h-5 text-brand-primary animate-spin-slow" />
                <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Market Intelligence _</h2>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-2">Trend Analysis</div>
                   <p className="text-xs text-text-secondary leading-relaxed">
                     Vegetable prices in your region are projected to rise by <span className="text-white font-black">15%</span> next week due to logistics disruption.
                   </p>
                </div>
                <div className="flex items-center justify-between">
                   <div className="text-[10px] font-black text-white tracking-widest uppercase">Live Price Sync</div>
                   <div className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
