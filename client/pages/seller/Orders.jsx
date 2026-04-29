import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ChevronRight,
  ShoppingBag,
  Calendar,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate } from '../../lib/utils';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, updateOrderStatus, deleteOrder, claimInitialProducts, products } = useData();
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const currentUserId = user?._id || user?.id;

  // Auto-claim mock data for new sellers to improve demo experience
  React.useEffect(() => {
    const hasMockProducts = products.some(p => p.sellerId === 'mock-seller-1');
    if (hasMockProducts && currentUserId) {
      claimInitialProducts(currentUserId, user?.name);
    }
  }, [products, currentUserId, claimInitialProducts, user?.name]);

  const filteredOrders = orders.filter(o => {
    // Filter by seller ID
    const isOwner = o.items?.some(item => {
      const sellerId = item.product?.sellerId || item.sellerId;
      const currentUserId = user?._id || user?.id;
      return sellerId === currentUserId;
    });
    if (!isOwner) return false;

    const matchesTab = activeTab === 'All' || o.status === activeTab;
    const matchesSearch = (o.customer?.name?.toLowerCase() || o.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || (o._id || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-500';
      case 'ACCEPTED': return 'bg-blue-500/10 text-blue-400';
      case 'SHIPPED': return 'bg-purple-500/10 text-purple-400';
      case 'OUT_FOR_DELIVERY': return 'bg-cyan-500/10 text-cyan-400';
      case 'DELIVERED': return 'bg-emerald-500/10 text-brand-primary';
      case 'CANCELLED': return 'bg-red-500/10 text-red-400';
      default: return 'bg-white/5 text-text-muted';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-sans font-black tracking-tighter text-white">Order <span className="text-brand-primary">Management</span></h1>
          <p className="text-text-secondary mt-1 text-sm font-medium uppercase tracking-widest text-[10px]">Review, process, and track your agricultural shipments through 5 stages.</p>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search Order ID or Customer..." 
            className="input-field w-full pl-12 h-12 bg-white/5 border-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar w-full lg:w-auto">
          {['All', 'PENDING', 'ACCEPTED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-brand-primary text-bg-main shadow-lg shadow-brand-primary/20' : 'text-text-muted hover:text-white'
              }`}
            >
              {tab === 'OUT_FOR_DELIVERY' ? 'DISPATCHED' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-6 py-5">Node ID</th>
                <th className="px-6 py-5">Entity Info</th>
                <th className="px-6 py-5">Yield Cluster</th>
                <th className="px-6 py-5">Net Val</th>
                <th className="px-6 py-5">Fin Status</th>
                <th className="px-6 py-5">Logistics</th>
                <th className="px-6 py-5 text-center">Protocol Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order, idx) => (
                <tr key={order._id || order.id || idx} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-6">
                    <span className="font-mono text-brand-primary font-black text-sm tracking-widest">#{String(order._id || order.id || '').slice(-8)}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="font-black text-white text-sm">{order.customer?.name || order.customerName || 'GUEST_ENTITY'}</div>
                    <div className="text-[9px] text-text-muted font-black flex items-center gap-2 mt-1 uppercase tracking-widest">
                      <Calendar className="w-3 h-3" /> {formatDate(order.createdAt || order.date)}
                    </div>
                  </td>
                  <td className="px-6 py-6 font-mono">
                    <div className="text-[11px] font-black text-white/80 truncate max-w-[180px] uppercase">
                      {order.items.map(i => i.product?.name || i.name).join(' // ')}
                    </div>
                    <div className="text-[9px] text-text-muted font-black tracking-widest uppercase mt-1">QUANTUM: {order.items.reduce((sum, item) => sum + item.quantity, 0)} UNITS</div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="font-black text-white text-lg tracking-tighter">₹{order.total}</span>
                  </td>
                  <td className="px-6 py-6">
                     <span className={`text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'FAILED' ? 'text-red-500' : 'text-brand-primary'}`}>
                       {order.paymentStatus}
                     </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.15em] border border-current ${getStatusColor(order.status).replace('bg-', 'border-')}`}>
                      {order.status === 'OUT_FOR_DELIVERY' ? 'DISPATCHED' : order.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                     <div className="flex items-center justify-center gap-3">
                        {order.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => updateOrderStatus(order._id, 'ACCEPTED')}
                              className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm" title="Accept Order"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(order._id, 'CANCELLED')}
                              className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Reject Order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {order.status === 'ACCEPTED' && (
                           <button 
                             onClick={() => updateOrderStatus(order._id, 'SHIPPED')}
                             className="flex items-center gap-2 bg-blue-400/10 text-blue-400 border border-blue-400/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 hover:text-bg-main transition-all"
                           >
                             <Truck className="w-4 h-4" /> SHIP YIELD
                           </button>
                        )}
                        {order.status === 'SHIPPED' && (
                           <button 
                             onClick={() => updateOrderStatus(order._id, 'OUT_FOR_DELIVERY')}
                             className="flex items-center gap-2 bg-purple-400/10 text-purple-400 border border-purple-400/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-400 hover:text-bg-main transition-all"
                           >
                             <Truck className="w-4 h-4" /> DISPATCH
                           </button>
                        )}
                        {order.status === 'OUT_FOR_DELIVERY' && (
                           <button 
                             onClick={() => updateOrderStatus(order._id, 'DELIVERED')}
                             className="flex items-center gap-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-bg-main transition-all"
                           >
                             <CheckCircle2 className="w-4 h-4" /> DELIVER
                           </button>
                        )}
                        {order.status === 'DELIVERED' && (
                          <div className="px-4 py-2 bg-brand-primary/10 rounded-xl text-[9px] font-black uppercase text-brand-primary tracking-widest border border-brand-primary/20">
                            Fulfiilled
                          </div>
                        )}
                        <button 
                          onClick={() => navigate(`/track-order/${order._id}`)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-text-muted flex items-center justify-center hover:text-brand-primary hover:border-brand-primary/40 transition-all"
                          title="Track Order Journey"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/seller/orders/${order._id}`)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-text-muted flex items-center justify-center hover:text-brand-primary hover:border-brand-primary/40 transition-all"
                          title="Manage Order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteOrder(order._id)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-text-muted flex items-center justify-center hover:text-red-500 hover:border-red-500/40 transition-all"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
         <div className="text-center py-20 bg-bg-card border border-brand-dark/10 rounded-3xl">
           <div className="w-20 h-20 bg-bg-surface mx-auto rounded-full flex items-center justify-center text-text-secondary mb-6">
              <ShoppingBag className="w-10 h-10" />
           </div>
           <h3 className="text-xl font-bold">No orders found</h3>
           <p className="text-text-secondary">Try adjusting your filters or search term.</p>
         </div>
      )}
    </div>
  );
};

export default Orders;
