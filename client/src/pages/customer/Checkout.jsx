import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, CreditCard, Home, Phone, User, ArrowRight, Loader2, XCircle, Mail, MapPin, ChevronLeft, Building2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
 
const Checkout = () => {
  const { items: cart, total: cartTotal, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
 
  const singleItem = location.state?.singleItem;
  const activeItems = singleItem ? [singleItem] : cart;
  const activeTotal = singleItem ? singleItem.price * singleItem.quantity : cartTotal;
 
  const [formData, setFormData] = useState({
    fullName: user?.name || 'John Doe',
    phone: '+91 9876543210',
    email: user?.email || 'customer@example.com',
    address: '123, Green Farm Colony',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    country: 'India',
    addressType: 'Home',
    otherLocationName: '',
    paymentMethod: 'COD'
  });
 
  const cityPincodeMap = {
    "Ariyalur": "621704", "Chengalpattu": "603001", "Chennai": "600001",
    "Coimbatore": "641001", "Cuddalore": "607001", "Dharmapuri": "636701",
    "Dindigul": "624001", "Erode": "638001", "Kallakurichi": "606202",
    "Kanchipuram": "631501", "Kanniyakumari": "629001", "Karur": "639001",
    "Krishnagiri": "635001", "Madurai": "625001", "Mayiladuthurai": "609001",
    "Nagapattinam": "611001", "Namakkal": "637001", "Nilgiris": "643001",
    "Perambalur": "621212", "Pudukkottai": "622001", "Ramanathapuram": "623501",
    "Ranipet": "632401", "Salem": "636001", "Sivaganga": "630561",
    "Tenkasi": "627811", "Thanjavur": "613001", "Theni": "625531",
    "Thoothukudi": "628001", "Tiruchirappalli": "620001", "Tirunelveli": "627001",
    "Tirupathur": "635601", "Tiruppur": "641601", "Tiruvallur": "602001",
    "Tiruvannamalai": "606601", "Tiruvarur": "610001", "Vellore": "632001",
    "Viluppuram": "605602", "Virudhunagar": "626001"
  };
 
  useEffect(() => {
    const newPincode = cityPincodeMap[formData.city];
    if (newPincode && newPincode !== formData.pincode) {
      setFormData(prev => ({ ...prev, pincode: newPincode }));
    }
  }, [formData.city]);
 
  const addressTypes = [
    { id: 'Home', label: 'Home Address', icon: Home },
    { id: 'Work', label: 'Office/Work', icon: Building2 },
    { id: 'Other', label: 'Other Location', icon: MapPin }
  ];
 
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '', cardNumber: '', cardHolder: '', expiry: '', cvv: '', bankName: ''
  });
 
  const grandTotal = activeTotal + 49 + Math.round(activeTotal * 0.05);
 
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
 
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
 
    setTimeout(async () => {
      const isFailed = Math.random() < 0.05;
      if (isFailed && formData.paymentMethod !== 'COD') {
        setError('Payment failed. Please try again or use a different method.');
        setIsProcessing(false);
        return;
      }
 
      const orderResult = await placeOrder({
        customerId: user?._id || user?.id,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: activeItems.map(item => ({
          product: item,
          quantity: item.quantity,
          price: item.price
        })),
        total: grandTotal,
        subtotal: activeTotal,
        shipping: 49,
        tax: Math.round(activeTotal * 0.05),
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        shippingAddress: {
          fullAddress: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          addressType: formData.addressType,
          locationName: formData.addressType === 'Other' ? formData.otherLocationName : formData.addressType
        }
      });
 
      setLastOrderId(orderResult._id);
      setIsProcessing(false);
      setIsSuccess(true);
 
      if (singleItem) {
        removeFromCart(singleItem._id);
      } else {
        clearCart();
      }
    }, 2500);
  };
 
  const [lastOrderId, setLastOrderId] = useState(null);
 
  // Reusable field wrapper — NO white borders, only subtle green-tinted dark border
  const fieldClass = "group space-y-2 bg-brand-primary/5 border border-emerald-500/40 p-5 rounded-2xl hover:border-emerald-500 focus-within:border-emerald-500 transition-all";
  const fieldClassReadOnly ="group space-y-2 bg-brand-primary/5 border border-emerald-500/30 p-5 rounded-2xl opacity-60";
 
  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-brand-primary rounded-full flex items-center justify-center text-white mb-8 shadow-lg shadow-brand-primary/20">
          <ShieldCheck className="w-14 h-14" />
        </div>
        <h2 className="text-4xl font-display font-bold mb-3">Order Successful!</h2>
        <p className="text-text-secondary max-w-md mx-auto mb-8">
          The seller has been notified and is preparing your quality products for shipment.
          {formData.paymentMethod !== 'COD' && " You will receive a transaction confirmation shortly."}
        </p>
        <button
          onClick={() => navigate(`/track-order/${lastOrderId}`)}
          className="btn-terminal flex items-center gap-3 px-8 scale-110"
        >
          Track My Order <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }
 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/cart')}
            className="p-2 hover:bg-brand-primary/10 rounded-full transition-colors text-text-muted hover:text-brand-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-display font-bold">Checkout</h1>
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
 
          {/* ── Delivery Details Card ── */}
          <div className="card-terminal space-y-8">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 border-b border-emerald-500/20 pb-4">
              <User className="w-5 h-5 text-brand-primary" /> Delivery Details
            </h2>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
              {/* Full Name */}
              <div className={fieldClass}>
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted group-focus-within:text-brand-primary">Full Name</label>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-brand-primary/60" />
                  <input
                    type="text"
                    className="input-field w-full text-sm"
                    placeholder="John Doe"
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>
 
              {/* Email */}
              <div className={fieldClass}>
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted group-focus-within:text-brand-primary">Email Address</label>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-primary/60" />
                  <input
                    type="email"
                    className="input-field w-full text-sm"
                    placeholder="john@example.com"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
 
              {/* Phone */}
              <div className={`${fieldClass} md:col-span-1`}>
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted group-focus-within:text-brand-primary">Phone Number</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
                    <span className="text-xs font-black text-brand-primary">+91</span>
                  </div>
                  <input
                    type="tel"
                    className="input-field w-full text-sm"
                    placeholder="9876543210"
                    value={(formData.phone || '').replace(/^\+91\s*/, '')}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: `+91 ${val}` });
                    }}
                    required
                  />
                </div>
              </div>
 
              {/* Address Type */}
              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Select Delivery Location Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {addressTypes.map((type) => {
                    const Icon = type.icon;
                    const isActive = formData.addressType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, addressType: type.id })}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                          isActive
                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                            : 'bg-brand-primary/5 border-emerald-500/30 text-text-secondary hover:border-emerald-500'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-brand-primary' : 'text-text-muted'}`} />
                        <span className="text-xs font-black uppercase tracking-widest">{type.label}</span>
                        {isActive && (
                          <div className="ml-auto w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-2.5 h-2.5 text-bg-main" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
 
                {formData.addressType === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group space-y-2 bg-brand-primary/5 border border-brand-primary/30 p-5 rounded-2xl focus-within:border-brand-primary/60 transition-all mt-4"
                  >
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">Specify Location Name</label>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-brand-primary/60" />
                      <input
                        type="text"
                        className="input-field w-full text-sm"
                        placeholder="e.g. Summer House, Farm Gate 2..."
                        value={formData.otherLocationName || ''}
                        onChange={(e) => setFormData({ ...formData, otherLocationName: e.target.value })}
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </div>
 
              {/* Street Address */}
              <div className={`md:col-span-2 ${fieldClass}`}>
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted group-focus-within:text-brand-primary">Street Address</label>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-brand-primary/60" />
                  <input
                    type="text"
                    className="input-field w-full text-sm"
                    placeholder="House No, Street, Area..."
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
              </div>
 
              {/* City / State / Pincode / Country row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-2">
 
                {/* City dropdown */}
                <div className={fieldClass}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted group-focus-within:text-brand-primary">City</label>
                  <select
                    className="input-field w-full text-sm cursor-pointer"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  >
                    {Object.keys(cityPincodeMap).map(city => (
                      <option key={city} value={city} className="bg-bg-main">{city}</option>
                    ))}
                  </select>
                </div>
 
                {/* State — read only */}
                <div className={fieldClassReadOnly}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">State</label>
                  <input
                    type="text"
                    className="input-field w-full text-sm"
                    value="Tamil Nadu"
                    readOnly
                  />
                </div>
 
                {/* Pincode — auto-filled */}
                <div className={fieldClassReadOnly}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Pincode</label>
                  <input
                    type="text"
                    className="input-field w-full text-sm"
                    value={formData.pincode || ''}
                    readOnly
                    required
                  />
                </div>
 
                {/* Country — read only */}
                <div className={fieldClassReadOnly}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Country</label>
                  <input
                    type="text"
                    className="input-field w-full text-sm"
                    value="India"
                    readOnly
                  />
                </div>
              </div>
 
            </div>
          </div>
 
          {/* ── Payment Method Card ── */}
          <div className="card-terminal space-y-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 border-b border-emerald-500/20 pb-4">
              <CreditCard className="w-5 h-5 text-brand-primary" /> Payment Method
            </h2>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['COD', 'UPI', 'Card', 'Net Banking'].map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                    formData.paymentMethod === method
                      ? 'border-brand-primary bg-brand-primary/10'
                      : 'border-emerald-500/30 bg-brand-primary/5 hover:border-brand-primary/30 text-text-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === method}
                    onChange={() => setFormData({ ...formData, paymentMethod: method })}
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
                  className="p-6 bg-bg-surface rounded-2xl border border-emerald-500/30 space-y-4 overflow-hidden"
                >
                  <h3 className="font-bold text-sm">UPI Payment Details</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Enter UPI ID</label>
                    <input
                      type="text"
                      placeholder="username@bank"
                      className="input-field w-full font-bold"
                      value={paymentDetails.upiId || ''}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
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
                  className="p-6 bg-bg-surface rounded-2xl border border-emerald-500/30 space-y-4 overflow-hidden"
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
                        value={paymentDetails.cardNumber || ''}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value.replace(/\D/g, '') })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="input-field w-full font-bold"
                          value={paymentDetails.expiry || ''}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="***"
                          className="input-field w-full font-bold"
                          value={paymentDetails.cvv || ''}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value.replace(/\D/g, '') })}
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
                  className="p-6 bg-bg-surface rounded-2xl border border-emerald-500/30 space-y-4 overflow-hidden"
                >
                  <h3 className="font-bold text-sm mb-2">Select Bank</h3>
                  <select
                    className="input-field w-full cursor-pointer font-bold"
                    value={paymentDetails.bankName || ''}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, bankName: e.target.value })}
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
            className={`btn-terminal w-full py-5 text-sm font-black flex items-center justify-center gap-3 transition-transform active:scale-95 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isProcessing ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> {formData.paymentMethod === 'COD' ? 'Placing Order...' : 'Processing Payment...'}</>
            ) : (
              formData.paymentMethod === 'COD' ? 'Confirm and Place Order' : `Pay ₹${grandTotal} Now`
            )}
          </button>
        </form>
      </div>
 
      {/* ── Order Summary ── */}
      <div className="lg:col-span-1">
        <div className="card-terminal sticky top-24">
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2 border-b border-emerald-500/20 pb-4">
            Order Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted font-bold uppercase text-[10px] tracking-wider">Subtotal ({activeItems.length} {activeItems.length === 1 ? 'item' : 'items'})</span>
              <span className="font-bold text-text-primary">₹{activeTotal}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted font-bold uppercase text-[10px] tracking-wider">Shipping & Handling</span>
              <span className="font-bold text-text-primary">₹49</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted font-bold uppercase text-[10px] tracking-wider">Tax (5%)</span>
              <span className="font-bold text-text-primary">₹{Math.round(activeTotal * 0.05)}</span>
            </div>
            <div className="pt-6 mt-4 border-t border-emerald-500/20">
              <div className="flex justify-between items-center text-2xl font-black text-brand-primary">
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
 