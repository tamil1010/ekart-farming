import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  CreditCard, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Calendar,
  Package,
  XCircle,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Info,
  RefreshCw,
  Box,
  Send,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext.jsx';
import { formatDate } from '../../lib/utils';

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const order = orders.find(o => o._id === id || o.id === id);

  useEffect(() => {
    // Simple refresh animation to simulate real-time check
    if (isRefreshing) {
      const timer = setTimeout(() => setIsRefreshing(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isRefreshing]);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-bg-main">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-8 border border-red-500/20"
        >
          <XCircle className="w-12 h-12" />
        </motion.div>
        <h2 className="text-3xl font-display font-black text-white mb-4">Transmission Lost</h2>
        <p className="text-text-secondary mb-10 max-w-md">We couldn't track down that order sequence in the agricultural grid.</p>
        <button onClick={() => navigate('/orders')} className="btn-terminal px-10 py-4 text-bg-main font-black uppercase tracking-widest leading-none">
          Back to Terminal
        </button>
      </div>
    );
  }

  const statusConfig = {
    'PENDING': { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', label: 'Processing', description: 'Your order is being verified by the seller.' },
    'ACCEPTED': { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', label: 'Accepted', description: 'The farmer has accepted and is preparing your yield.' },
    'SHIPPED': { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', label: 'In Transit', description: 'Your produce is on its way to the delivery node.' },
    'OUT_FOR_DELIVERY': { color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', label: 'Out for Delivery', description: 'The courier is approaching your destination coordinates.' },
    'DELIVERED': { color: 'text-brand-primary', bg: 'bg-brand-primary/10', border: 'border-brand-primary/20', label: 'Delivered', description: 'The sequence is complete. Enjoy your fresh produce!' },
    'CANCELLED': { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Terminated', description: 'This order was aborted and will not be processed.' }
  };

  const currentConfig = statusConfig[order.status] || statusConfig['PENDING'];
  const isCancelled = order.status === 'CANCELLED';

  const timelineSteps = [
    { key: 'PLACED', status: 'PENDING', label: 'Order Placed', desc: 'Grid Recorded', icon: Package },
    { key: 'ACCEPTED', status: 'ACCEPTED', label: 'Accepted', desc: 'Yield Verified', icon: Check },
    { key: 'SHIPPED', status: 'SHIPPED', label: 'Shipped', desc: 'Node Transfer', icon: Truck },
    { key: 'OUT_FOR_DELIVERY', status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Local Transit', icon: Box },
    { key: 'DELIVERED', status: 'DELIVERED', label: 'Delivered', desc: 'Final Sync', icon: CheckCircle2 }
  ];

  const getStatusLevel = (status) => {
    if (status === 'PENDING') return 0;
    if (status === 'ACCEPTED') return 1;
    if (status === 'SHIPPED') return 2;
    if (status === 'OUT_FOR_DELIVERY') return 3;
    if (status === 'DELIVERED') return 4;
    return -1;
  };

  const currentLevel = getStatusLevel(order.status);

  const handleAction = () => {
    if (order.status === 'PENDING') {
      updateOrderStatus(order._id, 'CANCELLED');
    } else if (order.status === 'DELIVERED') {
      navigate('/shop');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700 font-sans">
      {/* Header Section */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8"
      >
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white/5 rounded-2xl text-text-secondary hover:text-brand-primary transition-all border border-white/5 hover:border-brand-primary/40 group active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-display font-black tracking-tight text-white">Track <span className="text-brand-primary">Order</span></h1>
              <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${currentConfig.bg} ${currentConfig.color} border ${currentConfig.border}`}>
                {currentConfig.label}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-text-muted text-xs font-bold uppercase tracking-wider">
               <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                 ID: <span className="text-white">#{String(order._id || order.id || '').slice(-8)}</span>
               </span>
               <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                 <Calendar className="w-3.5 h-3.5" /> {formatDate(order.createdAt)}
               </span>
               {order.updatedAt && (
                 <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                   <Clock className="w-3.5 h-3.5" /> Updated: {formatDate(order.updatedAt)}
                 </span>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button 
            onClick={() => setIsRefreshing(true)}
            className="hidden sm:flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-text-secondary transition-all border border-white/5"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-primary' : ''}`} />
            Sync Status
          </button>
          
          <button 
            onClick={handleAction}
            disabled={order.status === 'ACCEPTED' || order.status === 'SHIPPED'}
            className={`flex-1 lg:flex-none px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl ${
              order.status === 'PENDING' 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                : order.status === 'DELIVERED'
                ? 'btn-terminal text-bg-main shadow-brand-primary/20'
                : 'bg-white/5 text-text-muted border border-white/10 cursor-not-allowed'
            }`}
          >
            {order.status === 'PENDING' ? 'Cancel Order' : order.status === 'DELIVERED' ? 'Reorder Yield' : 'Processing...'}
          </button>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Timeline & Delivery */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Real-time Timeline Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card overflow-hidden p-0"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
               <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                 <Truck className="w-5 h-5 text-brand-primary" /> Delivery <span className="text-brand-primary">Journey _</span>
               </h2>
               <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-brand-primary">Live Tracking Enabled</span>
               </div>
            </div>

            <div className="p-8 lg:p-12">
               {isCancelled ? (
                 <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                      <XCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Order Aborted</h3>
                    <p className="text-text-secondary text-sm max-w-sm">This order sequence was terminated by the user or the system grid.</p>
                 </div>
               ) : (
                 <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0 lg:px-4">
                    {/* Progress Bar (Desktop) */}
                    <div className="hidden md:block absolute top-[28px] left-[40px] right-[40px] h-[3px] bg-white/5 -z-0">
                      <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: `${(currentLevel / 4) * 100}%` }}
                        className="h-full bg-brand-primary shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>

                    {timelineSteps.map((step, idx) => {
                      const level = idx; // Correct mapping for displayed items
                      const isCompleted = currentLevel >= level;
                      const isCurrent = currentLevel === level;
                      const Icon = step.icon;

                      return (
                        <div key={idx} className="relative z-10 flex flex-row md:flex-col items-center gap-5 md:gap-4 w-full md:w-auto">
                           {/* Step Circle */}
                           <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${
                             isCompleted 
                             ? 'bg-brand-primary border-brand-primary text-bg-main shadow-2xl shadow-brand-primary/40 rotate-12' 
                             : isCurrent 
                             ? 'bg-bg-main border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse' 
                             : 'bg-bg-main border-white/10 text-text-muted'
                           }`}>
                             <Icon className={`w-6 h-6 ${isCompleted ? 'scale-110' : ''}`} />
                             {isCurrent && (
                               <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-[8px] font-black border-2 border-brand-primary">
                                  !
                               </div>
                             )}
                           </div>

                           <div className="text-left md:text-center min-w-0">
                             <h4 className={`text-xs font-black uppercase tracking-widest leading-none mb-1.5 ${isCompleted || isCurrent ? 'text-white' : 'text-text-muted'}`}>
                               {step.label}
                             </h4>
                             <p className={`text-[9px] font-bold uppercase tracking-tighter ${isCurrent ? 'text-brand-primary' : 'text-text-muted/60'}`}>
                               {isCompleted ? (idx === currentLevel ? 'Active Now' : 'Completed') : step.desc}
                             </p>
                           </div>

                           {/* Mobile Progress Line */}
                           {idx < timelineSteps.length - 1 && (
                             <div className="md:hidden absolute left-[27px] top-14 w-[2px] h-8 bg-white/5 -z-10" />
                           )}
                        </div>
                      );
                    })}
                 </div>
               )}

               {!isCancelled && order.status !== 'DELIVERED' && (
                 <div className="mt-16 p-5 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                    <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Estimated Synchronization</p>
                       <p className="text-xs text-text-muted leading-relaxed">
                         Node delivery scheduled within <span className="text-brand-primary font-bold">24-48 hours</span>. Tracking packets are encrypted and secure.
                       </p>
                    </div>
                 </div>
               )}
            </div>
          </motion.div>

          {/* Delivery Details Bento Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8"
            >
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-primary" /> Delivery Node
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-brand-primary/20 transition-all">
                  <div>
                     <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-3">Destination Coordinates</p>
                     <p className="text-sm font-bold text-white leading-relaxed group-hover:text-brand-primary transition-colors">
                        {typeof order.shippingAddress === 'object' 
                          ? `${order.shippingAddress.fullAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
                          : order.shippingAddress}
                     </p>
                     {order.shippingAddress?.addressType && (
                       <span className="inline-block mt-4 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-md text-[8px] font-black uppercase text-brand-primary tracking-widest">
                         {order.shippingAddress.addressType} Location
                       </span>
                     )}
                  </div>
                </div>

                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-2">Comms Proxy</p>
                   <div className="flex items-center gap-3">
                     <Phone className="w-4 h-4 text-brand-primary/60" />
                     <p className="text-sm font-black text-white tracking-widest">{order.customerPhone || '+91 91234 56789'}</p>
                   </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 flex flex-col"
            >
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-brand-primary" /> Payment Terminal
              </h3>
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-2">Protocol</p>
                     <span className="text-xs font-black text-white tracking-widest px-3 py-1 bg-white/10 rounded-lg">{order.paymentMethod || 'UPI_SECURE'}</span>
                   </div>
                   <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-2">Auth Status</p>
                     <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-brand-primary animate-pulse' : 'bg-yellow-500'}`} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'PAID' ? 'text-brand-primary' : 'text-yellow-500'}`}>
                         {order.paymentStatus === 'PAID' ? 'Confirmed' : 'Authorized'}
                       </span>
                     </div>
                   </div>
                </div>

                <div className="p-6 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl">
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] uppercase font-black tracking-widest text-text-muted mb-2">Total Yield Output</p>
                        <p className="text-4xl font-black text-brand-primary tracking-tighter">₹{order.total}</p>
                      </div>
                      <div className="text-right">
                        <CreditCard className="w-8 h-8 text-brand-primary/20" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-text-muted mt-2 block">Tax Incl.</span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Yield Manifest (Product Details) */}
        <div className="lg:col-span-4 space-y-8">
           <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-0"
           >
             <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Yield <span className="text-brand-primary">Manifest _</span></h2>
                <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-text-muted border border-white/5 uppercase">
                   {order.items?.length} Component{order.items?.length !== 1 ? 's' : ''}
                </span>
             </div>
             <div className="p-8 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="group relative flex gap-6 p-5 bg-white/[0.03] rounded-3xl border border-white/5 hover:border-brand-primary/30 hover:bg-white/[0.06] transition-all cursor-default">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 border border-white/10 group-hover:scale-95 transition-transform duration-500">
                      <img 
                        src={item.product?.image} 
                        alt={item.product?.name} 
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                       <h3 className="font-black text-white group-hover:text-brand-primary transition-colors truncate">{item.product?.name}</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                         <span className="text-white">₹{item.price}</span> 
                         <span className="text-text-muted/40">•</span>
                         <span className="text-brand-primary">{item.quantity} {item.product?.unit}</span>
                       </p>
                       <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded-md text-[8px] font-black uppercase text-brand-primary tracking-widest">Organic</span>
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] font-black uppercase text-text-muted tracking-widest">Verified origin</span>
                       </div>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ChevronRight className="w-4 h-4 text-brand-primary" />
                    </div>
                  </div>
                ))}
             </div>

             {/* Amount Breakdown Summary */}
             <div className="p-8 bg-white/[0.02] border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                   <span className="text-text-muted">Net Produce</span>
                   <span className="text-white">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                   <span className="text-text-muted">Transfer Fees</span>
                   <span className="text-white">₹{order.shipping}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                   <span className="text-text-muted">Node Surcharge</span>
                   <span className="text-white">₹{order.tax}</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                   <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Grid Total</span>
                   <span className="text-2xl font-black text-brand-primary tracking-tight">₹{order.total}</span>
                </div>
             </div>
           </motion.div>

           <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-3xl flex items-center gap-4"
           >
              <div className="p-3 bg-brand-primary rounded-xl text-bg-main shadow-lg shadow-brand-primary/40">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Encrypted Tracking</h4>
                <p className="text-[10px] text-brand-primary/80 font-bold uppercase tracking-widest">Real-time Node Verification Active</p>
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;
