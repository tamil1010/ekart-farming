import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Trash2, 
  Edit2, 
  Plus, 
  Search, 
  Tag, 
  Database,
  Filter,
  X,
  Upload,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const Marketplace = () => {
  const { user } = useAuth();
  const { orders, products, addProduct, editProduct, deleteProduct, claimInitialProducts, updateStock } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('latest');
  const [viewMode, setViewMode] = useState('table');
  const [inlineStock, setInlineStock] = useState({});

  const currentUserId = user?._id || user?.id;
  const sellerProducts = products.filter(p => p.sellerId === currentUserId);

  const handleInlineStockUpdate = (id) => {
    const newStock = inlineStock[id];
    if (newStock !== undefined) {
      updateStock(id, newStock);
      setInlineStock(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleOpenViewModal = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fruits',
    price: '',
    unit: 'kg',
    stock: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400'
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || 'Fruits',
        price: (editingProduct.price || 0).toString(),
        unit: editingProduct.unit || 'kg',
        stock: (editingProduct.stock || 0).toString(),
        description: editingProduct.description || '',
        image: editingProduct.image || ''
      });
      setIsModalOpen(true);
    } else {
      setFormData({
        name: '',
        category: 'Fruits',
        price: '',
        unit: 'kg',
        stock: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400'
      });
    }
  }, [editingProduct]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    if (editingProduct) {
      editProduct(editingProduct._id, productData);
    } else {
      addProduct({ ...productData, sellerId: user?._id || user?.id });
    }
    handleCloseModal();
  };

  const handleDelete = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Direct deletion for now to bypass potential window.confirm issues in preview
    deleteProduct(id);
    if (selectedProduct?._id === id) {
      setIsViewModalOpen(false);
    }
  };

  const filteredProducts = sellerProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStock = stockFilter === 'All' || 
                        (stockFilter === 'Low Stock' && p.stock > 0 && p.stock <= 10) || 
                        (stockFilter === 'Out of Stock' && p.stock === 0);
    return matchesSearch && matchesCategory && matchesStock;
  }).sort((a, b) => {
    if (sortOrder === 'price-high') return b.price - a.price;
    if (sortOrder === 'price-low') return a.price - b.price;
    if (sortOrder === 'name') return a.name.localeCompare(b.name);
    return 0; // fallback to default
  });

  const getStatus = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'Active';
  };

  const getMarketPrice = (category) => {
    const marketRates = {
      'Fruits': 1.15,
      'Vegetables': 1.25,
      'Grains': 0.95,
      'Dairy': 1.10,
      'Seeds': 1.05
    };
    return marketRates[category] || 1.1;
  };

  const calculateProductSold = (productId) => {
    return orders.reduce((acc, order) => {
      const item = order.items?.find(i => (i.product?._id || i.productId) === productId);
      return acc + (item?.quantity || 0);
    }, 0);
  };

  const handleClaim = () => {
    claimInitialProducts(user?._id || user?.id, user?.name);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-sans font-black tracking-tighter text-white">Store <span className="text-brand-primary">Inventory</span></h1>
          <p className="text-text-secondary mt-2 font-medium">Manage your premium agricultural yields and live listings.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
             className="flex-1 sm:flex-none border border-white/10 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
          >
            Bulk Upload
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-none btn-terminal flex items-center justify-center gap-3 px-8 text-bg-main"
          >
            <Plus className="w-5 h-5" /> Add New Yield
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card flex flex-col items-center justify-center text-center p-8 group">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-4xl font-sans font-black text-white mb-2">{sellerProducts.filter(p => p.stock > 0).length}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Active Listings</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center text-center p-8 group">
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
            <Database className="w-8 h-8" />
          </div>
          <h3 className="text-4xl font-sans font-black text-white mb-2">{sellerProducts.filter(p => p.stock > 0 && p.stock <= 10).length}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Critical Stock</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center text-center p-8 group">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
            <X className="w-8 h-8" />
          </div>
          <h3 className="text-4xl font-sans font-black text-white mb-2">{sellerProducts.filter(p => p.stock === 0).length}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Depleted Stock</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search my inventory..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-brand-primary/40 outline-none transition-all placeholder:text-text-muted text-text-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <select 
                className="flex-1 md:flex-none bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-text-secondary rounded-xl px-4 py-3 outline-none focus:border-brand-primary/40"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains</option>
                <option value="Seeds">Seeds</option>
                <option value="Dairy">Dairy</option>
              </select>
              <select 
                className="flex-1 md:flex-none bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-text-secondary rounded-xl px-4 py-3 outline-none focus:border-brand-primary/40"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="All">All Stock Levels</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <select 
                className="flex-1 md:flex-none bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-text-secondary rounded-xl px-4 py-3 outline-none focus:border-brand-primary/40"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
             <button 
               onClick={() => setViewMode('table')}
               className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-brand-primary text-bg-main shadow-lg' : 'text-text-muted hover:text-white'}`}
             >
                Table View
             </button>
             <button 
               onClick={() => setViewMode('grid')}
               className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-brand-primary text-bg-main shadow-lg' : 'text-text-muted hover:text-white'}`}
             >
                Grid View
             </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="glass-card py-20 text-center">
            <Package className="w-16 h-16 text-white/5 mx-auto mb-4" />
            <p className="text-text-secondary font-medium mb-8">No results found matching your current filters.</p>
            {sellerProducts.length === 0 && (
              <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl max-w-sm">
                  <p className="text-xs text-text-muted leading-relaxed">
                    Inventory node currently uninitialized. For evaluation purposes, you can link the initial agricultural yields to your terminal to test management protocols.
                  </p>
                </div>
                <button 
                  onClick={handleClaim}
                  className="btn-terminal px-8 py-4 text-xs bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary hover:text-bg-main"
                >
                  Link Demo Inventory Node
                </button>
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product._id || product.id} 
                className="bg-bg-card border border-white/5 rounded-[1.5rem] overflow-hidden group flex flex-col h-full relative hover:border-brand-primary/40 hover:shadow-2xl transition-all duration-300"
              >
                <div 
                  className="relative aspect-[4/3] overflow-hidden block border-b border-white/5 cursor-pointer"
                  onClick={() => handleOpenViewModal(product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-90 group-hover:brightness-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-brand-primary/90 text-bg-main text-[9px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md">
                    {product.category}
                  </div>
                  <div className={`absolute top-4 right-4 text-[9px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md ${
                    getStatus(product.stock) === 'Active' ? 'bg-emerald-500 text-white' : 
                    getStatus(product.stock) === 'Low Stock' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {product.stock} {product.unit}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="font-bold text-lg tracking-tight line-clamp-1 group-hover:text-brand-primary transition-all duration-300 text-text-primary capitalize">{product.name}</h3>
                  </div>
                  
                  <p className="text-text-secondary text-xs line-clamp-2 mb-6 flex-1">
                    {product.description || "Premium quality agricultural product managed in your inventory."}
                  </p>
                  
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col p-3 bg-white/[0.03] rounded-xl border border-white/5">
                        <span className="text-[9px] uppercase font-bold text-text-muted tracking-widest leading-none mb-1">Your Price</span>
                        <span className="text-xl font-black text-brand-primary tracking-tight">₹{product.price}</span>
                      </div>
                      <div className="flex flex-col p-3 bg-white/[0.03] rounded-xl border border-white/5">
                        <span className="text-[9px] uppercase font-bold text-text-muted tracking-widest leading-none mb-1">Market Avg</span>
                        <span className="text-xl font-black text-white/40 tracking-tight">₹{Math.round(product.price * getMarketPrice(product.category))}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                       <span>Yield Sold: <span className="text-white">{calculateProductSold(product._id || product.id)} {product.unit}</span></span>
                       <span>Revenue: <span className="text-emerald-500">₹{calculateProductSold(product._id || product.id) * product.price}</span></span>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 bg-white/5 border border-white/10 hover:border-brand-primary/40 text-brand-primary py-3 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id || product.id)}
                        className="p-3 bg-red-500/5 border border-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Product Node</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Price Node</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Inventory Depth</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Market Sync</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id || product.id} className="border-b border-white/5 hover:bg-white/[0.02] group transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={product.image} className="w-10 h-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all border border-white/5" alt="" />
                          <div>
                            <div className="text-xs font-black text-white uppercase tracking-tight">{product.name}</div>
                            <div className="text-[9px] text-text-muted font-bold uppercase mt-0.5 italic">#{String(product._id || product.id).slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                            {product.category}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-white">₹{product.price}</div>
                        <div className="text-[9px] text-text-muted uppercase font-bold tracking-widest">per {product.unit}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <input 
                              type="number" 
                              className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-black outline-none focus:border-brand-primary/40"
                              value={inlineStock[product._id || product.id] ?? product.stock}
                              onChange={(e) => setInlineStock(prev => ({ ...prev, [product._id || product.id]: e.target.value }))}
                           />
                           {inlineStock[product._id || product.id] !== undefined && (
                             <button 
                                onClick={() => handleInlineStockUpdate(product._id || product.id)}
                                className="p-1.5 bg-brand-primary text-bg-main rounded-lg hover:scale-105 transition-transform"
                             >
                                <Check className="w-3 h-3" />
                             </button>
                           )}
                           <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                              getStatus(product.stock) === 'Active' ? 'text-emerald-500 bg-emerald-500/10' : 
                              getStatus(product.stock) === 'Low Stock' ? 'text-orange-500 bg-orange-500/10' : 'text-red-500 bg-red-500/10'
                           }`}>
                              {getStatus(product.stock)}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           <div className={`h-1.5 w-1.5 rounded-full ${Math.abs(1 - getMarketPrice(product.category)) < 0.1 ? 'bg-emerald-400' : 'bg-amber-400 opacity-50'}`} />
                           <div className="text-[10px] font-black text-text-muted uppercase tracking-widest italic">
                              {getMarketPrice(product.category) > 1.1 ? 'Suboptimal' : 'Balanced'}
                           </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                              onClick={() => setEditingProduct(product)}
                              className="p-2 bg-white/5 border border-white/5 rounded-lg text-brand-primary hover:bg-brand-primary hover:text-bg-main transition-all"
                           >
                              <Edit2 className="w-3 h-3" />
                           </button>
                           <button 
                              onClick={() => handleDelete(product._id || product.id)}
                              className="p-2 bg-red-500/5 border border-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                           >
                              <Trash2 className="w-3 h-3" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-2xl bg-bg-card border border-brand-dark rounded-3xl p-8 overflow-y-auto max-h-[90vh]"
             >
                 <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                     {editingProduct ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                   </div>
                   <h2 className="text-2xl font-display font-bold">
                     {editingProduct ? 'Edit Product' : 'List New Product'}
                   </h2>
                 </div>
                 <button onClick={handleCloseModal} className="p-2 bg-bg-surface rounded-full text-text-secondary hover:text-white transition-colors">
                   <X className="w-6 h-6" />
                 </button>
               </div>
 
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-text-secondary">Product Name</label>
                     <input 
                        type="text" 
                        className="input-field w-full" 
                        placeholder="e.g. Alphonso Mangoes" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-text-secondary">Category</label>
                     <select 
                        className="input-field w-full"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                     >
                       <option>Fruits</option>
                       <option>Vegetables</option>
                       <option>Grains</option>
                       <option>Seeds</option>
                       <option>Dairy</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-text-secondary">Price (₹)</label>
                     <div className="flex gap-2">
                       <input 
                          type="number" 
                          className="input-field flex-1" 
                          placeholder="00.00" 
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          required
                       />
                       <select 
                          className="input-field w-24"
                          value={formData.unit}
                          onChange={(e) => setFormData({...formData, unit: e.target.value})}
                       >
                         <option>kg</option>
                         <option>dozen</option>
                         <option>liter</option>
                         <option>5kg</option>
                         <option>quintal</option>
                       </select>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-text-secondary">Inventory Stock</label>
                     <input 
                        type="number" 
                        className="input-field w-full" 
                        placeholder="500" 
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        required
                     />
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-text-secondary">Description</label>
                   <textarea 
                      className="input-field w-full h-24 pt-3 resize-none" 
                      placeholder="Detail your products, quality standards, and store information..." 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                 </div>
 
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-text-secondary">Product Image URL</label>
                     <input 
                        type="url" 
                        className="input-field w-full" 
                        placeholder="Paste image link here..." 
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                     />
                   </div>
                   <div className="border-2 border-dashed border-white/5 bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center text-text-secondary">
                     {formData.image ? (
                        <div className="relative w-full flex flex-col items-center">
                          <img src={formData.image} alt="Preview" className="w-full aspect-video object-cover rounded-xl border border-white/10" />
                          <div className="flex items-center gap-2 text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20 mt-4">
                            <Check className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Linked</span>
                          </div>
                        </div>
                     ) : (
                        <div className="py-8 flex flex-col items-center">
                          <Upload className="w-8 h-8 mb-2 opacity-50" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Link</p>
                        </div>
                     )}
                   </div>
                 </div>
 
                 <div className="flex gap-4 pt-4">
                   <button type="button" onClick={handleCloseModal} className="flex-1 bg-bg-surface py-4 rounded-xl font-bold text-text-secondary hover:text-white transition-colors">
                     Cancel
                   </button>
                   <button type="submit" className="flex-1 btn-primary py-4 text-lg">
                     {editingProduct ? 'Update Listing' : 'Confirm Listing'}
                   </button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Product Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-bg-card border border-brand-dark rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={selectedProduct.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">{selectedProduct.name}</h2>
                    <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      {selectedProduct.category}
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="p-2 bg-bg-surface rounded-full text-text-secondary hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Description</h3>
                  <div className="p-4 bg-bg-surface rounded-2xl border border-brand-dark/20 min-h-[100px]">
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {selectedProduct.description || "No description provided for this product."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-surface rounded-2xl border border-brand-dark/20">
                    <h4 className="text-[10px] font-bold uppercase text-text-secondary mb-1">Pricing</h4>
                    <p className="text-xl font-bold text-brand-primary">₹{selectedProduct.price}<span className="text-xs text-text-secondary">/{selectedProduct.unit}</span></p>
                  </div>
                  <div className="p-4 bg-bg-surface rounded-2xl border border-brand-dark/20">
                    <h4 className="text-[10px] font-bold uppercase text-text-secondary mb-1">Current Stock</h4>
                    <p className="text-xl font-bold text-white">{selectedProduct.stock} <span className="text-xs text-text-secondary">{selectedProduct.unit}</span></p>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-dark/20 flex gap-4">
                  <button 
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setEditingProduct(selectedProduct);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary py-3 rounded-xl hover:bg-brand-primary hover:text-white transition-all font-bold"
                  >
                    <Edit2 className="w-4 h-4" /> Edit Listing
                  </button>
                  <button 
                    onClick={(e) => handleDelete(selectedProduct._id, e)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-400/10 border border-red-400/20 text-red-400 py-3 rounded-xl hover:bg-red-400 hover:text-white transition-all font-bold"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Listing
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

export default Marketplace;
