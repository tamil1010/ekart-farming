import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ArrowDown, 
  ArrowUp, 
  Search, 
  Edit3, 
  Check,
  Filter,
  RefreshCw,
  AlertCircle,
  TrendingDown,
  ChevronDown,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

import { useData } from '../../context/DataContext';

// Mock Market Data Generator
const generateMarketPrice = (basePrice: number) => {
  const variation = (Math.random() - 0.5) * 0.2; // +/- 10%
  return Math.round(basePrice * (1 + variation));
};

const marketTrendData = [
  { name: 'Day 1', price: 4200 },
  { name: 'Day 2', price: 4350 },
  { name: 'Day 3', price: 4100 },
  { name: 'Day 4', price: 4400 },
  { name: 'Day 5', price: 4600 },
  { name: 'Day 6', price: 4500 },
  { name: 'Day 7', price: 4750 },
];

const SellerPricing: React.FC = () => {
  const { products, editProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'diff'>('name');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modal State
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newPrice, setNewPrice] = useState('');

  // Market data simulation - stabilized to prevent jumping on every re-render
  const marketPrices = useMemo(() => {
    return products.reduce((acc, p) => {
      // Use numeric part of ID or hash as a seed for stable "random" values
      const seed = p.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const stabilityFactor = (seed % 10) / 100; // Small stable variation
      
      acc[p.id] = {
        price: Math.round(p.price * (1 + stabilityFactor + 0.05)),
        trend: seed % 2 === 0 ? 'up' : 'down',
        demand: seed % 3 === 0 ? 'High' : (seed % 3 === 1 ? 'Stable' : 'Low'),
        change: (seed % 50) - 20,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return acc;
    }, {} as any);
  }, [products.length]); // Only re-gen if product list length changes, or use a manual refresh trigger

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleUpdatePrice = (specialPrice?: number | React.MouseEvent) => {
    const targetProduct = editingProduct;
    // Explicitly check if the argument is a number to distinguish from click events
    const numericPrice = typeof specialPrice === 'number' ? specialPrice : parseFloat(newPrice);
    
    if (!targetProduct || isNaN(numericPrice)) return;
    
    editProduct(targetProduct.id, { 
      price: numericPrice,
      lastUpdated: new Date().toISOString()
    });
    setEditingProduct(null);
    setNewPrice('');
  };

  const getSuggestedPrice = (marketPrice: number) => {
    // Suggested price is market price minus a small competitive margin (0.5%) rounded to nearest whole number
    return Math.round(marketPrice * 0.995);
  };

  const filteredProducts = products
    .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'diff') {
        const diffA = (marketPrices[a.id]?.price || 0) - a.price;
        const diffB = (marketPrices[b.id]?.price || 0) - b.price;
        return diffB - diffA;
      }
      return 0;
    });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const getPriceStatus = (sellerPrice: number, marketPrice: number) => {
    const diff = marketPrice - sellerPrice;
    if (diff > 50) return { label: 'Opportunity', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    if (diff < -50) return { label: 'High Price', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    return { label: 'Balanced', color: 'text-text-secondary', bg: 'bg-white/5', border: 'border-white/10' };
  };

  // Auto alerts logic
  const criticalAlerts = products.filter(p => {
    const market = marketPrices[p.id];
    return market && market.price - p.price < -100; // Overpriced by more than 100
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Live Pricing Intelligence</h1>
          <p className="text-text-secondary mt-1">Real-time market comparisons to maximize your profitability.</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="bg-bg-surface px-6 py-3 rounded-2xl text-white font-bold border border-brand-dark flex items-center gap-2 hover:border-brand-primary/50 transition-all active:scale-95"
        >
          <RefreshCw className={`w-5 h-5 text-brand-primary ${isRefreshing ? 'animate-spin' : ''}`} /> Update Market Data
        </button>
      </div>

      {/* Auto Alerts Banner */}
      <AnimatePresence>
        {criticalAlerts.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                     <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="font-black text-white text-sm uppercase tracking-widest">Action Required: Pricing Alerts</p>
                     <p className="text-xs text-red-400/80">
                        {criticalAlerts.length} products are significantly overpriced compared to Mandi rates. This is hurting your visibility.
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-text-secondary px-2">Critical: {criticalAlerts.map(a => a.name).join(', ')}</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Insights Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {products.slice(0, 4).map((p) => {
           const market = marketPrices[p.id];
           if (!market) return null;
           const diff = market.price - p.price;
           return (
             <motion.div 
               whileHover={{ y: -4 }}
               key={p.id} 
               className="glass-card flex flex-col justify-between"
             >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-brand-primary/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                  </div>
                  <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded ${market.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                    {market.trend === 'up' ? 'BULLISH' : 'BEARISH'}
                  </span>
                </div>
                <div>
                   <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-1 truncate">{p.name}</p>
                   <h3 className="text-3xl font-display font-black text-white">₹{market.price}</h3>
                </div>
                <div className="mt-4 pt-4 border-t border-brand-dark/20 flex justify-between items-center text-xs">
                   <span className="text-text-secondary">VS Market</span>
                   <span className={`font-bold ${diff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                     {diff > 0 ? '+' : ''}{diff} ({(diff/p.price * 100).toFixed(1)}%)
                   </span>
                </div>
             </motion.div>
           );
         })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Controls */}
          <div className="flex flex-col md:flex-row gap-4">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="input-field w-full pl-12 h-12" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex gap-2">
                <div className="relative">
                   <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary" />
                   <select 
                      className="bg-bg-surface border border-brand-dark rounded-xl px-12 h-12 text-sm font-bold appearance-none min-w-[160px] outline-none focus:border-brand-primary"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                   >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                </div>
                <select 
                   className="bg-bg-surface border border-brand-dark rounded-xl px-4 h-12 text-sm font-bold outline-none focus:border-brand-primary"
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value as any)}
                >
                   <option value="name">Sort by Name</option>
                   <option value="price">High Price</option>
                   <option value="diff">Opportunity</option>
                </select>
             </div>
          </div>

          {/* Pricing Table */}
          <div className="glass-card p-0 overflow-hidden border-brand-dark/30">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-bg-surface/50 text-text-secondary text-[10px] uppercase font-black tracking-widest">
                      <tr>
                         <th className="px-6 py-4">Product Name</th>
                         <th className="px-6 py-4">Market Price</th>
                         <th className="px-6 py-4">Seller Price</th>
                         <th className="px-6 py-4 text-center">Availability</th>
                         <th className="px-6 py-4">Suggested Price</th>
                         <th className="px-6 py-4">Difference</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-brand-dark/10">
                      {filteredProducts.map(product => {
                        const market = marketPrices[product.id];
                        if (!market) return null;
                        const suggested = getSuggestedPrice(market.price);
                        const diff = market.price - product.price;
                        const status = getPriceStatus(product.price, market.price);
                        
                        return (
                          <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                             <td className="px-6 py-5">
                                <div className="font-bold text-slate-100">{product.name}</div>
                                <div className="text-[10px] text-text-secondary italic uppercase tracking-wider">{product.category}</div>
                             </td>
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-lg">₹{market.price}</span>
                                  {market.trend === 'up' ? (
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                                <p className="text-[10px] text-text-secondary mt-1">Ref: {market.lastUpdated}</p>
                             </td>
                             <td className="px-6 py-5">
                                <span className="font-mono font-black text-lg text-brand-primary">₹{product.price}</span>
                                <p className="text-[10px] text-text-secondary mt-1 truncate">By {product.unit}</p>
                             </td>
                             <td className="px-6 py-5 text-center">
                                <div className={`text-sm font-black ${product.stock < 10 ? 'text-red-400' : 'text-slate-200'}`}>
                                   {product.stock} {product.unit.split(' ').pop()}
                                </div>
                                <div className="text-[9px] font-black uppercase tracking-widest opacity-50">In Stock</div>
                             </td>
                             <td className="px-6 py-5">
                                <span className="font-mono font-black text-lg text-emerald-500/80 italic">₹{suggested}</span>
                                <p className="text-[10px] text-emerald-500/50 mt-1 uppercase font-bold">Suggested Rate</p>
                             </td>
                             <td className="px-6 py-5 text-sm">
                                <div className={`font-mono font-bold ${diff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                   {diff > 0 ? '+' : ''}{diff}
                                </div>
                                <p className="text-[10px] text-text-secondary">{(diff/product.price * 100).toFixed(1)}%</p>
                             </td>
                             <td className="px-6 py-5">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.color} border ${status.border}`}>
                                   {status.label}
                                </span>
                             </td>
                             <td className="px-6 py-5 text-right">
                                <button 
                                  onClick={() => { setEditingProduct(product); setNewPrice(product.price.toString()); }}
                                  className="p-3 bg-bg-surface border border-brand-dark rounded-xl text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-all active:scale-95 group-hover:bg-brand-primary/10"
                                >
                                   <Edit3 className="w-4 h-4" />
                                </button>
                             </td>
                          </tr>
                        );
                      })}
                   </tbody>
                </table>
             </div>
             {filteredProducts.length === 0 && (
               <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-bg-surface rounded-full flex items-center justify-center text-text-secondary">
                     <Search className="w-8 h-8" />
                  </div>
                  <p className="text-text-secondary font-bold">No products found matching your filters.</p>
               </div>
             )}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
           {/* Price Trend Chart */}
           <div className="glass-card">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-primary" /> Market Trend
                 </h2>
                 <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-1 rounded font-black">7 DAYS</span>
              </div>
              <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketTrendData}>
                       <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="name" hide />
                       <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                       <Tooltip 
                          contentStyle={{ background: '#0f1717', border: '1px solid #1a2a26', borderRadius: '12px' }}
                          itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                       />
                       <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
              <p className="mt-4 text-xs text-text-secondary text-center italic">"Market prices are currently in an upward trajectory. Strategic inventory holding is advised."</p>
           </div>
        </div>
      </div>

      {/* Edit Price Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-bg-card w-full max-w-lg rounded-3xl overflow-hidden border border-brand-dark shadow-2xl"
            >
               <div className="p-6 border-b border-brand-dark flex justify-between items-center bg-bg-surface/30">
                 <h3 className="text-xl font-bold flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-brand-primary" /> Adjusted Pricing
                 </h3>
                 <button 
                   onClick={() => setEditingProduct(null)}
                   className="p-2 hover:bg-white/5 rounded-lg transition-all"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>

               <div className="p-8 text-white">
                 <div className="flex items-center gap-4 mb-8">
                    <img 
                      src={editingProduct.image} 
                      alt={editingProduct.name} 
                      className="w-16 h-16 rounded-2xl object-cover shrink-0" 
                    />
                    <div>
                       <p className="text-[10px] uppercase font-black tracking-widest text-brand-primary mb-1">{editingProduct.category}</p>
                       <h4 className="text-2xl font-bold">{editingProduct.name}</h4>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-bg-surface/50 rounded-2xl border border-brand-dark/20 text-center">
                       <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-2">Market Price</p>
                       <p className="text-2xl font-black text-white">₹{marketPrices[editingProduct.id]?.price || 0}</p>
                    </div>
                    <div className="p-4 bg-bg-surface/50 rounded-2xl border border-brand-dark/20 text-center relative group transition-all hover:border-emerald-500/30">
                       <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-2">Suggested</p>
                       <p className="text-2xl font-black text-emerald-500 italic">₹{getSuggestedPrice(marketPrices[editingProduct.id]?.price || 0)}</p>
                       <button 
                         onClick={() => handleUpdatePrice(getSuggestedPrice(marketPrices[editingProduct.id]?.price || 0))}
                         className="absolute -bottom-2 translate-y-full left-1/2 -translate-x-1/2 bg-emerald-500 text-bg-dark text-[8px] px-2 py-0.5 rounded font-black opacity-0 group-hover:opacity-100 transition-all uppercase whitespace-nowrap"
                       >
                         Apply Recommendation
                       </button>
                    </div>
                    <div className="p-4 bg-bg-surface/50 rounded-2xl border border-brand-dark/20 text-center">
                       <p className="text-[10px] uppercase font-black tracking-widest text-text-secondary mb-2">Current</p>
                       <p className="text-2xl font-black text-brand-primary">₹{editingProduct.price}</p>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Set New Selling Price</label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-brand-primary text-xl">₹</span>
                       <input 
                         autoFocus
                         type="number" 
                         className="input-field w-full pl-10 text-2xl font-black h-16" 
                         value={newPrice}
                         onChange={(e) => setNewPrice(e.target.value)}
                         placeholder="0.00"
                       />
                    </div>
                    <div className="flex justify-between items-center px-1">
                       <p className="text-[10px] text-text-secondary font-bold">Recommended: ₹{(marketPrices[editingProduct.id]?.price || 0) - 10} - ₹{(marketPrices[editingProduct.id]?.price || 0) + 10}</p>
                       <p className="text-[10px] text-brand-primary font-bold italic text-right">PRO TIP: End with .49 or .99</p>
                    </div>
                 </div>

                 <div className="mt-10 flex gap-4">
                    <button 
                      onClick={() => setEditingProduct(null)}
                      className="flex-1 px-6 py-4 rounded-2xl border border-brand-dark text-white font-bold hover:bg-white/5 transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpdatePrice}
                      className="flex-[2] bg-brand-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                    >
                      <Check className="w-5 h-5" /> Update Price
                    </button>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerPricing;
