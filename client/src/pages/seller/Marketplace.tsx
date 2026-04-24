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
import { motion, AnimatePresence } from 'motion/react';

import { useData } from '../../context/DataContext';

const Marketplace: React.FC = () => {
  const { products, addProduct, editProduct, deleteProduct } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  // ... (keeping existing useEffect and handlers)

  const handleOpenViewModal = (product: any) => {
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
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price.toString(),
        unit: editingProduct.unit,
        stock: editingProduct.stock.toString(),
        description: editingProduct.description || '',
        image: editingProduct.image
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      sellerId: 's1' // Simulation
    };

    if (editingProduct) {
      editProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Direct deletion for now to bypass potential window.confirm issues in preview
    deleteProduct(id);
    if (selectedProduct?.id === id) {
      setIsViewModalOpen(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStock = stockFilter === 'All' || 
                        (stockFilter === 'Low Stock' && p.stock > 0 && p.stock <= 10) || 
                        (stockFilter === 'Out of Stock' && p.stock === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStatus = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'Active';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Marketplace Inventory</h1>
          <p className="text-text-secondary mt-1">Manage, update, and track your agricultural listings.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={handleOpenAddModal}
            className="btn-primary flex items-center gap-2 flex-1 md:flex-none justify-center px-6"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">Active Listings</p>
              <h3 className="text-2xl font-display font-bold">{products.filter(p => p.stock > 0).length}</h3>
            </div>
          </div>
        </div>
        <div className="glass-card bg-orange-500/5 border-orange-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">Low Stock Items</p>
              <h3 className="text-2xl font-display font-bold">{products.filter(p => p.stock > 0 && p.stock <= 10).length}</h3>
            </div>
          </div>
        </div>
        <div className="glass-card bg-red-500/5 border-red-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
              <X className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">Out of Stock</p>
              <h3 className="text-2xl font-display font-bold">{products.filter(p => p.stock === 0).length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="p-6 border-b border-brand-dark/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search my items..." 
                className="input-field w-full pl-10 text-sm py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-bg-surface border border-brand-dark text-sm text-text-secondary rounded-xl px-4 py-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Grains">Grains</option>
              <option value="Seeds">Seeds</option>
              <option value="Dairy">Dairy</option>
              <option value="Fruits">Fruits</option>
            </select>
            <select 
              className="bg-bg-surface border border-brand-dark text-sm text-text-secondary rounded-xl px-4 py-2"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="All">All Stock Levels</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-surface/50 text-text-secondary text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Image</th>
                <th className="px-6 py-4 font-bold">Product Details</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold text-center">Stock</th>
                <th className="px-6 py-4 font-bold">Price Point</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/10">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-bg-surface/30 transition-colors group">
                  <td className="px-6 py-5">
                    <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-bg-surface border border-brand-dark/20" referrerPolicy="no-referrer" />
                  </td>
                   <td 
                    className="px-6 py-5 cursor-pointer"
                    onClick={() => handleOpenViewModal(product)}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold group-hover:text-brand-primary transition-colors underline decoration-brand-primary/0 group-hover:decoration-brand-primary/50 underline-offset-4">{product.name}</span>
                      <span className="text-[10px] text-text-secondary mt-1 opacity-0 group-hover:opacity-100 transition-opacity italic">Click to view details</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-text-secondary">{product.category}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`font-mono font-bold ${product.stock <= 10 ? 'text-orange-500' : 'text-slate-300'}`}>
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-brand-primary">₹{product.price}</span>
                    <span className="text-[10px] text-text-secondary ml-1">/{product.unit}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      getStatus(product.stock) === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 
                      getStatus(product.stock) === 'Low Stock' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {getStatus(product.stock)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                     <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm font-bold flex items-center gap-2 group/edit"
                          title="Edit Listing"
                        >
                          <Edit2 className="w-4 h-4 group-hover/edit:scale-110 transition-transform" />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={(e) => handleDelete(product.id, e)}
                          className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm font-bold flex items-center gap-2 group/del"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                          <span>Delete</span>
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                      placeholder="Detail your farming process, organic certifications, and quality..." 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                 </div>
 
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-text-secondary">Product Images</label>
                   <div className="border-2 border-dashed border-brand-dark rounded-2xl p-8 flex flex-col items-center justify-center text-text-secondary hover:border-brand-primary/50 transition-colors cursor-pointer group">
                     {formData.image ? (
                        <div className="relative">
                          <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-xl" />
                          <p className="text-[10px] mt-2 text-center text-brand-primary">Image URL linked</p>
                        </div>
                     ) : (
                        <>
                          <Upload className="w-10 h-10 mb-2 group-hover:text-brand-primary transition-colors" />
                          <p className="text-sm">Drag & drop images or <span className="text-brand-primary">browse</span></p>
                        </>
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
                    <p className="text-sm leading-relaxed text-slate-300">
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
                    onClick={(e) => handleDelete(selectedProduct.id, e)}
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
