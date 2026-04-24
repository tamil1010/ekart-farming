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
import { motion, AnimatePresence } from 'motion/react';

import { useData } from '../../context/DataContext';

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useData();
  const [showLabel, setShowLabel] = useState(false);

  const order = orders.find(o => o.id === id);

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
  const statuses = ['PENDING', 'ACCEPTED', 'SHIPPED', 'DELIVERED'];
  const currentIdx = statuses.indexOf(order.status === 'CANCELLED' ? 'PENDING' : order.status);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/seller/orders')} className="p-2 bg-bg-surface rounded-xl text-text-secondary hover:text-brand-primary transition-all border border-brand-dark">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            Order <span className="text-brand-primary">#{order.id}</span>
          </h1>
          <p className="text-text-secondary flex items-center gap-2 mt-1">
             <Calendar className="w-4 h-4" /> {order.date}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 3. SHIPPING CONTROL SECTION */}
          <div className="glass-card border-brand-primary/30 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${
                  order.status === 'PENDING' ? 'bg-orange-500/20 text-orange-400' :
                  order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {order.status}
                </span>
             </div>

             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-primary" /> Shipping Information
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                   <div className="p-4 bg-bg-surface rounded-2xl border border-brand-dark/20">
                      <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-2">Current Shipping Status</p>
                      <div className="flex items-center gap-2">
                         <div className={`w-3 h-3 rounded-full animate-pulse ${
                            order.status === 'DELIVERED' ? 'bg-emerald-500' : 
                            order.status === 'SHIPPED' ? 'bg-purple-500' : 
                            order.status === 'CANCELLED' ? 'bg-red-500' : 'bg-orange-500'
                         }`} />
                         <span className="font-bold text-lg leading-none">{order.status}</span>
                      </div>
                   </div>
                   <div className="p-4 bg-bg-surface rounded-2xl border border-brand-dark/20">
                      <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Courier Partner</p>
                      <p className="font-bold">{order.courierPartner || 'Not assigned yet'}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="p-4 bg-bg-surface rounded-2xl border border-brand-dark/20">
                      <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Tracking ID</p>
                      <p className="font-mono font-bold text-brand-primary">{order.trackingId || 'Pending shipment'}</p>
                   </div>
                   <div className="p-4 bg-bg-surface rounded-2xl border border-brand-dark/20">
                      <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Shipping Type</p>
                      <p className="font-bold">Standard Delivery (3-5 Days)</p>
                   </div>
                </div>
             </div>

             <div className="border-t border-brand-dark/20 pt-6">
                <p className="text-xs font-bold text-text-secondary mb-4 uppercase tracking-widest">Update Shipment Status (Seller Action)</p>
                <div className="flex flex-wrap gap-3">
                   {order.status === 'PENDING' && (
                     <button 
                       onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                       className="flex-1 min-w-[150px] bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2"
                     >
                       <CheckCircle2 className="w-5 h-5" /> Accept Order
                     </button>
                   )}
                   
                   {order.status === 'ACCEPTED' && (
                     <button 
                       onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                       className="flex-1 min-w-[200px] bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                     >
                       <Truck className="w-5 h-5" /> Mark as Shipped
                     </button>
                   )}

                   {order.status === 'SHIPPED' && (
                     <button 
                       onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                       className="flex-1 min-w-[200px] bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                     >
                       <CheckCircle2 className="w-5 h-5" /> Mark Delivered
                     </button>
                   )}

                   {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                     <button 
                       onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                       className="px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                     >
                       <XCircle className="w-4 h-4" /> Cancel Order
                     </button>
                   )}
                </div>
             </div>
          </div>

          {/* Product Items */}
          <div className="glass-card">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-primary" /> Order Items
             </h2>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="text-text-secondary text-xs uppercase tracking-widest">
                      <tr>
                         <th className="pb-4">Product Name</th>
                         <th className="pb-4">Quantity</th>
                         <th className="pb-4 text-right">Unit Price</th>
                         <th className="pb-4 text-right">Amount</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-brand-dark/10">
                      {order.items.map(item => (
                         <tr key={item.id}>
                            <td className="py-4">
                               <div className="font-semibold text-lg">{item.name}</div>
                               <div className="text-xs text-text-secondary uppercase">SKU: {item.id}</div>
                            </td>
                            <td className="py-4">
                               <span className="bg-bg-surface px-3 py-1 rounded-md font-mono">{item.quantity} {item.unit}</span>
                            </td>
                            <td className="py-4 text-right font-medium">₹{item.price}</td>
                            <td className="py-4 text-right font-bold text-brand-primary">₹{item.price * item.quantity}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Payment & Billing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass-card">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-brand-dark/20 pb-4">
                  <CreditCard className="w-5 h-5 text-brand-primary" /> Payment Information
               </h2>
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-bg-surface rounded-xl border border-brand-dark/10">
                       <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Method</p>
                       <p className="text-sm font-bold">{order.paymentMethod}</p>
                    </div>
                    <div className="p-3 bg-bg-surface rounded-xl border border-brand-dark/10">
                       <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Status</p>
                       <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                         order.paymentStatus === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 
                         order.paymentStatus === 'FAILED' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-400'
                       }`}>
                         {order.paymentStatus}
                       </span>
                    </div>
                  </div>

                  {order.transactionId && order.paymentMethod !== 'COD' && (
                    <div className="p-3 bg-bg-surface rounded-xl border border-brand-dark/10">
                       <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Transaction ID</p>
                       <p className="text-sm font-mono font-bold text-brand-primary truncate">{order.transactionId}</p>
                    </div>
                  )}

                  <div className="p-3 bg-bg-surface rounded-xl border border-brand-dark/10">
                    <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Reference Order ID</p>
                    <p className="text-sm font-bold">#{order.id}</p>
                  </div>

                  {order.paymentDate && (
                    <div className="p-3 bg-bg-surface rounded-xl border border-brand-dark/10">
                       <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Payment Date & Time</p>
                       <p className="text-sm font-medium">{new Date(order.paymentDate).toLocaleString()}</p>
                    </div>
                  )}

                  <div className="p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/20 flex justify-between items-center">
                     <p className="text-sm font-bold text-brand-primary">Amount Paid</p>
                     <p className="text-xl font-black text-brand-primary">₹{order.paymentStatus === 'PAID' ? order.total : 0}</p>
                  </div>
               </div>
             </div>

             <div className="glass-card">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-brand-dark/20 pb-4">
                   <Clock className="w-5 h-5 text-brand-primary" /> Billing Summary
                </h2>
                <div className="space-y-4">
                   <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="font-medium text-slate-300">₹{order.subtotal}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Shipping Charges</span>
                      <span className="font-medium text-slate-300">₹{order.shipping}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Taxes (GST)</span>
                      <span className="font-medium text-slate-300">₹{order.tax}</span>
                   </div>
                   <div className="flex justify-between text-sm text-emerald-400">
                      <span>Discount</span>
                      <span className="font-medium">- ₹{order.discount || 0}</span>
                   </div>
                   
                   <div className="pt-6 mt-2 border-t border-brand-dark/20">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Total Payable</p>
                            <p className="text-3xl font-display font-black text-brand-primary">₹{order.total}</p>
                         </div>
                         <div className="text-right">
                            <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-text-secondary uppercase">All Inclusive</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Timeline */}
           <div className="glass-card">
              <h2 className="text-xl font-bold mb-8">Order Timeline</h2>
              <div className="space-y-8">
                 {order.timeline.map((step, idx) => (
                    <div key={idx} className={`relative flex gap-4 ${!step.active ? 'opacity-30' : ''}`}>
                       {idx !== order.timeline.length - 1 && (
                          <div className={`absolute left-[15px] top-8 w-0.5 h-[calc(100%+16px)] ${step.completed ? 'bg-brand-primary' : 'bg-brand-dark'}`} />
                       )}
                       <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                          step.completed 
                          ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                          : step.active ? 'bg-bg-surface border-brand-primary text-brand-primary animate-pulse' : 'bg-bg-surface border-brand-dark text-text-secondary'
                       }`}>
                          {step.completed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className={`font-bold leading-tight ${step.active ? 'text-white' : 'text-text-secondary'}`}>
                            {step.status}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                             <Clock className="w-3 h-3 text-text-secondary" />
                             <span className="text-[10px] uppercase font-bold text-text-secondary">{step.time} • {step.date}</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Customer Details */}
           <div className="glass-card overflow-hidden">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-brand-primary">
                 <User className="w-5 h-5" /> Customer Details
              </h2>
              
              <div className="space-y-6">
                 {/* Basic Info */}
                 <div className="grid grid-cols-1 gap-4 text-slate-100">
                    <div className="p-3 bg-bg-surface rounded-xl border border-brand-dark/20 text-brand-primary/80">
                      <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Customer Name</p>
                      <p className="text-sm font-bold truncate text-white">{order.customerName}</p>
                    </div>
                    <div className="p-3 bg-bg-surface rounded-xl border border-brand-dark/20">
                      <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Phone Number</p>
                      <p className="text-sm font-bold truncate text-white">{order.customerPhone || 'Not Provided'}</p>
                    </div>
                    <div className="p-3 bg-bg-surface rounded-xl border border-brand-dark/20">
                      <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-1">Email ID</p>
                      <p className="text-sm font-bold truncate text-white">{order.customerEmail || 'N/A'}</p>
                    </div>
                 </div>

                 {/* Delivery Info */}
                 <div className="pt-4 border-t border-brand-dark/20 space-y-4">
                    <h3 className="text-[10px] uppercase font-black tracking-widest text-text-secondary flex items-center gap-2">
                       <MapPin className="w-3 h-3" /> Delivery Address
                    </h3>
                    
                    <div className="space-y-3 bg-bg-surface p-4 rounded-xl border border-brand-dark/10">
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary">Full Address</p>
                          <p className="text-sm leading-relaxed">{typeof order.shippingAddress === 'object' ? order.shippingAddress.fullAddress : order.shippingAddress}</p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary">City</p>
                             <p className="text-sm font-bold">{typeof order.shippingAddress === 'object' ? order.shippingAddress.city : 'N/A'}</p>
                          </div>
                          <div>
                             <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary">State</p>
                             <p className="text-sm font-bold">{typeof order.shippingAddress === 'object' ? order.shippingAddress.state : 'N/A'}</p>
                          </div>
                          <div>
                             <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary">Pincode</p>
                             <p className="text-sm font-bold font-mono">{typeof order.shippingAddress === 'object' ? order.shippingAddress.pincode : 'N/A'}</p>
                          </div>
                          <div>
                             <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary">Country</p>
                             <p className="text-sm font-bold">{typeof order.shippingAddress === 'object' ? order.shippingAddress.country : 'N/A'}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Additional Details */}
                 <div className="pt-4 border-t border-brand-dark/20 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-bg-surface rounded-xl border border-brand-dark/20">
                       <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-3.5 h-3.5 text-brand-primary" />
                          <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary">Address Type</p>
                       </div>
                       <p className="text-sm font-bold">{typeof order.shippingAddress === 'object' ? (order.shippingAddress.addressType || 'Home') : 'Home'}</p>
                    </div>
                    <div className="p-3 bg-bg-surface rounded-xl border border-brand-dark/20">
                       <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                          <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary">Customer Type</p>
                       </div>
                       <p className="text-sm font-bold text-white">{order.customerType || (order.customerId !== 'GUEST' ? 'Registered User' : 'Guest')}</p>
                    </div>
                 </div>

                 <button 
                   onClick={() => setShowLabel(true)}
                   className="btn-secondary w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 group"
                 >
                   Print Shipping Label <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
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
                            {order.items.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-1">
                                 <p className="text-lg font-black uppercase truncate pr-4">{item.name}</p>
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
