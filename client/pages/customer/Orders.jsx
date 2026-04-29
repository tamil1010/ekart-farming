import React from 'react';
import { useData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShoppingBag,
  CreditCard,
  ArrowRight,
  XCircle,
  RefreshCcw,
  ExternalLink,
  ChevronDown,
  Calendar,
  Trash2,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../lib/utils';

const Orders = () => {
  const { orders, updateOrderStatus, deleteOrder } = useData();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const customerOrders = orders.filter(o => 
    o.customerId === user?.id || 
    (o.customerEmail === user?.email && user?.email !== undefined) ||
    (o.customerName === user?.email && user?.email !== undefined)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'ACCEPTED': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'SHIPPED': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'DELIVERED': return 'text-brand-primary bg-brand-primary/10 border-brand-primary/20';
      case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-text-muted bg-white/5 border-white/10';
    }
  };

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item);
    });
    navigate('/cart');
  };

  if (customerOrders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-brand-primary mb-8 border border-white/5 shadow-inner shadow-brand-primary/10"
        >
          <ShoppingBag className="w-12 h-12" />
        </motion.div>
        <h2 className="text-4xl font-sans font-black tracking-tighter text-white uppercase mb-4">No Data Clusters</h2>
        <p className="text-text-secondary mb-8 max-w-sm mx-auto font-medium uppercase tracking-widest text-[10px]">
          Your harvest sequence has not been initialized.
        </p>
        <button 
          onClick={() => navigate('/shop')} 
          className="btn-terminal px-12 py-4"
        >
          Store Access
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/cart')} 
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-brand-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Order History</h1>
            <p className="text-text-secondary text-sm mt-1">Review and track your recent agricultural purchases.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
          <Clock className="w-4 h-4" />
          <span>Real-time tracking enabled</span>
        </div>
      </header>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {customerOrders.map((order, orderIdx) => (
            <motion.div 
              key={order._id || order.id || orderIdx}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ delay: orderIdx * 0.05 }}
              className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-brand-primary/20 transition-all duration-300"
            >
              {/* Order Header Summary */}
              <div className="p-6 md:p-8 flex flex-wrap justify-between items-center gap-6 border-b border-white/5">
                <div className="flex flex-wrap items-center gap-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Order Number</p>
                    <p className="font-mono text-white font-bold">#{String(order._id || order.id || '').slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Date Placed</p>
                    <p className="text-white text-sm font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Total Amount</p>
                    <p className="text-white text-sm font-bold">₹{order.total.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                  <button 
                    onClick={() => navigate(`/track-order/${order._id}`)}
                    className="p-2 text-text-secondary hover:text-white bg-white/5 rounded-lg border border-white/5 transition-all"
                    title="Track Order"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Order Content Preview */}
              <div className="p-6 md:p-8 bg-black/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Items in Order</h3>
                    <div className="space-y-3">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-white/5">
                            <img 
                              src={item.product?.image} 
                              alt={item.product?.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                             <h4 className="font-bold text-white text-xs truncate">{item.product?.name}</h4>
                             <p className="text-[10px] text-text-secondary mt-0.5">
                               {item.quantity} × ₹{item.price}
                             </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-[10px] font-medium text-brand-primary pl-16">
                          + {order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-between h-full gap-6">
                    <div className="space-y-4 md:text-right">
                       <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Delivery Details</h3>
                       <div className="flex md:flex-row-reverse gap-3">
                          <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                          <p className="text-[11px] text-text-secondary leading-relaxed max-w-[240px]">
                            {typeof order.shippingAddress === 'object' 
                              ? `${order.shippingAddress.fullAddress}, ${order.shippingAddress.city}`
                              : order.shippingAddress}
                          </p>
                       </div>
                    </div>

                    <div className="flex gap-2">
                       {order.status === 'PENDING' && (
                         <button 
                           onClick={() => updateOrderStatus(order._id, 'CANCELLED')}
                           className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                         >
                            <Trash2 className="w-3.5 h-3.5" />
                            Cancel Order
                         </button>
                       )}
                       {order.status === 'DELIVERED' && (
                         <button 
                           onClick={() => handleReorder(order)}
                           className="px-4 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-lg text-xs font-bold hover:bg-brand-primary hover:text-bg-main transition-all flex items-center gap-2"
                         >
                            <RefreshCcw className="w-3.5 h-3.5" />
                            Order Again
                         </button>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;
