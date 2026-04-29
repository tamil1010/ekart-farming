import React from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { Link } from 'react-router-dom';
import CartItem from '../../components/customer/CartItem.jsx';
import { ArrowRight, ShoppingBag, Truck, Package, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-bg-surface rounded-full flex items-center justify-center text-brand-primary mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-text-secondary mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="btn-terminal px-8 py-3">Start Shopping</Link>
        <Link to="/orders" className="mt-4 text-brand-primary font-bold hover:underline">View My Previous Orders</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-brand-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Shopping Cart</h1>
            <p className="text-text-secondary text-sm mt-1">Review your selected agricultural items before checkout.</p>
          </div>
        </div>
        <Link to="/orders" className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-white transition-all">
          <Package className="w-4 h-4" />
          Order History
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
            {items.map((item, idx) => (
              <CartItem key={item._id || item.id || idx} item={item} />
            ))}
        </div>

        <div className="space-y-6">
          <div className="bg-bg-card border border-white/5 rounded-2xl p-8 sticky top-32">
            <h2 className="text-lg font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal ({items.length} items)</span>
                <span className="text-white font-medium">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Shipping Est.</span>
                <span className="text-white font-medium">₹49</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Tax (GST 5%)</span>
                <span className="text-white font-medium">₹{Math.round(total * 0.05).toLocaleString('en-IN')}</span>
              </div>
              <div className="h-px bg-white/5 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-text-secondary">Order Total</span>
                <span className="text-2xl font-bold text-brand-primary tracking-tight">₹{(total + 49 + Math.round(total * 0.05)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3 p-4 bg-brand-primary/5 rounded-xl text-[11px] text-brand-primary border border-brand-primary/10 font-medium">
                <Truck className="w-4 h-4 shrink-0" />
                <span>Eligible for prioritized regional delivery</span>
              </div>
              
              <Link to="/checkout" className="w-full bg-brand-primary hover:bg-brand-secondary text-bg-main font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link to="/shop" className="block text-center text-xs font-bold text-text-muted hover:text-white transition-all uppercase tracking-widest mt-4">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
