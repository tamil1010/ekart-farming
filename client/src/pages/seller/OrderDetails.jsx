import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Calendar,
  Package,
  XCircle,
  Mail,
  Building2,
  Printer,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useData } from '../../context/DataContext.jsx';
import { formatDate } from '../../lib/utils';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useData();
  const [showLabel, setShowLabel] = useState(false);

  const order = orders.find(o => o._id === id);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <button onClick={() => navigate('/seller/orders')} className="btn-primary">Back to Orders</button>
      </div>
    );
  }

  // Derive timeline from status
  const statuses = ['PENDING', 'ACCEPTED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentIdx = statuses.indexOf(order.status === 'CANCELLED' ? 'PENDING' : order.status);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/seller/orders')} className="p-2.5 bg-white/5 rounded-xl text-text-secondary hover:text-brand-primary transition-all border border-white/5 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-sans font-black tracking-tighter text-white">Store <span className="text-brand-primary">Orders</span></h1>
            <p className="text-text-secondary flex items-center gap-2 mt-1 text-sm font-medium">
               Order #{String(order.id || order._id).slice(-8)} • {formatDate(order.createdAt || order.date)}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           {order.status === 'PENDING' && (
             <button 
               onClick={() => updateOrderStatus(order._id, 'ACCEPTED')}
               className="btn-terminal px-8 text-bg-main"
             >
               Initialize Shipment
             </button>
           )}
           <button 
             onClick={() => navigate(`/track-order/${order._id}`)}
             className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-brand-primary hover:border-brand-primary/40 transition-all flex items-center gap-2"
           >
             <Truck className="w-4 h-4" /> Tracking View
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           {/* SHIPPING CONTROL SECTION */}
           <div className="glass-card border-brand-primary/20 relative overflow-hidden p-8">
              <div className="absolute top-0 right-0 p-6">
                 <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                   order.status === 'PENDING' ? 'bg-orange-500/20 text-orange-400' :
                   order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-400'
                 }`}>
                   {order.status}
                 </div>
              </div>

              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Truck className="w-5 h-5 text-brand-primary" /> Shipment <span className="text-brand-primary">Node _</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                 <div className="space-y-6">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted mb-3">Logistics Protocol</p>
                       <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full animate-pulse ${
                             order.status === 'DELIVERED' ? 'bg-emerald-500' : 
                             order.status === 'SHIPPED' ? 'bg-purple-500' : 
                             order.status === 'CANCELLED' ? 'bg-red-500' : 'bg-orange-500'
                          }`} />
                          <span className="font-black text-xl text-white tracking-tight">{order.status}</span>
                       </div>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted mb-2">Carrier Entity</p>
                       <p className="font-bold text-white">{order.courierPartner || 'Awaiting Carrier Assignment'}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted mb-2">Network Hash (Tracking)</p>
                       <p className="font-mono font-black text-brand-primary break-all">{order.trackingId || 'Pending Initialization'}</p>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted mb-2">Transmission Multiplier</p>
                       <p className="font-bold text-white">Standard Regional Grid (3-5 Nodes)</p>
                    </div>
                 </div>
              </div>

              <div className="border-t border-white/5 pt-8">
                 <p className="text-[10px] font-black text-text-muted mb-6 uppercase tracking-widest">Update State Terminal</p>
                 <div className="flex flex-wrap gap-4">
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'ACCEPTED')}
                        className="flex-1 bg-brand-primary text-bg-main py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Accept Transaction
                      </button>
                    )}
                    
                     {order.status === 'ACCEPTED' && (
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'SHIPPED')}
                        className="flex-1 bg-brand-primary text-bg-main py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                      >
                        <Truck className="w-5 h-5" /> Execute Shipment
                      </button>
                    )}

                    {order.status === 'SHIPPED' && (
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'OUT_FOR_DELIVERY')}
                        className="flex-1 bg-brand-primary text-bg-main py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                      >
                        <Truck className="w-5 h-5" /> Dispatch Shipment
                      </button>
                    )}

                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'DELIVERED')}
                        className="flex-1 bg-emerald-500 text-bg-main py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Finalize Delivery
                      </button>
                    )}

                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'CANCELLED')}
                        className="px-8 py-4 bg-red-500/10 text-red-500 rounded-xl font-black uppercase text-[10px] tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Terminate Order
                      </button>
                    )}
                 </div>
              </div>
           </div>

           {/* Product Items */}
           <div className="glass-card p-8">
              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Package className="w-5 h-5 text-brand-primary" /> Manifest <span className="text-brand-primary">Inventory _</span>
              </h2>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                       <tr>
                          <th className="pb-6">Yield Module</th>
                          <th className="pb-6">Quantum</th>
                          <th className="pb-6 text-right">Unit Val</th>
                          <th className="pb-6 text-right">Total Val</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {order.items.map((item, idx) => (
                          <tr key={idx} className="group">
                             <td className="py-6">
                                <div className="font-black text-lg text-white group-hover:text-brand-primary transition-colors cursor-default">{item.product?.name || item.name}</div>
                                <div className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-1">HUID: {item.product?._id || 'UNTRACKED'}</div>
                             </td>
                             <td className="py-6">
                                <span className="bg-white/5 px-4 py-2 rounded-lg font-mono text-sm text-white border border-white/5">
                                  {item.quantity} {item.product?.unit || 'pc'}
                                </span>
                             </td>
                             <td className="py-6 text-right font-black text-white">₹{item.price}</td>
                             <td className="py-6 text-right font-black text-brand-primary text-xl">₹{item.price * item.quantity}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Payment & Billing */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3">
                   <CreditCard className="w-5 h-5 text-brand-primary" /> Payment <span className="text-brand-primary">Information _</span>
                </h2>
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-2">Method</p>
                        <p className="text-lg font-black text-white uppercase tracking-tighter">{order.paymentMethod}</p>
                     </div>
                     <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-2">Status</p>
                        <div className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          order.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-brand-primary' : 
                          order.paymentStatus === 'FAILED' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {order.paymentStatus}
                        </div>
                     </div>
                   </div>

                   <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-2">Reference Order ID</p>
                      <p className="text-sm font-black text-white">#{order.id}</p>
                   </div>

                   {order.paymentDate && (
                     <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-2">Payment Date & Time</p>
                        <p className="text-sm font-medium text-white">{new Date(order.paymentDate).toLocaleString()}</p>
                     </div>
                   )}

                   <div className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/20 flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Amount Paid</p>
                      <p className="text-3xl font-black text-brand-primary">₹{order.paymentStatus === 'PAID' ? order.total : 0}</p>
                   </div>
                </div>
              </div>

              <div className="glass-card p-8">
                 <h2 className="text-xl font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-brand-primary" /> Billing <span className="text-brand-primary">Summary _</span>
                 </h2>
                 <div className="space-y-5">
                    <div className="flex justify-between text-xs font-bold">
                       <span className="text-text-muted uppercase tracking-widest">Subtotal</span>
                       <span className="text-white">₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                       <span className="text-text-muted uppercase tracking-widest">Shipping Charges</span>
                       <span className="text-white">₹{order.shipping}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                       <span className="text-text-muted uppercase tracking-widest">Taxes (GST)</span>
                       <span className="text-white">₹{order.tax}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                       <span className="text-brand-primary uppercase tracking-widest">Discount</span>
                       <span className="text-brand-primary">- ₹{order.discount || 0}</span>
                    </div>
                    
                    <div className="pt-8 mt-4 border-t border-white/5">
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted mb-2">Total Payable</p>
                             <p className="text-5xl font-black text-brand-primary tracking-tighter">₹{order.total}</p>
                          </div>
                          <div className="text-right">
                             <span className="text-[9px] px-3 py-1 bg-white/5 rounded-lg text-text-muted uppercase font-black tracking-widest border border-white/5">All Inclusive</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
            {/* Timeline */}
            <div className="glass-card p-8">
               <h2 className="text-xl font-black text-white uppercase tracking-widest mb-10">Network <span className="text-brand-primary">Timeline _</span></h2>
               <div className="space-y-10">
                  {[
                     { status: 'Order Received', label: 'Received', time: 'Just now', date: formatDate(order.createdAt), active: true, completed: true },
                     { status: 'ACCEPTED', label: 'Accepted', time: order.status !== 'PENDING' ? 'Processed' : 'Soon', date: order.status !== 'PENDING' ? formatDate(order.updatedAt || order.createdAt) : 'Upcoming', active: order.status !== 'PENDING', completed: ['ACCEPTED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
                     { status: 'SHIPPED', label: 'Shipped', time: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'In Transit' : 'Pending', date: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? formatDate(order.updatedAt || order.createdAt) : 'Upcoming', active: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status), completed: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
                     { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', time: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'Dispatched' : 'Pending', date: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? formatDate(order.updatedAt || order.createdAt) : 'Upcoming', active: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status), completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
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

           {/* Customer Details */}
           <div className="glass-card p-8 overflow-hidden">
              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                 <User className="w-5 h-5 text-brand-primary" /> Delivery <span className="text-brand-primary">Terminal _</span>
              </h2>
              
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-1">Authenticated Entity</p>
                      <p className="text-sm font-black text-white">{order.customer?.name || order.customerName || 'Anonymous Guest'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-1">Email ID</p>
                      <p className="text-sm font-black text-brand-primary lowercase truncate">{order.customer?.email || order.customerEmail || 'admin@terminal.net'}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <MapPin className="w-4 h-4 text-brand-primary" />
                       <h3 className="text-[10px] uppercase font-black tracking-tighter text-white">Delivery Address</h3>
                    </div>
                    
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-6">
                       <div>
                          <p className="text-[9px] uppercase font-black tracking-widest text-text-muted mb-2">Full Address</p>
                          <p className="text-xs font-medium text-white leading-relaxed">{typeof order.shippingAddress === 'object' ? order.shippingAddress.fullAddress : order.shippingAddress}</p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-6">
                          <div>
                             <p className="text-[9px] uppercase font-black tracking-widest text-text-muted mb-1">City</p>
                             <p className="text-xs font-black text-white">{typeof order.shippingAddress === 'object' ? order.shippingAddress.city : 'METROPOLIS'}</p>
                          </div>
                          <div>
                             <p className="text-[9px] uppercase font-black tracking-widest text-text-muted mb-1">State</p>
                             <p className="text-xs font-black text-white">{typeof order.shippingAddress === 'object' ? order.shippingAddress.state : 'REGION-01'}</p>
                          </div>
                          <div>
                             <p className="text-[9px] uppercase font-black tracking-widest text-text-muted mb-1">Pincode</p>
                             <p className="text-xs font-black text-white font-mono tracking-widest">{typeof order.shippingAddress === 'object' ? order.shippingAddress.pincode : '000000'}</p>
                          </div>
                          <div>
                             <p className="text-[9px] uppercase font-black tracking-widest text-text-muted mb-1">Country</p>
                             <p className="text-xs font-black text-white">{typeof order.shippingAddress === 'object' ? order.shippingAddress.country : 'GLOBAL'}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                       <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-3.5 h-3.5 text-brand-primary" />
                          <p className="text-[9px] uppercase font-black tracking-widest text-text-muted">Address Type</p>
                       </div>
                       <p className="text-xs font-black text-white tracking-widest uppercase">{typeof order.shippingAddress === 'object' ? (order.shippingAddress.addressType || 'Home') : 'Home'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                       <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                          <p className="text-[9px] uppercase font-black tracking-widest text-text-muted">Customer Type</p>
                       </div>
                       <p className="text-xs font-black text-white tracking-widest uppercase">{order.customerType || (order.customerId !== 'GUEST' ? 'Registered' : 'Guest')}</p>
                    </div>
                 </div>

                 <button 
                   onClick={() => setShowLabel(true)}
                   className="w-full py-5 bg-white/5 border border-white/10 hover:border-brand-primary/40 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-lg hover:shadow-brand-primary/5"
                 >
                   Print Shipping Label <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-2 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Shipping Label Modal */}
      <AnimatePresence>
        {showLabel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 no-print backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden text-black scrollbar-hide max-h-[90vh] overflow-y-auto relative"
            >
               <div className="sticky top-0 p-6 border-b flex justify-between items-center bg-gray-50 no-print z-10">
                 <h3 className="text-xl font-bold">Shipping Label Preview</h3>
                 <div className="flex gap-2">
                   <button 
                     onClick={handlePrint}
                     className="bg-brand-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-secondary transition-all"
                   >
                     <Printer className="w-4 h-4" /> Print Now
                   </button>
                   <button 
                     onClick={() => setShowLabel(false)}
                     className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                   >
                     <X className="w-6 h-6" />
                   </button>
                 </div>
               </div>

               <div id="printable-content" className="p-10 bg-white">
                 {/* Label Box */}
                 <div className="border-[6px] border-black p-8 relative">
                   <div className="flex justify-between items-start mb-8 border-b-4 border-black pb-8">
                     <div>
                       <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">eKart Farming</h1>
                       <p className="text-sm font-bold uppercase tracking-[0.3em] text-gray-600 mt-2">Logistics & Supply Chain Hub</p>
                     </div>
                     <div className="text-right">
                       <p className="text-xs font-black uppercase text-gray-400 mb-1">Package Order ID</p>
                       <p className="text-3xl font-black">#{order.id}</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-5 gap-12 mb-12">
                     <div className="col-span-3 space-y-10">
                        <div>
                          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 underline decoration-black decoration-2 underline-offset-4">Ship Destination:</p>
                          <h2 className="text-4xl font-black uppercase leading-tight mt-4">{order.customerName}</h2>
                          <div className="flex items-center gap-4 mt-2">
                             <p className="text-2xl font-black">{order.customerPhone}</p>
                             <div className="bg-black text-white px-2 py-0.5 text-xs font-black">MOBILE VERIFIED</div>
                          </div>
                          <p className="text-sm text-gray-500 font-bold">{order.customerEmail}</p>
                        </div>

                        <div>
                          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 underline decoration-black decoration-2 underline-offset-4">Delivery Point:</p>
                          <p className="text-2xl font-black uppercase leading-tight mt-4">
                            {typeof order.shippingAddress === 'object' ? order.shippingAddress.fullAddress : order.shippingAddress}
                          </p>
                          <div className="mt-4 text-3xl font-black uppercase border-t-2 border-dashed border-gray-300 pt-4">
                            {typeof order.shippingAddress === 'object' ? (
                              <>
                                <span className="text-4xl">{order.shippingAddress.city}</span>, {order.shippingAddress.state}
                                <div className="text-7xl mt-4 tracking-[0.25em] font-black bg-gray-100 p-4 inline-block">{order.shippingAddress.pincode}</div>
                              </>
                            ) : (
                              'ADDR ERR: CONTACT HQ'
                            )}
                          </div>
                        </div>
                     </div>

                     <div className="col-span-2 space-y-10 border-l-[6px] border-black pl-12 flex flex-col">
                        <div>
                          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 underline decoration-black decoration-2 underline-offset-4">Payment Control:</p>
                          <div className="space-y-4">
                            <div className="bg-black text-white p-4 text-center">
                               <p className="text-xs font-bold uppercase opacity-60">Method</p>
                               <p className="text-2xl font-black uppercase">{order.paymentMethod}</p>
                            </div>
                            <div className="border-4 border-black p-4 text-center">
                               <p className="text-xs font-bold uppercase text-gray-500">Status</p>
                               <p className={`text-2xl font-black uppercase ${order.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-orange-700'}`}>
                                 {order.paymentStatus}
                               </p>
                            </div>
                          </div>
                          {order.paymentMethod === 'COD' && order.paymentStatus !== 'PAID' && (
                            <div className="mt-8 bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
                               <p className="text-xs font-black uppercase leading-none mb-1">CASH TO COLLECT</p>
                               <p className="text-5xl font-black">₹{order.total}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex-grow">
                          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 underline decoration-black decoration-2 underline-offset-4">Package Contents:</p>
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-1">
                                 <p className="text-lg font-black uppercase truncate pr-4">{item.product?.name || item.name}</p>
                                 <p className="text-xl font-black italic">x{item.quantity}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Barcode Simulation */}
                        <div className="pt-12 text-center">
                           <div className="flex justify-center items-end gap-[4px] h-20 mb-3">
                             {[...Array(40)].map((_, i) => (
                               <div key={i} className={`bg-black ${Math.random() > 0.4 ? 'w-[4px]' : 'w-[8px]'} ${Math.random() > 0.05 ? 'h-full' : 'h-1/2'}`} />
                             ))}
                           </div>
                           <p className="text-xl font-mono font-black tracking-[0.1em]">{order.id.replace(/-/g, '').toUpperCase()}</p>
                        </div>
                     </div>
                   </div>

                   <div className="pt-8 border-t-4 border-black flex justify-between items-center bg-gray-200 p-6 -mx-8 -mb-8">
                     <div>
                       <p className="text-[12px] font-black uppercase tracking-widest text-black/80">Certified Farmer Produce • Hand-Packed with Care</p>
                       <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase">Automated Label Generation Systems v2.4</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[14px] font-black text-black">PRINTED AT {new Date().toLocaleTimeString()}</p>
                       <p className="text-[10px] font-bold text-gray-500 uppercase">{new Date().toLocaleDateString()}</p>
                     </div>
                   </div>
                 </div>

                 <div className="mt-12 text-center text-sm text-gray-400 font-black uppercase tracking-[0.15em] no-print pb-10">
                   Standard A4 Courier Specifications Compliant
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderDetails;
