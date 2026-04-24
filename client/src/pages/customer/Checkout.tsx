import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, CreditCard, Home, Phone, User, ArrowRight, Loader2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Checkout: React.FC = () => {
  const { items: cart, total: cartTotal, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we are ordering a single item separately
  const singleItem = location.state?.singleItem;
  const activeItems = singleItem ? [singleItem] : cart;
  const activeTotal = singleItem ? singleItem.price * singleItem.quantity : cartTotal;

  const [formData, setFormData] = useState({
    fullName: user?.name || 'John Doe',
    phone: '+91 9876543210',
    email: user?.email || 'customer@example.com',
    address: '123, Green Farm Colony',
    city: 'Ludhiana',
    state: 'Punjab',
    pincode: '140001',
    country: 'India',
    addressType: 'Home' as 'Home' | 'Work',
    paymentMethod: 'COD' as 'COD' | 'UPI' | 'Card' | 'Net Banking'
  });

  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    bankName: ''
  });

  const grandTotal = activeTotal + 49 + Math.round(activeTotal * 0.05);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    // Validate inputs based on payment method
    if (formData.paymentMethod === 'UPI' && !paymentDetails.upiId) {
      setError('Please enter a valid UPI ID');
      setIsProcessing(false);
      return;
    }
    if (formData.paymentMethod === 'Card' && (paymentDetails.cardNumber.length < 16 || !paymentDetails.cvv)) {
      setError('Please enter valid card details');
      setIsProcessing(false);
      return;
    }
    if (formData.paymentMethod === 'Net Banking' && !paymentDetails.bankName) {
      setError('Please select a bank');
      setIsProcessing(false);
      return;
    }

    // Simulate Payment Gateway Interaction
    setTimeout(() => {
      // Simulate random failure for testing (5% chance)
      const isFailed = Math.random() < 0.05;
      
      if (isFailed && formData.paymentMethod !== 'COD') {
        setError('Payment failed. Please try again or use a different method.');
        setIsProcessing(false);
        return;
      }

      placeOrder({
        userId: user?.id,
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        items: activeItems,
        total: grandTotal,
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          fullAddress: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          addressType: formData.addressType
        }
      });

      setIsProcessing(false);
      setIsSuccess(true);
      
      if (singleItem) {
        removeFromCart(singleItem.id);
      } else {
        clearCart();
      }
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-brand-primary rounded-full flex items-center justify-center text-white mb-8 shadow-lg shadow-brand-primary/20">
          <ShieldCheck className="w-14 h-14" />
        </div>
        <h2 className="text-4xl font-display font-bold mb-3">Order Successful!</h2>
        <p className="text-text-secondary max-w-md mx-auto mb-8">
          The seller has been notified and is preparing your fresh farm products for harvest. 
          {formData.paymentMethod !== 'COD' && " You will receive a transaction confirmation shortly."}
        </p>
        <button 
          onClick={() => navigate('/orders')}
          className="btn-primary flex items-center gap-2 px-8"
        >
          Track My Order <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold">Checkout</h1>
          <button onClick={() => navigate('/cart')} className="text-brand-primary font-bold text-sm flex items-center gap-2 hover:underline">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Cart
          </button>
        </div>
        
        <form onSubmit={handlePlaceOrder} className="space-y-8">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 flex items-center gap-3 font-medium"
              >
                <XCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass-card space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-brand-dark/20 pb-4">
              <User className="w-5 h-5 text-brand-primary" /> Delivery Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-text-secondary">Full Name</label>
                <input 
                  type="text" 
                  className="input-field w-full" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-text-secondary">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input 
                    type="tel" 
                    className="input-field w-full pl-12" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-text-secondary">Email Address</label>
                <input 
                  type="email" 
                  className="input-field w-full" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-text-secondary">Address Type</label>
                <select 
                  className="input-field w-full" 
                  value={formData.addressType}
                  onChange={(e) => setFormData({...formData, addressType: e.target.value as 'Home' | 'Work'})}
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-text-secondary">Street Address (House No, Street, Area)</label>
                <div className="relative">
                  <Home className="absolute left-4 top-4 w-4 h-4 text-text-secondary" />
                  <textarea 
                    className="input-field w-full pl-12 h-20 pt-3 resize-none" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-text-secondary">City / Region Checklist</label>
                <select 
                  className="input-field w-full cursor-pointer" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required 
                >
                  <option value="">Select City</option>
                  <option value="Ludhiana">Ludhiana</option>
                  <option value="Amritsar">Amritsar</option>
                  <option value="Patiala">Patiala</option>
                  <option value="Jalandhar">Jalandhar</option>
                  <option value="Bathinda">Bathinda</option>
                  <option value="Karnal">Karnal</option>
                  <option value="Chandigarh">Chandigarh</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-text-secondary">State Checklist</label>
                <select 
                  className="input-field w-full cursor-pointer" 
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  required 
                >
                  <option value="">Select State</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-text-secondary">Pincode</label>
                <input 
                  type="text" 
                  className="input-field w-full" 
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-text-secondary">Country Checklist</label>
                <select 
                  className="input-field w-full cursor-pointer" 
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  required 
                >
                  <option value="India">India</option>
                  <option value="Global Export">Global Export</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-brand-dark/20 pb-4">
              <CreditCard className="w-5 h-5 text-brand-primary" /> Payment Selection
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['COD', 'UPI', 'Card', 'Net Banking'].map((method) => (
                <label 
                  key={method}
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                    formData.paymentMethod === method ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-dark hover:border-brand-primary/30'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={formData.paymentMethod === method}
                    onChange={() => setFormData({...formData, paymentMethod: method as any})}
                    className="accent-brand-primary w-5 h-5" 
                  />
                  <div className="flex-1">
                    <p className="font-bold">{method === 'COD' ? 'Cash on Delivery' : method}</p>
                    <p className="text-xs text-text-secondary">
                      {method === 'COD' ? 'Pay at doorstep' : 'Fast & Secure'}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Dynamic Payment Forms */}
            <AnimatePresence mode="wait">
              {formData.paymentMethod === 'UPI' && (
                <motion.div 
                  key="upi"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 bg-bg-surface rounded-2xl border border-brand-dark space-y-4 overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm">UPI Payment Details</h3>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Enter UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="username@bank"
                      className="input-field w-full font-bold"
                      value={paymentDetails.upiId}
                      onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                    />
                  </div>
                </motion.div>
              )}

              {formData.paymentMethod === 'Card' && (
                <motion.div 
                  key="card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 bg-bg-surface rounded-2xl border border-brand-dark space-y-4 overflow-hidden"
                >
                  <h3 className="font-bold text-sm mb-2">Card Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Card Number</label>
                      <input 
                        type="text" 
                        maxLength={16}
                        placeholder="0000 0000 0000 0000"
                        className="input-field w-full font-mono text-lg font-bold"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value.replace(/\D/g, '')})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Expiry (MM/YY)</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="input-field w-full font-bold"
                          value={paymentDetails.expiry}
                          onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">CVV</label>
                        <input 
                          type="password" 
                          maxLength={3}
                          placeholder="***"
                          className="input-field w-full font-bold"
                          value={paymentDetails.cvv}
                          onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value.replace(/\D/g, '')})}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {formData.paymentMethod === 'Net Banking' && (
                <motion.div 
                  key="netbanking"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 bg-bg-surface rounded-2xl border border-brand-dark space-y-4 overflow-hidden"
                >
                  <h3 className="font-bold text-sm mb-2">Select Bank</h3>
                  <select 
                    className="input-field w-full cursor-pointer font-bold"
                    value={paymentDetails.bankName}
                    onChange={(e) => setPaymentDetails({...paymentDetails, bankName: e.target.value})}
                  >
                    <option value="">Choose your bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="Axis">Axis Bank</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            type="submit" 
            disabled={isProcessing}
            className={`btn-primary w-full py-5 text-lg font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isProcessing ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> {formData.paymentMethod === 'COD' ? 'Placing Order...' : 'Processing Payment...'}</>
            ) : (
              formData.paymentMethod === 'COD' ? 'Confirm and Place Order' : `Pay ₹${grandTotal} Now`
            )}
          </button>
        </form>
      </div>

      <div className="lg:col-span-1">
        <div className="glass-card sticky top-24 border-brand-primary/20">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-brand-dark/20 pb-4">
             Billing Summary
          </h2>
          <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                 <span className="text-text-secondary font-bold uppercase text-[10px] tracking-widest text-[rgb(120,120,120)]">Subtotal ({activeItems.length} {activeItems.length === 1 ? 'item' : 'items'})</span>
                 <span className="font-bold">₹{activeTotal}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-text-secondary font-bold uppercase text-[10px] tracking-widest text-[rgb(120,120,120)]">Shipping & Handling</span>
                 <span className="font-bold">₹49</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-text-secondary font-bold uppercase text-[10px] tracking-widest text-[rgb(120,120,120)]">Tax (5%)</span>
                 <span className="font-bold">₹{Math.round(activeTotal * 0.05)}</span>
              </div>
              <div className="pt-6 mt-4 border-t border-brand-dark/20">
                 <div className="flex justify-between items-center text-2xl font-display font-black text-brand-primary">
                    <span>Total Cost</span>
                    <span>₹{grandTotal}</span>
                 </div>
              </div>
          </div>
          
          <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
             <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-text-secondary leading-relaxed">
               Your payment is secured with bank-grade encryption. We never store your CVV or sensitive banking passwords.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
