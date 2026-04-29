import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  Trash2, 
  ShoppingBag,
  Calendar,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';
import { formatDate } from '../../lib/utils';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { orders, deleteOrder } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.customer?.name?.toLowerCase() || o.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || (o._id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-500/10 text-orange-400';
      case 'ACCEPTED': return 'bg-blue-500/10 text-blue-400';
      case 'SHIPPED': return 'bg-purple-500/10 text-purple-400';
      case 'DELIVERED': return 'bg-emerald-500/10 text-emerald-400';
      case 'CANCELLED': return 'bg-red-500/10 text-red-400';
      default: return 'bg-bg-surface text-text-secondary';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold">Global Orders</h1>
        <p className="text-text-secondary mt-1">Monitor and manage all customer orders across the platform.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by ID or Customer..." 
            className="input-field w-full pl-12 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex bg-bg-card p-1 rounded-2xl border border-brand-dark/20 overflow-x-auto no-scrollbar">
            {['All', 'PENDING', 'ACCEPTED', 'SHIPPED', 'DELIVERED'].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab ? 'bg-brand-primary text-white' : 'text-text-secondary hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-surface/50 text-text-secondary text-xs uppercase tracking-widest border-b border-brand-dark/20">
              <tr>
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Products</th>
                <th className="px-6 py-4 font-bold text-right">Total Amount</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/10 text-sm">
              {filteredOrders.map((order) => (
                <tr key={order._id || order.id} className="hover:bg-bg-surface/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-brand-primary font-bold">#{String(order._id || order.id || '').slice(-8)}</span>
                    <div className="text-[10px] text-text-secondary mt-1">{formatDate(order.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {order.customer?.name || order.customerName || 'Guest User'}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {order.items.length} Items
                  </td>
                  <td className="px-6 py-4 text-right font-black text-white">
                    ₹{order.total}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => navigate(`/seller/orders/${order._id}`)} 
                         className="p-2 bg-white/5 rounded-lg text-text-secondary hover:text-brand-primary transition-all"
                         title="View Full Details"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => deleteOrder(order._id)}
                         className="p-2 bg-white/5 rounded-lg text-text-secondary hover:text-red-500 transition-all text-red-500/50"
                         title="Force Delete"
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
         <div className="text-center py-20 glass-card">
           <ShoppingBag className="w-12 h-12 mx-auto text-text-secondary mb-4 opacity-20" />
           <p className="text-text-secondary text-lg">No orders found matching your filters.</p>
         </div>
      )}
    </div>
  );
};

export default AdminOrders;
