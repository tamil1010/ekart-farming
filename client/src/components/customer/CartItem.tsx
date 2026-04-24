import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleSingleCheckout = () => {
    // Navigate to checkout with only this item in state
    navigate('/checkout', { state: { singleItem: item } });
  };

  return (
    <div className="flex gap-4 p-4 glass-card bg-bg-surface border-brand-dark/10">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-24 h-24 object-cover rounded-xl"
        referrerPolicy="no-referrer"
      />
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <button 
            onClick={() => removeFromCart(item.id)}
            className="text-text-secondary hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-text-secondary mb-2">{item.category}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 bg-bg-main rounded-lg px-2 py-1 border border-brand-dark/20">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 hover:text-brand-primary transition-colors disabled:opacity-50"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:text-brand-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xl font-bold text-brand-primary">₹{item.price * item.quantity}</span>
            <button 
              onClick={handleSingleCheckout}
              className="text-[10px] font-bold uppercase tracking-tighter text-brand-primary/60 hover:text-brand-primary border border-brand-primary/20 hover:border-brand-primary px-2 py-1 rounded-lg transition-all flex items-center gap-1 group"
            >
              <ShoppingBag className="w-3 h-3 group-hover:scale-110 transition-transform" />
              Order Separately
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
