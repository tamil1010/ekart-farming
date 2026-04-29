import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useData } from '../../context/DataContext.jsx';
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
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useData();
  const [quantity, setQuantity] = useState(1);

  // 3D Tilt state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const product = products.find(p => (p._id || p.id) === id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Product Not Found</h2>
        <p className="text-text-secondary mb-8">The product you are looking for has been moved or is currently unavailable.</p>
        <button onClick={() => navigate('/shop')} className="btn-terminal px-8">Return to Shop</button>
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
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-3 text-text-muted hover:text-brand-primary transition-all mb-10 group bg-white/5 px-6 py-3 rounded-2xl border border-white/5"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Inventory</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image Section */}
        <div 
          className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/5 group shadow-2xl"
        >
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div 
            className="absolute top-8 left-8 flex flex-col gap-3"
          >
             <span className="bg-black/60 backdrop-blur-md text-brand-primary px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-brand-primary/30 shadow-xl">
                {product.category}
             </span>
             {product.stock <= 10 && product.stock > 0 && (
               <span className="bg-orange-500/90 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                  Low Stock
               </span>
             )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center space-y-10">
          <div className="bg-bg-card border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-brand-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">4.9 Node Rating</span>
            </div>
            
            <h1 className="text-6xl font-display font-black leading-[0.9] mb-8 terminal-heading text-white italic uppercase">{product.name}</h1>
            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-text-muted leading-relaxed font-medium">
                {product.description || "Experimental prototype with advanced architectural design and verified node authentication. Optimized for high-frequency commerce operations."}
              </p>
            </div>

            <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 mt-6">
               <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-xs border border-brand-primary/20">
                 {product.sellerName ? product.sellerName.split(' ').map(n => n[0]).join('') : 'F'}
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1">Authenticated Seller</p>
                  <h4 className="text-lg font-bold text-white leading-none">{product.sellerName || 'Verified Agricultural Node'}</h4>
               </div>
               <div className="ml-auto">
                 <div className="px-3 py-1 bg-brand-primary/5 rounded-full border border-brand-primary/20 text-[8px] font-black text-brand-primary uppercase tracking-widest">
                   Verified
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-end gap-4 text-brand-primary">
              <span className="text-6xl font-display font-black leading-none">₹{product.price}</span>
              <span className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-black mb-2 opacity-60">Price Alpha Unit</span>
            </div>

            <div className={`p-6 rounded-[1.5rem] flex items-center gap-4 border ${
              product.stock > 10 ? 'bg-brand-primary/5 border-brand-primary/20 text-brand-primary' : 
              product.stock > 0 ? 'bg-orange-500/5 border-orange-500/20 text-orange-400' : 'bg-red-500/5 border-red-500/20 text-red-400'
            }`}>
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                product.stock > 10 ? 'bg-brand-primary' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'
              } shadow-[0_0_10px_currentColor]`} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                {product.stock > 10 ? 'System Inventory Ready' : product.stock > 0 ? `${product.stock} units in node queue` : 'Node Depleted'}
              </p>
            </div>
          </div>

          {product.stock > 0 ? (
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row items-center gap-8 bg-bg-card border border-white/5 p-6 rounded-3xl shadow-lg">
                <div className="p-1.5 bg-white/5 rounded-2xl border border-white/10 flex items-center overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 hover:bg-white/5 text-text-muted hover:text-brand-primary transition-all rounded-xl"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center font-display font-black text-2xl text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-4 hover:bg-white/5 text-text-muted hover:text-brand-primary transition-all rounded-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button 
                   onClick={handleAddToCart}
                   className="btn-terminal flex-1 py-5 text-sm font-black flex items-center justify-center gap-4 shadow-xl scale-105"
                 >
                   <ShoppingBag className="w-6 h-6" /> Deploy to Cart
                 </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/5">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted leading-tight">Node Integrity <br/>Verified</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted leading-tight">High-Freq <br/>Logistics</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted leading-tight">Recursive <br/>Protocol</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 text-center">
              <h3 className="text-xl font-bold text-red-500 mb-2">Out of Stock</h3>
              <p className="text-text-secondary">This item is currently unavailable. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
