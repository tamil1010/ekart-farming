import React from 'react';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-bg-card border border-white/5 rounded-[2rem] overflow-hidden group hover:border-brand-primary/40 hover:shadow-2xl transition-all duration-500"
    >
      <div className="flex flex-col md:flex-row items-center gap-12 p-8 md:p-12">
        {/* Image Section */}
        <Link 
          to={`/product/${product._id || product.id}`} 
          className="w-full md:w-[300px] h-[300px] rounded-2xl overflow-hidden shrink-0 border border-white/5 group-hover:border-brand-primary/30 transition-all duration-500 shadow-xl"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Content Section */}
        <div className="flex-1 space-y-4 text-center md:text-left min-w-0">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[9px] font-black text-brand-primary uppercase tracking-[0.2em]">
               {product.category}
            </span>
            <div className="flex items-center gap-1 text-brand-primary">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-[10px] font-black">4.8</span>
            </div>
          </div>

          <div>
            <Link to={`/product/${product._id || product.id}`}>
              <h3 className="font-black text-4xl md:text-5xl text-white tracking-tighter group-hover:text-brand-primary transition-colors mb-2">
                {product.name}
              </h3>
            </Link>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest leading-relaxed opacity-60">
              {product.description || "Premium regional agricultural yield."}
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 py-2 border-t border-white/5">
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Source</span>
                <span className="text-[10px] font-black text-white uppercase truncate">{product.sellerName || 'Verified'}</span>
             </div>
             <div className="h-6 w-px bg-white/10" />
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Unit</span>
                <span className="text-[10px] font-black text-white uppercase">{product.unit || 'KG'}</span>
             </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-col items-center md:items-end justify-center gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 min-w-[160px]">
          <div className="text-center md:text-right">
            <span className="text-[9px] text-brand-primary/60 uppercase tracking-[0.3em] font-black mb-1 block">Valuation</span>
            <span className="text-4xl font-black text-white tracking-tighter">₹{product.price}</span>
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="w-full md:w-auto bg-brand-primary hover:bg-brand-secondary text-bg-main font-black px-8 py-3 rounded-xl text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3"
          >
            Order Now
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};


export default ProductCard;
