import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import CartItem from '../../components/customer/CartItem';
import { ArrowRight, ShoppingBag, Truck, Package } from 'lucide-react';

const Cart: React.FC = () => {
  const { items, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-bg-surface rounded-full flex items-center justify-center text-brand-primary mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-text-secondary mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="btn-primary px-8 py-3">Start Shopping</Link>
        <Link to="/orders" className="mt-4 text-brand-primary font-bold hover:underline">View My Previous Orders</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-brand-primary" />
          Your Shopping Cart
        </h1>
        <Link to="/orders" className="btn-secondary flex items-center gap-2">
          <Package className="w-4 h-4 text-brand-primary" />
          My Orders History
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="space-y-6">
        <div className="glass-card sticky top-24">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal ({items.length} items)</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Shipping Fee</span>
              <span>₹49</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Tax (GST 5%)</span>
              <span>₹{Math.round(total * 0.05)}</span>
            </div>
            <div className="h-px bg-brand-dark/20 my-4" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total Price</span>
              <span className="text-brand-primary">₹{total + 49 + Math.round(total * 0.05)}</span>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-3 p-3 bg-brand-primary/10 rounded-xl text-xs text-brand-primary border border-brand-primary/20">
              <Truck className="w-5 h-5 shrink-0" />
              <span>Free delivery for orders above ₹2000!</span>
            </div>
            
            <Link to="/checkout" className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg">
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link to="/shop" className="block text-center text-sm text-text-secondary hover:text-brand-primary transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
