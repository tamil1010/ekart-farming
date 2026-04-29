import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/customer/ProductCard.jsx';
import { Search, Filter, TrendingUp, Sprout, ShoppingCart } from 'lucide-react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { products } = useData();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (user?.role === 'SELLER') {
      navigate('/seller/dashboard', { replace: true });
    } else if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleOrderNow = () => {
    const tomato = products.find(p => p.name === 'Fresh Farm Tomatoes');
    if (tomato) {
      addToCart(tomato);
    }
  };

  // Hero 3D Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const heroRotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const heroRotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Equipment', 'Organic'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] rounded-[2rem] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
      >
        <div className="w-full h-full relative">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[20000ms] ease-out brightness-50 contrast-125"
          >
            <source src="https://player.vimeo.com/external/369324546.sd.mp4?s=6955a16d860d5b5b9c5123d5162a04870f7e4d8e&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
          
          {/* Scanline / HUD Effect */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
          
          <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/60 to-transparent flex flex-col justify-center px-12 md:px-20 z-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl space-y-10"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex items-center gap-4"
              >
                <div className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary bg-brand-primary/10 pl-5 pr-7 py-3 rounded-full border border-brand-primary/30 backdrop-blur-xl">
                  <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-ping" />
                  Live Farm Feed // Zone A-01
                </div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-8xl md:text-[11rem] font-sans font-black text-white leading-[0.75] tracking-tighter mb-4"
              >
                Fresh <br/>
                <span className="text-brand-primary drop-shadow-[0_0_50px_rgba(16,185,129,0.5)] inline-block">Harvest</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-xl text-text-secondary max-w-lg leading-relaxed font-black uppercase tracking-[0.25em] text-[10px] opacity-60 border-l-2 border-brand-primary/40 pl-6"
              >
                Decentralized agricultural intelligence. Access verified organic yield clusters across sustainable regional grids.
              </motion.p>

              <div className="flex gap-8 pt-6">
                <button 
                  onClick={() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-terminal scale-110 shadow-xl"
                >
                  Shop Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fresh Spotlight - Tomato Focus */}
      <section className="bg-bg-card border border-white/5 rounded-[2rem] overflow-hidden p-8 md:p-12 relative group">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sprout className="w-40 h-40 text-brand-primary" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
          <div 
            onClick={() => {
              const tomato = products.find(p => p.name === 'Fresh Farm Tomatoes');
              if (tomato) navigate(`/product/${tomato._id}`);
            }}
            className="w-full md:w-[300px] h-[300px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-brand-primary/40 transition-all duration-500 cursor-pointer shrink-0"
          >
             <img 
              src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800" 
              alt="Fresh Tomatoes" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
              referrerPolicy="no-referrer"
             />
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
               Direct from Farm
            </div>
            <h2 
              onClick={() => {
                const tomato = products.find(p => p.name === 'Fresh Farm Tomatoes');
                if (tomato) navigate(`/product/${tomato._id}`);
              }}
              className="text-5xl font-black text-white tracking-tighter cursor-pointer hover:text-brand-primary transition-colors"
            >
              Organic <span className="text-brand-primary">Red Tomatoes</span>
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xl font-medium">
              Harvested at peak ripeness, our tomatoes are grown without synthetic pesticides. Experience the rich, earthy flavor of true farm-fresh produce delivered directly to your node.
            </p>
            <div className="flex items-center gap-6 pt-4">
               <div>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Unit Weight</span>
                  <span className="text-xl font-bold text-white tracking-tight">1.0 KG</span>
               </div>
               <div className="h-10 w-px bg-white/10" />
               <div>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Price Point</span>
                  <span className="text-xl font-bold text-brand-primary tracking-tight">₹40.00</span>
               </div>
               <button 
                onClick={handleOrderNow}
                className="ml-auto bg-brand-primary hover:bg-brand-secondary text-bg-main font-black px-10 py-4 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-brand-primary/20 flex items-center gap-2"
               >
                  Order Now
                  <ShoppingCart className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Display */}
      <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto">
        {filteredProducts.map((product, idx) => (
          <motion.div
            key={product._id || product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-bg-card rounded-[2rem] border border-white/5 text-text-secondary text-lg shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <Search className="w-12 h-12 text-brand-primary/20" />
            <p>No products found matching your criteria.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
