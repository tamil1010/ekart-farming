import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { 
  Minus, 
  Plus, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Star,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useData();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Product Not Found</h2>
        <p className="text-text-secondary mb-8">The product you are looking for has been moved or harvested.</p>
        <button onClick={() => navigate('/shop')} className="btn-primary">Return to Shop</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/cart');
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors mb-8 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-[2rem] overflow-hidden bg-bg-surface border border-brand-dark/10"
        >
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
             <span className="bg-brand-primary/90 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                {product.category}
             </span>
             {product.stock <= 10 && product.stock > 0 && (
               <span className="bg-orange-500/90 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Low Stock
               </span>
             )}
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center space-y-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-text-secondary uppercase">4.9 (120+ Farmers' Choice)</span>
            </div>
            
            <h1 className="text-5xl font-display font-black leading-tight mb-4">{product.name}</h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-lg">
              {product.description || "Directly from the farm to your doorstep. Fresh, high-quality, and ethically sourced agricultural produce."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-end gap-3 text-brand-primary">
              <span className="text-5xl font-display font-black leading-none">₹{product.price}</span>
              <span className="text-lg text-text-secondary font-medium mb-1">per {product.unit || 'unit'}</span>
            </div>

            <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
              product.stock > 10 ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 
              product.stock > 0 ? 'bg-orange-500/5 border-orange-500/20 text-orange-400' : 'bg-red-500/5 border-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'
              }`} />
              <p className="text-sm font-bold uppercase tracking-widest">
                {product.stock > 10 ? 'In Stock & Harvesting' : product.stock > 0 ? `Only ${product.stock} units available` : 'Out of Harvest / Stock'}
              </p>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="p-1 bg-bg-surface rounded-2xl border border-brand-dark/10 flex items-center overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-brand-dark/20 transition-colors rounded-xl"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-display font-bold text-xl">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-brand-dark/20 transition-colors rounded-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-4 text-lg font-bold flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20"
                >
                  <ShoppingBag className="w-6 h-6" /> Add to Cart
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-brand-dark/10">
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-brand-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary leading-tight">100% Quality Guaranteed</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-6 h-6 text-brand-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary leading-tight">Next-Day Farm Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="w-6 h-6 text-brand-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary leading-tight">7-Day Return Policy</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
