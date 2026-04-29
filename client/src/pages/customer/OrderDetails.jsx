import React from 'react';
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
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useData } from '../../context/DataContext.jsx';
import { formatDate } from '../../lib/utils';

const CustomerOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useData();

  const order = orders.find(o => o._id === id);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-bg-surface rounded-full flex items-center justify-center text-text-secondary mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Order not found</h2>
        <p className="text-text-secondary mb-8">We couldn't track down that order number.</p>
        <button onClick={() => navigate('/orders')} className="btn-terminal px-8">Back to My Orders</button>
      </div>
    );
  }

  const timelineSteps = [
    { status: 'PENDING', label: 'Order Placed', icon: Clock },
    { status: 'ACCEPTED', label: 'Accepted', icon: Package },
    { status: 'SHIPPED', label: 'Shipped', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
  ];

  const currentStatusIdx = timelineSteps.findIndex(s => s.status === (order.status === 'CANCELLED' ? 'PENDING' : order.status));
  const isCancelled = order.status === 'CANCELLED';

  const handleReorder = () => {
    // Logic for reordering would go here, e.g., adding items back to cart
    navigate('/shop');
  };

  const handleCancel = () => {
    updateOrderStatus(order._id, 'CANCELLED');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/orders')} 
            className="p-2.5 bg-white/5 rounded-xl text-text-secondary hover:text-brand-primary transition-all border border-white/5 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-sans font-black tracking-tighter text-white">Track <span className="text-brand-primary">Order</span></h1>
            <p className="text-text-secondary flex items-center gap-2 mt-1 text-sm font-medium">
               Order #{String(order._id || order.id || '').slice(-8)} • {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        
        {isCancelled ? (
          <div className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Terminated
          </div>
        ) : (
          <div className="flex gap-4">
            {order.status === 'PENDING' && (
              <button 
                onClick={handleCancel}
                className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all"
              >
                Abort Order
              </button>
            )}
            {order.status === 'SHIPPED' && (
              <button className="btn-terminal px-8 text-bg-main flex items-center gap-2">
                <Truck className="w-4 h-4" /> Track Node
              </button>
            )}
            {order.status === 'DELIVERED' && (
              <button 
                onClick={handleReorder}
                className="btn-terminal px-8 text-bg-main"
              >
                Re-Initialize
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Order Items Section */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <Package className="w-5 h-5 text-brand-primary" /> Yield <span className="text-brand-primary">Manifest _</span>
            </h2>
            <div className="space-y-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-6 p-5 bg-white/5 rounded-2xl border border-white/5 group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-white shrink-0 border border-white/10">
                    <img 
                      src={item.product?.image} 
                      alt={item.product?.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-2">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-black text-xl text-white group-hover:text-brand-primary transition-colors">{item.product?.name}</h3>
                       <p className="font-mono text-brand-primary text-xl font-black">₹{item.price}</p>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40" />
                       Quantity: <span className="text-white">{item.quantity} {item.product?.unit}</span>
                    </p>
                    <div className="flex gap-2">
                       <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-black uppercase tracking-widest text-text-muted">Verified Origin</span>
                       <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-black uppercase tracking-widest text-text-muted">{item.product?.category || 'PRODUCE'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <Truck className="w-5 h-5 text-brand-primary" /> Delivery <span className="text-brand-primary">Node _</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                  <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary h-fit border border-brand-primary/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted mb-2">Target Destination</p>
                     <p className="text-sm font-bold text-white leading-relaxed">
                        {typeof order.shippingAddress === 'object' 
                          ? `${order.shippingAddress.fullAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
                          : order.shippingAddress}
                     </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                   <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary h-fit border border-brand-primary/20">
                     <Phone className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted mb-2">Comms Channel</p>
                     <p className="text-sm font-black text-white tracking-widest">{order.customerPhone || 'NO_COMMS_HUNT'}</p>
                   </div>
                 </div>

                 <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                   <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary h-fit border border-brand-primary/20">
                     <Calendar className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted mb-2">Expected Sync</p>
                     <p className="text-sm font-black text-white tracking-widest">{order.status === 'DELIVERED' ? 'SYNCHRONIZED' : 'ETA_48H_WINDOW'}</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Timeline Section */}
          {!isCancelled && (
            <div className="glass-card p-8">
              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-10">Sequence <span className="text-brand-primary">Status _</span></h2>
              <div className="space-y-10">
                {[
                  { status: 'Order Received', label: 'Received', time: 'Just now', date: formatDate(order.createdAt), active: true, completed: true },
                  { status: 'ACCEPTED', label: 'Accepted', time: order.status !== 'PENDING' ? 'Processed' : 'Soon', date: order.status !== 'PENDING' ? formatDate(order.updatedAt || order.createdAt) : 'Upcoming', active: order.status !== 'PENDING', completed: ['ACCEPTED', 'SHIPPED', 'DELIVERED'].includes(order.status) },
                  { status: 'SHIPPED', label: 'Shipped', time: ['SHIPPED', 'DELIVERED'].includes(order.status) ? 'In Transit' : 'Pending', date: ['SHIPPED', 'DELIVERED'].includes(order.status) ? formatDate(order.updatedAt || order.createdAt) : 'Upcoming', active: ['SHIPPED', 'DELIVERED'].includes(order.status), completed: ['SHIPPED', 'DELIVERED'].includes(order.status) },
                  { status: 'DELIVERED', label: 'Delivered', time: order.status === 'DELIVERED' ? 'Arrived' : 'Expect soon', date: order.status === 'DELIVERED' ? formatDate(order.updatedAt || order.createdAt) : 'Upcoming', active: order.status === 'DELIVERED', completed: order.status === 'DELIVERED' }
                ].map((step, idx, arr) => (
                  <div key={idx} className={`relative flex gap-5 ${!step.active && !step.completed ? 'opacity-20' : ''}`}>
                    {idx !== arr.length - 1 && (
                      <div className={`absolute left-[13px] top-8 w-[2px] h-[calc(100%+24px)] ${step.completed ? 'bg-brand-primary' : 'bg-white/10'}`} />
                    )}
                    <div className={`z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      step.completed 
                      ? 'bg-brand-primary border-brand-primary text-bg-main shadow-lg shadow-brand-primary/40' 
                      : step.active ? 'bg-bg-main border-brand-primary text-brand-primary animate-pulse' : 'bg-bg-main border-white/10 text-text-muted'
                    }`}>
                      {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-black uppercase tracking-widest text-[11px] ${step.active || step.completed ? 'text-white' : 'text-text-muted'}`}>
                        {step.status === 'Order Received' ? 'Order Received' : `Order ${step.label}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Clock className="w-3 h-3 text-text-muted" />
                        <span className="text-[9px] uppercase font-bold text-text-muted tracking-widest">{step.time} • {step.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="glass-card p-8">
            <h2 className="text-lg font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-brand-primary" /> Payment <span className="text-brand-primary">Terminal _</span>
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-2">Protocol</p>
                   <p className="text-lg font-black text-white uppercase tracking-tighter">
                      {order.paymentMethod}
                   </p>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-2">Encrypted</p>
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${
                       order.paymentStatus === 'PAID' ? 'bg-brand-primary' : 'bg-orange-500'
                     }`} />
                     <span className={`text-[10px] font-black uppercase tracking-widest ${
                       order.paymentStatus === 'PAID' ? 'text-brand-primary' : 'text-orange-400'
                     }`}>
                        {order.paymentMethod === 'COD' && order.paymentStatus !== 'PAID' ? 'Pending' : 'Success'}
                     </span>
                   </div>
                </div>
              </div>

              {order.transactionId && (
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                  <ShieldCheck className="w-6 h-6 text-brand-primary/60 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-1">Transaction Hash</p>
                    <p className="text-[10px] font-mono font-black text-white truncate break-all">{order.transactionId}</p>
                  </div>
                </div>
              )}

              {/* Billing Summary */}
              <div className="pt-6 space-y-4 border-t border-white/5">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                   <span className="text-text-muted">Net Yield</span>
                   <span className="text-white">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                   <span className="text-text-muted">Node Transfer</span>
                   <span className="text-white">₹{order.shipping}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                   <span className="text-text-muted">Grid Tax</span>
                   <span className="text-white">₹{order.tax}</span>
                </div>
                <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                   <div>
                      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted mb-2">Total Output</p>
                      <p className="text-4xl font-black text-brand-primary tracking-tighter">₹{order.total}</p>
                   </div>
                   <div className="text-right">
                      <span className="text-[8px] px-3 py-1 bg-white/5 rounded-lg text-text-muted uppercase font-black tracking-widest border border-white/5">All Incl.</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CustomerOrderDetails;
