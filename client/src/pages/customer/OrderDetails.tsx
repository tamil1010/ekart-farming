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
import { motion } from 'motion/react';

import { useData } from '../../context/DataContext';

const CustomerOrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useData();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-bg-surface rounded-full flex items-center justify-center text-text-secondary mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Order not found</h2>
        <p className="text-text-secondary mb-8">We couldn't track down that order number.</p>
        <button onClick={() => navigate('/orders')} className="btn-primary px-8">Back to My Orders</button>
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
    updateOrderStatus(order.id, 'CANCELLED');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/orders')} 
            className="p-2.5 bg-bg-surface rounded-xl text-text-secondary hover:text-brand-primary transition-all border border-brand-dark/30 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold">Track Order</h1>
            <p className="text-text-secondary text-sm flex items-center gap-2">
              Order #{order.id.split('-')[1] || order.id} • {order.date}
            </p>
          </div>
        </div>
        
        {isCancelled ? (
          <div className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/20 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Order Cancelled
          </div>
        ) : (
          <div className="flex gap-3">
            {order.status === 'PENDING' && (
              <button 
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-xl text-sm font-bold border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all"
              >
                Cancel Order
              </button>
            )}
            {order.status === 'SHIPPED' && (
              <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-hover transition-all flex items-center gap-2">
                <Truck className="w-4 h-4" /> Track Courier
              </button>
            )}
            {order.status === 'DELIVERED' && (
              <button 
                onClick={handleReorder}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-hover transition-all"
              >
                Buy Again
              </button>
            )}
          </div>
        )}
      </div>

      {/* Visual Timeline */}
      {!isCancelled && (
        <div className="glass-card">
          <div className="flex flex-col md:flex-row justify-between relative gap-8 py-4">
            {/* Background Line */}
            <div className="hidden md:block absolute top-[2.25rem] left-[10%] right-[10%] h-0.5 bg-brand-dark/20 z-0" />
            
            {timelineSteps.map((step, idx) => {
              const active = idx <= currentStatusIdx;
              const Icon = step.icon;
              return (
                <div key={idx} className="flex md:flex-col items-center gap-4 relative z-10 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                    active 
                    ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/30' 
                    : 'bg-bg-surface border-brand-dark/30 text-text-secondary'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left md:text-center">
                    <p className={`text-sm font-bold ${active ? 'text-white' : 'text-text-secondary'}`}>{step.label}</p>
                    {active && idx === currentStatusIdx && (
                      <p className="text-[10px] uppercase tracking-widest font-black text-brand-primary animate-pulse">Current Stage</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Order Details (Product List) */}
          <div className="glass-card">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-primary" /> Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3 bg-bg-surface rounded-2xl border border-brand-dark/10 group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-text-secondary">Quantity: {item.quantity} {item.unit}</p>
                    <p className="font-bold text-brand-primary mt-1">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="glass-card">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-brand-dark/20 pb-4">
              <Truck className="w-5 h-5 text-brand-primary" /> Delivery Details
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="p-3 bg-bg-surface rounded-xl text-brand-primary h-fit">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Delivery Address</p>
                   <p className="text-sm font-medium leading-relaxed">
                      {typeof order.shippingAddress === 'object' 
                        ? `${order.shippingAddress.fullAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
                        : order.shippingAddress}
                   </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-bg-surface rounded-xl text-brand-primary h-fit">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Contact Number</p>
                    <p className="text-sm font-bold">{order.customerPhone || 'Not Provided'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-bg-surface rounded-xl text-brand-primary h-fit">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Estimated Delivery</p>
                    <p className="text-sm font-bold">{order.status === 'DELIVERED' ? 'Arrived' : 'In 2-3 Days'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Payment Information */}
          <div className="glass-card">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-brand-dark/20 pb-4">
              <CreditCard className="w-5 h-5 text-brand-primary" /> Payment Details
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-bg-surface rounded-2xl border border-brand-dark/10">
                   <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Method</p>
                   <p className="text-sm font-bold flex items-center gap-2">
                      {order.paymentMethod}
                   </p>
                </div>
                <div className="p-4 bg-bg-surface rounded-2xl border border-brand-dark/10">
                   <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Status</p>
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${
                       order.paymentStatus === 'PAID' ? 'bg-emerald-500' : 'bg-orange-500'
                     }`} />
                     <span className={`text-sm font-bold ${
                       order.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-orange-400'
                     }`}>
                        {order.paymentMethod === 'COD' && order.paymentStatus !== 'PAID' ? 'Pay on Delivery' : 'Payment Successful'}
                     </span>
                   </div>
                </div>
              </div>

              {order.transactionId && (
                <div className="p-4 bg-bg-surface rounded-2xl border border-brand-dark/10 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-primary" />
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Transaction ID</p>
                    <p className="text-xs font-mono font-bold truncate">{order.transactionId}</p>
                  </div>
                </div>
              )}

              {/* Billing Summary */}
              <div className="pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                   <span className="text-text-secondary">Subtotal</span>
                   <span className="font-mono">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-text-secondary">Shipping</span>
                   <span className="font-mono">₹{order.shipping}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-text-secondary">Taxes</span>
                   <span className="font-mono">₹{order.tax}</span>
                </div>
                <div className="pt-4 border-t border-brand-dark/20 flex justify-between items-center h-12">
                   <span className="font-bold">Grand Total</span>
                   <span className="text-2xl font-display font-black text-brand-primary">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Help / Support Card */}
          <div className="p-6 bg-brand-primary/5 border border-brand-primary/20 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-brand-primary/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm">Need help with order?</p>
                <p className="text-xs text-text-secondary">Contact eKart Support</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetails;
