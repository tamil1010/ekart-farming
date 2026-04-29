import React from 'react';
import AnalyticsCards from '../../components/seller/AnalyticsCards.jsx';
import { SalesChart, OrderStatusDist } from '../../components/seller/DashboardCharts.jsx';
import { 
  AlertCircle, 
  ArrowUpRight, 
  ArrowRight, 
  Eye, 
  MoreHorizontal, 
  Globe, 
  MapPin, 
  CreditCard, 
  Send, 
  ChevronDown,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Tag,
  Package,
  ShoppingCart
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, products, claimInitialProducts } = useData();
  
  const currentUserId = user?._id || user?.id;

  // Auto-claim mock data for new sellers to improve demo experience
  React.useEffect(() => {
    const hasMockProducts = products.some(p => p.sellerId === 'mock-seller-1');
    if (hasMockProducts && currentUserId) {
      claimInitialProducts(currentUserId, user?.name);
    }
  }, [products, currentUserId, claimInitialProducts, user?.name]);

  const sellerOrders = orders.filter(o => o.items?.some(item => (item.product?.sellerId || item.sellerId) === currentUserId));
  const sellerProducts = products.filter(p => p.sellerId === currentUserId);
  
  const recentOrders = sellerOrders.slice(0, 5);
  const lowStockProducts = sellerProducts.filter(p => p.stock > 0 && p.stock <= 10);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">Manage your agricultural network operations.</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden lg:flex items-center gap-8 mr-6">
              <div className="text-right">
                 <div className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Active Nodes</div>
                 <div className="text-sm font-black text-white">128<span className="text-brand-primary">.04</span></div>
              </div>
              <div className="text-right">
                 <div className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Sync Latency</div>
                 <div className="text-sm font-black text-white">12<span className="text-brand-primary">ms</span></div>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex flex-col items-end px-4 border-r border-white/5">
                 <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">Status</span>
                 <span className="text-xs font-black text-brand-primary uppercase">Operational</span>
              </div>
              <button onClick={() => navigate('/seller/marketplace')} className="bg-brand-primary text-black font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-primary/20">
                 New Yield
              </button>
           </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <AnalyticsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="glass-card lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <div>
               <h2 className="text-sm font-black text-white tracking-widest uppercase italic mb-1">Yield Performance _</h2>
               <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Revenue vs Demand sync</p>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
               <button className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-brand-primary text-bg-main">Weekly</button>
               <button className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors">Monthly</button>
            </div>
          </div>
          <div className="h-[300px]">
            <SalesChart />
          </div>
        </div>
        
        {/* Market Insights */}
        <div className="glass-card flex flex-col">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                <TrendingUp className="w-4 h-4" />
             </div>
             <h2 className="text-sm font-black text-white tracking-widest uppercase italic">Market Intelligence _</h2>
          </div>
          <div className="flex-1 space-y-6">
             <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-black text-white uppercase tracking-tighter">Tomato (Premium)</span>
                   <span className="text-[10px] font-black text-emerald-500 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" /> +12%
                   </span>
                </div>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">Demand surging in urban nodes</p>
             </div>
             <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-black text-white uppercase tracking-tighter">Organic Wheat</span>
                   <span className="text-[10px] font-black text-amber-500 flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" /> -4%
                   </span>
                </div>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">Surplus stock from harvest sync</p>
             </div>
             <div className="mt-auto pt-6 border-t border-white/5">
                <Link to="/seller/analytics" className="w-full btn-terminal py-3 text-center text-bg-main flex items-center justify-center gap-2">
                   Live Yield Pricing <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="glass-card lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-sm font-black text-white tracking-widest uppercase italic">Live Order Stream _</h2>
             <Link to="/seller/orders" className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">View All Network Traffic</Link>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-white/5">
                <tr>
                  <th className="pb-4">Node ID</th>
                  <th className="pb-4">Entity</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Payload</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody>
                {sellerOrders.slice(0, 5).map((order) => (
                  <tr key={order._id || order.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
                    <td className="py-5 uppercase font-mono text-[10px] text-brand-primary font-black tracking-widest italic">
                      #{String(order._id || order.id).slice(-8)}
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-[9px] text-white uppercase overflow-hidden">
                           {order.customerName?.split(' ').map(n => n[0]).join('') || 'G'}
                        </div>
                        <div>
                          <div className="text-[11px] font-black text-white uppercase tracking-tight">{order.customerName}</div>
                          <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest leading-none mt-0.5">{order.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-current ${
                        order.status === 'DELIVERED' ? 'text-emerald-500 bg-emerald-500/10' : 
                        order.status === 'PENDING' ? 'text-amber-500 bg-amber-500/10' :
                        'text-blue-400 bg-blue-400/10'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-5 text-xs font-black text-white font-mono">₹{order.total}</td>
                    <td className="py-5 text-right">
                       <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-brand-primary transition-all ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alerts & Quick Actions */}
        <div className="space-y-8">
           <div className="glass-card">
              <h2 className="text-sm font-black text-white tracking-widest uppercase italic mb-6">Stock Latency _</h2>
              <div className="space-y-4">
                 {lowStockProducts.length > 0 ? lowStockProducts.slice(0, 3).map(p => (
                    <div key={p._id || p.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-white uppercase">{p.name}</span>
                          <span className="text-[10px] font-black text-amber-500">LOW</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] text-text-muted uppercase font-bold">Qty: {p.stock} units</span>
                          <Link to="/seller/marketplace" className="text-[9px] font-black text-brand-primary uppercase underline">Restock</Link>
                       </div>
                    </div>
                 )) : (
                    <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                       <p className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Inventory Clean</p>
                    </div>
                 )}
              </div>
           </div>

           <div className="glass-card">
              <h2 className="text-sm font-black text-white tracking-widest uppercase italic mb-6">Ops Hub _</h2>
              <div className="grid grid-cols-2 gap-3">
                 {[
                    { label: 'Add Yield', icon: Package, path: '/seller/marketplace' },
                    { label: 'Settlement', icon: CreditCard, path: '/seller/payments' },
                 ].map((item, i) => (
                    <button 
                       key={i} 
                       onClick={() => navigate(item.path)}
                       className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-brand-primary/40 transition-all text-left"
                    >
                       <item.icon className="w-4 h-4 text-brand-primary mb-3" />
                       <div className="text-[9px] font-black text-white uppercase tracking-widest">{item.label}</div>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Enhanced Transaction Table Area */}
      <div className="glass-card overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
           <div className="flex-1 max-w-md relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-brand-primary transition-colors" />
              <input type="text" placeholder="Search by name, email, or others..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-brand-primary/30 outline-none transition-all placeholder:text-text-muted" />
           </div>
           <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all">
                <MapPin className="w-4 h-4 text-brand-primary" /> Location <ChevronDown className="w-3 h-3 text-text-muted" />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all">
                <Tag className="w-4 h-4 text-brand-primary" /> Amount Spent <ChevronDown className="w-3 h-3 text-text-muted" />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all">
                <Calendar className="w-4 h-4 text-brand-primary" /> Date <ChevronDown className="w-3 h-3 text-text-muted" />
              </button>
              <div className="h-8 w-px bg-white/10 mx-2" />
              <button className="p-2.5 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-brand-primary hover:bg-brand-primary/20 transition-all">
                <Filter className="w-5 h-5" />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="pb-4 pl-4 w-12">
                   <div className="w-4 h-4 border-2 border-white/10 rounded" />
                </th>
                <th className="pb-4">Node ID</th>
                <th className="pb-4">Entity Entity</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Net Payload</th>
                <th className="pb-4 pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map(order => (
                <tr key={order._id || order.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => navigate(`/seller/orders/${order._id || order.id}`)}>
                  <td className="py-5 pl-4">
                     <div className="w-4 h-4 border-2 border-white/10 rounded group-hover:border-brand-primary transition-colors" />
                  </td>
                  <td className="py-5 uppercase font-mono text-[10px] text-brand-primary font-black tracking-widest italic">
                    #{String(order._id || order.id).slice(-8)}
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-[9px] text-white uppercase overflow-hidden">
                         {order.customerName?.split(' ').map(n => n[0]).join('') || 'G'}
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white uppercase tracking-tight">{order.customerName}</div>
                        <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{order.customerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-current ${
                      order.status === 'DELIVERED' ? 'text-emerald-500 bg-emerald-500/10' : 
                      order.status === 'PENDING' ? 'text-amber-500 bg-amber-500/10' :
                      'text-blue-400 bg-blue-400/10'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-5 text-xs font-black text-white tracking-tighter">₹{order.total}</td>
                  <td className="py-5 pr-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-white/5 pb-4 px-4">
           <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-text-muted">Show result:</span>
              <button className="flex items-center gap-2 px-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs font-bold text-white">
                5 <ChevronDown className="w-3 h-3" />
              </button>
           </div>
           <div className="flex items-center gap-1">
              {[1, 2, 3, 4, '...', 20].map((p, i) => (
                <button key={i} className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${p === 2 ? 'bg-brand-primary text-black' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>
                  {p}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
