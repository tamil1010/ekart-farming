import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
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
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useData();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const customerOrders = orders.filter(o => 
    o.customerId === user?.id || 
    (o.customerEmail === user?.email && user?.email !== undefined) ||
    (o.customerName === user?.email && user?.email !== undefined)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'ACCEPTED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'SHIPPED': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'DELIVERED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-text-secondary bg-bg-surface border-brand-dark/20';
    }
  };

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      // Re-add items to cart
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
          className="w-24 h-24 bg-brand-dark/20 rounded-full flex items-center justify-center text-brand-primary mb-8"
        >
          <ShoppingBag className="w-12 h-12" />
        </motion.div>
        <h2 className="text-3xl font-display font-bold mb-4">No orders placed yet</h2>
        <p className="text-text-secondary mb-8 max-w-sm mx-auto">
          It looks like your pantry is waiting for some fresh farm goodness!
        </p>
        <button 
          onClick={() => navigate('/shop')} 
          className="btn-primary px-10 py-4 text-lg"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h1 className="text-4xl font-display font-black tracking-tight">Track Your Harvest</h1>
        <p className="text-text-secondary flex items-center gap-2">
          Real-time updates on your fresh orders from eKart Farming.
        </p>
      </header>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {customerOrders.map((order, orderIdx) => (
            <motion.div 
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: orderIdx * 0.1 }}
              className="glass-card hover:border-brand-primary/30 transition-all p-0 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 md:p-8 bg-brand-dark/10 flex flex-wrap justify-between items-center gap-4 border-b border-brand-dark/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-bg-surface rounded-2xl flex items-center justify-center text-brand-primary shadow-inner">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">Order ID</p>
                      <span className="font-mono text-brand-primary font-black">#{order.id}</span>
                    </div>
                    <p className="text-sm font-medium flex items-center gap-2 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-text-secondary" /> {order.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                     <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">Total Amount</p>
                     <p className="text-xl font-display font-black text-white">₹{order.total}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <button 
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="btn-primary px-4 py-2 text-xs flex items-center gap-2"
                  >
                    Track Order <ArrowRight className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => deleteOrder(order.id)}
                    className="p-1.5 text-text-secondary hover:text-red-500 transition-colors"
                    title="Delete from History"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Order Details Column */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Products */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
                       Purchased Items
                    </h3>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center group">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-bg-surface border border-brand-dark/20 shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-lg leading-tight">{item.name}</h4>
                                  <p className="text-sm text-text-secondary mt-1 uppercase tracking-tight font-mono">
                                    {item.quantity} {item.unit || 'unit'} x ₹{item.price}
                                  </p>
                                </div>
                                <p className="font-bold text-brand-primary">₹{item.price * item.quantity}</p>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-brand-dark/20">
                     <div className="space-y-3">
                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-text-secondary flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> Delivery Address
                        </h4>
                        <p className="text-sm leading-relaxed text-slate-300 font-medium">
                          {typeof order.shippingAddress === 'object' 
                            ? `${order.shippingAddress.fullAddress}, ${order.shippingAddress.city}`
                            : order.shippingAddress}
                        </p>
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-text-secondary flex items-center gap-2">
                          <CreditCard className="w-3 h-3" /> Payment Info
                        </h4>
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-medium">{order.paymentMethod}</span>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.paymentStatus === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                             {order.paymentStatus}
                           </span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Status Tracking Column */}
                <div className="lg:col-span-5 bg-bg-surface/30 rounded-3xl p-6 border border-brand-dark/20 flex flex-col">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-8">
                     Tracking History
                  </h3>
                  
                  <div className="flex-1 space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-brand-dark/40">
                    {order.timeline.map((step, idx) => (
                      <div key={idx} className={`relative pl-10 flex gap-4 transition-all duration-500 ${step.active ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                        <div className={`absolute left-0 w-8 h-8 rounded-full border-2 z-10 flex items-center justify-center transition-all ${
                          step.completed 
                          ? 'bg-brand-primary border-brand-primary text-white scale-110 shadow-lg shadow-brand-primary/20' 
                          : step.active ? 'bg-bg-surface border-brand-primary text-brand-primary scale-110 animate-pulse' : 'bg-bg-surface border-brand-dark text-text-secondary'
                        }`}>
                          {step.completed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold leading-none mb-1.5 ${step.active ? 'text-white' : 'text-text-secondary'}`}>
                            {step.status}
                          </p>
                          <div className="flex items-center gap-2">
                             <Clock className="w-3 h-3 text-text-secondary" />
                             <span className="text-[10px] font-bold text-text-secondary uppercase">{step.time} • {step.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contextual Actions */}
                  <div className="mt-8 pt-6 border-t border-brand-dark/20 flex flex-col gap-3">
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                        className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-red-500 hover:text-white transition-all group"
                      >
                         <XCircle className="w-5 h-5" /> Cancel Order
                      </button>
                    )}

                    {order.status === 'DELIVERED' && (
                      <button 
                        onClick={() => handleReorder(order)}
                        className="w-full py-3 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-brand-primary hover:text-white transition-all group"
                      >
                         <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" /> Reorder Now
                      </button>
                    )}

                    {order.status !== 'CANCELLED' && (
                      <button className="w-full py-3 bg-bg-surface hover:bg-white/5 border border-brand-dark/40 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all">
                         Get Support <ExternalLink className="w-4 h-4" />
                      </button>
                    )}

                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="w-full py-2 text-xs font-bold text-text-secondary hover:text-red-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                       <Trash2 className="w-3.5 h-3.5" /> Remove from records
                    </button>
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
