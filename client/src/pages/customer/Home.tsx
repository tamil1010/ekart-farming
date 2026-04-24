import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/customer/ProductCard';
import { Product } from '../../types';
import { Search, Filter, TrendingUp, Sprout } from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Organic Basmati Rice',
    price: 120,
    unit: 'kg',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    stock: 500,
    sellerId: 's1',
    description: 'Aged long-grain aromatic rice grown in the Himalayan foothills. Naturally gluten-free and non-GMO.'
  },
  {
    id: '2',
    name: 'Fresh Alphonso Mangoes',
    price: 850,
    unit: 'dozen',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
    stock: 45,
    sellerId: 's2',
    description: 'Golden, buttery, and incredibly sweet Alphonso mangoes handpicked from Ratnagiri orchards.'
  },
  {
    id: '3',
    name: 'Premium Mustard Seeds',
    price: 45,
    unit: 'kg',
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?auto=format&fit=crop&q=80&w=800',
    stock: 1200,
    sellerId: 's1',
    description: 'High-yield mustard seeds perfect for oil extraction or traditional cooking tempering.'
  },
  {
    id: '4',
    name: 'Native Desi Cow Ghee',
    price: 950,
    unit: 'liter',
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    sellerId: 's3',
    description: 'Traditional Bilona method ghee prepared from grass-fed A2 Gir cow milk.'
  }
];

import { useData } from '../../context/DataContext';

const Home: React.FC = () => {
  const { products } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Grains', 'Fruits', 'Seeds', 'Dairy', 'Vegetables'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-3xl overflow-hidden mb-12">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Agriculture"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 text-brand-primary font-bold tracking-widest uppercase text-sm mb-4">
              <Sprout className="w-4 h-4" /> Fresh from Farm
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-none mb-6">
              Empowering <br/><span className="text-brand-primary">Digital Farmers.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg">
              The smartest marketplace for agricultural products. Connect directly with farmers and access high-quality produce.
            </p>
            <div className="flex gap-4">
              <button className="btn-primary px-8 py-4 text-lg" onClick={() => {
                document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}>Shop Now</button>
              <button className="btn-secondary bg-white/10 backdrop-blur-md text-white hover:bg-white/20 px-8 py-4 rounded-xl font-medium transition-all">Sell Produce</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between" id="product-grid">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search for crops, seeds, equipment..." 
            className="input-field w-full pl-12 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat 
                ? 'bg-brand-primary text-white' 
                : 'bg-bg-surface text-text-secondary hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-bg-card rounded-3xl border border-brand-dark/20 text-text-secondary text-lg">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default Home;
