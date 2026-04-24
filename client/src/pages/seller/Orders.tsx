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
import { useData } from '../../context/DataContext';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, deleteOrder } = useData();
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    const matchesSearch = (o.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
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
        <h1 className="text-3xl font-display font-bold">Order Management</h1>
        <p className="text-text-secondary mt-1">Review, process, and track your agricultural shipments.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex bg-bg-card p-1 rounded-2xl border border-brand-dark/20 overflow-x-auto no-scrollbar w-full lg:w-auto">
          {['All', 'PENDING', 'ACCEPTED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-brand-primary text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search Order ID or Customer..." 
            className="input-field w-full pl-12 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-surface/50 text-text-secondary text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Customer Info</th>
                <th className="px-6 py-4 font-bold">Produce & Qty</th>
                <th className="px-6 py-4 font-bold">Total Val</th>
                <th className="px-6 py-4 font-bold">Payment</th>
                <th className="px-6 py-4 font-bold">Shipment Status</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/10">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-bg-surface/30 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="font-mono text-brand-primary font-bold">{order.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-semibold">{order.customerName || 'Guest Customer'}</div>
                    <div className="text-[10px] text-text-secondary flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {order.date}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm truncate max-w-[200px]">
                      {order.items.map(i => i.name).join(', ')}
                    </div>
                    <div className="text-xs text-text-secondary italic">Qty: {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-white">₹{order.total}</span>
                  </td>
                  <td className="px-6 py-5">
                     <span className={`text-[10px] font-bold ${order.paymentStatus === 'FAILED' ? 'text-red-500' : 'text-emerald-500'}`}>
                       {order.paymentStatus}
                     </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center justify-center gap-2">
                        {order.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                              className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm shadow-emerald-500/20" title="Accept Order"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                              className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-500/20" title="Reject Order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {order.status === 'ACCEPTED' && (
                           <button 
                             onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                             className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-500 hover:text-white transition-all"
                           >
                             <Truck className="w-4 h-4" /> SHIP NOW
                           </button>
                        )}
                        {order.status === 'SHIPPED' && (
                           <button 
                             onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                             className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all"
                           >
                             <CheckCircle2 className="w-4 h-4" /> MARK DELIVERED
                           </button>
                        )}
                        <button 
                          onClick={() => navigate(`/seller/orders/${order.id}`)}
                          className="p-2 bg-bg-surface rounded-lg text-text-secondary hover:text-brand-primary transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 bg-bg-surface rounded-lg text-text-secondary hover:text-red-500 transition-all"
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
