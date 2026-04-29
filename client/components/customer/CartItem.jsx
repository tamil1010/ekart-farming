import React from 'react';
import { Minus, Plus, Trash2, Send } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleOrderSeparately = () => {
    // Navigate to checkout for this specific item
    navigate('/checkout', { state: { singleItem: item } });
  };

  return (
    <div className="bg-bg-card border border-white/5 rounded-3xl flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-24 h-24 bg-white/5 rounded-2xl overflow-hidden shrink-0 border border-white/5">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
          <div>
            <h3 className="text-lg font-bold text-white">{item.name}</h3>
            <p className="text-xs text-text-secondary uppercase tracking-widest">{item.category}</p>
          </div>
          <p className="text-xl font-bold text-brand-primary">₹{item.price}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
              className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
              className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={handleOrderSeparately}
              className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary text-xs font-black uppercase tracking-widest transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Order Separately
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button 
              onClick={() => removeFromCart(item._id || item.id)}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 text-xs font-black uppercase tracking-widest transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
