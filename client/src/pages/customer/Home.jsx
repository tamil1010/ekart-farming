import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/customer/ProductCard.jsx';
import { Search } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useSpring } from 'framer-motion';

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

  // Hero 3D Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rawRotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rawRotateY = useTransform(mouseX, [-300, 300], [-8, 8]);
  
  const heroRotateX = useSpring(rawRotateX, { stiffness: 80, damping: 20 });
  const heroRotateY = useSpring(rawRotateY, { stiffness: 80, damping: 20 });

  const textX = useTransform(mouseX, [-300, 300], [-20, 20]);
  const textY = useTransform(mouseY, [-300, 300], [-20, 20]); 

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
    <div className="space-y-12 perspective-[1200px]">
      {/* Hero Section */}
      <motion.section
  onMouseMove={handleHeroMouseMove}
  onMouseLeave={handleHeroMouseLeave}
  style={{ rotateX: heroRotateX, rotateY: heroRotateY }}
  className="relative h-[600px] rounded-[2rem] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 transform-gpu [transform-style:preserve-3d]"
>
        <div className="w-full h-full relative">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105 brightness-[0.70] contrast-125 saturate-110 [transform:translateZ(-50px)]"
          >
            <source src="/farming.mp4" type="video/mp4" />
            
          </video>
          {/* Quote Overlay */}
          <div className="absolute top-0 left-0 z-10 p-10 md:p-16">
          <motion.div
            style={{ x: textX, y: textY }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="max-w-md"
          >
            <h2 className="text-white text-3xl md:text-4xl font-black leading-tight">
              From Soil to Soul,
              <br />
              <span className="text-brand-primary">We Grow Trust.</span>
            </h2>

            <p className="text-white/70 mt-3 text-xs tracking-wide">
              Pure produce. Honest farmers. Stronger tomorrow.
            </p>
          </motion.div>
        </div>
          
          
        </div>
      </motion.section>

      {/* Grid Display */}
      <div id="product-grid" className="grid grid-cols-1 gap-8 max-w-6xl mx-auto">
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
