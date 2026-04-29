import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  LogOut, 
  Camera, 
  Edit3, 
  Plus, 
  Trash2, 
  Home, 
  Building2, 
  Settings, 
  Bell, 
  CreditCard, 
  Package, 
  TrendingUp, 
  ChevronRight,
  ChevronLeft,
  X,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { orders, products } = useData();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // personal, addresses, settings, activity
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 ',
    gender: 'Prefer not to say',
    dob: '1995-05-15'
  });

  const [addresses, setAddresses] = useState([
    { 
      id: 1, 
      type: 'Home', 
      houseStreet: '123, Green Farm Colony', 
      area: 'Adyar',
      city: 'Chennai', 
      district: 'Chennai',
      state: 'Tamil Nadu', 
      pincode: '600001', 
      isDefault: true 
    },
    { 
      id: 2, 
      type: 'Work', 
      houseStreet: 'Tech Park, 4th Floor', 
      area: 'OMR Road',
      city: 'Chennai', 
      district: 'Kanchipuram',
      state: 'Tamil Nadu', 
      pincode: '600096', 
      isDefault: false 
    }
  ]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // Order History Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Security Form States
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [notificationMsg, setNotificationMsg] = useState({ type: '', text: '' });

  const [addressFormData, setAddressFormData] = useState({
    name: user?.name || '',
    phone: '+91 ',
    houseStreet: '',
    area: '',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '',
    type: 'Home'
  });

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      setAddresses(addresses.map(addr => addr.id === editingAddress.id ? { ...addressFormData, id: addr.id, isDefault: addr.isDefault } : addr));
    } else {
      const newAddr = {
        ...addressFormData,
        id: Date.now(),
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddr]);
    }
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const openEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressFormData({
      name: addr.name || '',
      phone: addr.phone || '+91 ',
      houseStreet: addr.houseStreet || '',
      area: addr.area || '',
      city: addr.city || 'Chennai',
      district: addr.district || 'Chennai',
      state: addr.state || 'Tamil Nadu',
      pincode: addr.pincode || '',
      type: addr.type || 'Home'
    });
    setShowAddressForm(true);
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressFormData({
      name: user?.name || '',
      phone: '+91 ',
      houseStreet: '',
      area: '',
      city: 'Chennai',
      district: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '',
      type: 'Home'
    });
    setShowAddressForm(true);
  };

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    paymentAlerts: true,
    promotions: false
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserProfile({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setNotificationMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setNotificationMsg({ type: 'success', text: 'Password protocols updated successfully.' });
      setPasswords({ current: '', new: '', confirm: '' });
    }, 1000);
  };

  const sellerStats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    earnings: orders.reduce((acc, current) => acc + (current.total || 0), 0)
  };

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto pb-32 animate-in fade-in duration-700">
      {/* Back Navigation */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      {/* Profile Header */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-8 mb-8 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div 
              onClick={triggerFileInput}
              className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl relative"
            >
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
                alt="Avatar" 
                className="w-full h-full object-cover bg-bg-card"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center text-bg-main shadow-lg">
              <Check className="w-4 h-4" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
              <h1 className="text-4xl font-display font-black tracking-tight text-white">{user?.name || 'Verified User'}</h1>
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${user?.role === 'seller' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'}`}>
                {user?.role || 'Customer'}
              </span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-text-muted text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-primary/60" /> {user?.email}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/10 hidden md:block" />
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-primary/60" /> {formData.phone}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button 
              onClick={handleLogout}
              className="p-3 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-xl text-red-500 hover:text-white transition-all shadow-xl group"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-4 space-y-2">
            {[
              { id: 'personal', label: 'Personal Info', icon: User },
              ...(user?.role?.toLowerCase() !== 'seller' ? [
                { id: 'addresses', label: 'My Addresses', icon: MapPin },
                { id: 'activity', label: 'Order History', icon: Package },
              ] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  activeTab === tab.id 
                  ? 'bg-brand-primary text-bg-main font-black shadow-lg shadow-brand-primary/20' 
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'stroke-[3px]' : ''}`} />
                <span className="text-[11px] uppercase tracking-widest">{tab.label}</span>
                {activeTab === tab.id && <ChevronRight className="ml-auto w-4 h-4" />}
              </button>
            ))}
            
            <div className="pt-4 mt-2 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-black"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-[11px] uppercase tracking-widest">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'personal' && (
              <motion.div 
                key="personal"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="glass-card p-8 sm:p-12"
              >
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Personal <span className="text-brand-primary">Identification _</span></h2>
                
                <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="group space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-text-muted group-focus-within:text-brand-primary transition-colors">Full Name</label>
                      <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 group-focus-within:border-brand-primary/40 transition-all">
                        <User className="w-5 h-5 text-brand-primary/60" />
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-text-muted/30 disabled:opacity-60"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="group space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-text-muted">Email Address</label>
                      <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 opacity-60">
                        <Mail className="w-5 h-5 text-brand-primary/30" />
                        <input 
                          type="email" 
                          readOnly
                          className="w-full bg-transparent text-sm font-bold text-white outline-none cursor-not-allowed"
                          value={formData.email}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="group space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-text-muted">Contact Number</label>
                      <div className="flex items-center gap-2 p-5 bg-white/5 rounded-2xl border border-white/10 group-focus-within:border-brand-primary/40 transition-all">
                        <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
                          <span className="text-xs font-black text-brand-primary">+91</span>
                        </div>
                        <input 
                          type="text" 
                          placeholder="91234 56789"
                          disabled={!isEditing}
                          className="w-full bg-transparent text-sm font-bold text-white outline-none disabled:opacity-60"
                          value={(formData.phone || '').replace(/^\+91\s*/, '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            if (isEditing) {
                              setFormData({...formData, phone: `+91 ${val}`});
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="group space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-text-muted">Gender</label>
                        <select 
                          disabled={!isEditing}
                          className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 text-sm font-bold text-white outline-none disabled:opacity-60 appearance-none bg-transparent cursor-pointer hover:border-brand-primary/20 transition-colors"
                          value={formData.gender || ''}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        >
                          <option value="Male" className="bg-bg-main text-white">Male</option>
                          <option value="Female" className="bg-bg-main text-white">Female</option>
                          <option value="Prefer not to say" className="bg-bg-main text-white">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="group space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-text-muted">Date of Birth</label>
                        <input 
                          type="date" 
                          disabled={!isEditing}
                          className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 text-sm font-bold text-white outline-none disabled:opacity-60 appearance-none transition-colors border-white/10 focus:border-brand-primary/40 [color-scheme:dark]"
                          value={formData.dob || ''}
                          onChange={(e) => setFormData({...formData, dob: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <motion.div 
                      className="md:col-span-2 pt-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <button type="submit" className="btn-terminal w-full py-5 text-bg-main font-black uppercase tracking-widest shadow-2xl shadow-brand-primary/20">
                        Commit Core Updates
                      </button>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div 
                key="addresses"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Delivery <span className="text-brand-primary">Nodes _</span></h2>
                  <button 
                    onClick={openAddAddress}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-primary/10 hover:bg-brand-primary border border-brand-primary/20 rounded-xl text-xs font-black uppercase text-brand-primary hover:text-bg-main transition-all group"
                  >
                    <Plus className="w-4 h-4 group-rotate-90 transition-transform" /> Add New Node
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`glass-card p-8 group relative transition-all duration-500 overflow-hidden ${addr.isDefault ? 'border-brand-primary/40 bg-brand-primary/[0.03] ring-1 ring-brand-primary/20' : 'hover:border-white/20'}`}>
                      {/* Decorative Background Elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl -z-10" />
                      
                      <div className="flex items-start justify-between mb-8">
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              addr.type === 'Home' ? 'bg-blue-500/10 text-blue-400' : 
                              addr.type === 'Work' ? 'bg-purple-500/10 text-purple-400' :
                              'bg-orange-500/10 text-orange-400'
                            }`}>
                               {addr.type === 'Home' ? <Home className="w-4 h-4" /> : 
                                addr.type === 'Work' ? <Building2 className="w-4 h-4" /> : 
                                <MapPin className="w-4 h-4" />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">{addr.type} Node</span>
                         </div>
                         {addr.isDefault ? (
                           <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-md text-[8px] font-black uppercase text-brand-primary tracking-widest">
                              <Check className="w-3 h-3" /> Default Node
                           </div>
                         ) : (
                           <button 
                            onClick={() => handleSetDefault(addr.id)}
                            className="text-[8px] font-black uppercase text-text-muted hover:text-brand-primary tracking-widest transition-colors"
                           >
                             Set Default
                           </button>
                         )}
                      </div>

                      <div className="space-y-4 mb-8">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-white leading-tight">{addr.houseStreet}</p>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-tight">{addr.area}</p>
                         </div>
                         <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                               <label className="text-[8px] font-black uppercase tracking-[0.15em] text-text-muted block mb-1">City / District</label>
                               <p className="text-[10px] font-bold text-white uppercase">{addr.city}, {addr.district}</p>
                            </div>
                            <div>
                               <label className="text-[8px] font-black uppercase tracking-[0.15em] text-text-muted block mb-1">State / Pincode</label>
                               <p className="text-[10px] font-bold text-white uppercase">{addr.state} - <span className="text-brand-primary">{addr.pincode}</span></p>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-2 pt-6 border-t border-white/5">
                        <button 
                          onClick={() => openEditAddress(addr)}
                          className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase text-text-muted hover:text-white transition-all border border-white/5"
                        >
                          Edit Node
                        </button>
                        {!addr.isDefault && (
                          <button 
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-3 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/40 rounded-xl text-text-muted hover:text-red-500 transition-all group/del"
                          >
                             <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty State / Add Card */}
                  <button 
                    onClick={openAddAddress}
                    className="glass-card p-8 border-dashed border-white/10 hover:border-brand-primary/40 flex flex-col items-center justify-center text-center gap-4 group transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-text-muted group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                       <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Deploy New Node</p>
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">Register additional delivery point</p>
                    </div>
                  </button>
                </div>

                {/* Address Management Modal */}
                <AnimatePresence>
                  {showAddressForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddressForm(false)}
                        className="absolute inset-0 bg-bg-main/90 backdrop-blur-md"
                      />
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="glass-card w-full max-w-xl p-8 relative z-10 border-brand-primary/20"
                      >
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-black text-white uppercase tracking-tight">
                            {editingAddress ? 'Update' : 'Register'} <span className="text-brand-primary">Delivery Node _</span>
                          </h3>
                          <button onClick={() => setShowAddressForm(false)} className="p-2 text-text-muted hover:text-white transition-colors">
                             <X className="w-6 h-6" />
                          </button>
                        </div>

                        <form onSubmit={handleAddressSubmit} className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="group space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted group-focus-within:text-brand-primary">Full Name</label>
                                <input 
                                  required
                                  type="text"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-brand-primary/40"
                                  value={addressFormData.name || ''}
                                  onChange={(e) => setAddressFormData({...addressFormData, name: e.target.value})}
                                />
                              </div>
                              <div className="group space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted group-focus-within:text-brand-primary">Phone Number</label>
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4 focus-within:border-brand-primary/40">
                                  <span className="text-xs font-black text-brand-primary">+91</span>
                                  <input 
                                    required
                                    type="text"
                                    placeholder="91234 56789"
                                    className="w-full bg-transparent text-sm text-white outline-none"
                                    value={(addressFormData.phone || '').replace(/^\+91\s*/, '')}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                      setAddressFormData({...addressFormData, phone: `+91 ${val}`});
                                    }}
                                  />
                                </div>
                              </div>
                           </div>

                           <div className="group space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest text-text-muted group-focus-within:text-brand-primary">House / Building / Street</label>
                              <input 
                                required
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-brand-primary/40"
                                value={addressFormData.houseStreet || ''}
                                onChange={(e) => setAddressFormData({...addressFormData, houseStreet: e.target.value})}
                              />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="group space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted group-focus-within:text-brand-primary">Area / Locality</label>
                                <input 
                                  required
                                  type="text"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-brand-primary/40"
                                  value={addressFormData.area || ''}
                                  onChange={(e) => setAddressFormData({...addressFormData, area: e.target.value})}
                                />
                              </div>
                              <div className="group space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted group-focus-within:text-brand-primary">District Registry</label>
                                <input 
                                  required
                                  type="text"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-brand-primary/40"
                                  value={addressFormData.district || ''}
                                  onChange={(e) => setAddressFormData({...addressFormData, district: e.target.value})}
                                />
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="group space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted group-focus-within:text-brand-primary">City Node</label>
                                <input 
                                  required
                                  type="text"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-brand-primary/40"
                                  value={addressFormData.city || ''}
                                  onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})}
                                />
                              </div>
                              <div className="group space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted">Pincode / Zip</label>
                                <input 
                                  required
                                  type="text"
                                  maxLength={6}
                                  className="w-full bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 text-sm text-white outline-none"
                                  value={addressFormData.pincode || ''}
                                  onChange={(e) => setAddressFormData({...addressFormData, pincode: e.target.value})}
                                />
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="group space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted">State Jurisdiction</label>
                                <select 
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-brand-primary/40 appearance-none bg-transparent"
                                  value={addressFormData.state || ''}
                                  onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})}
                                >
                                  {states.map(s => <option key={s} value={s} className="bg-bg-main text-white">{s}</option>)}
                                </select>
                              </div>
                              <div className="group space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted">Node Classification</label>
                                <div className="flex gap-2">
                                  {['Home', 'Work', 'Other'].map(type => (
                                    <button 
                                      key={type}
                                      type="button"
                                      onClick={() => setAddressFormData({...addressFormData, type})}
                                      className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                                        addressFormData.type === type 
                                        ? 'bg-brand-primary border-brand-primary text-bg-main' 
                                        : 'bg-white/5 border-white/10 text-text-muted hover:border-white/30'
                                      }`}
                                    >
                                      {type}
                                    </button>
                                  ))}
                                </div>
                              </div>
                           </div>

                           <div className="pt-4 flex gap-4">
                              <button 
                                onClick={() => setShowAddressForm(false)}
                                type="button" 
                                className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-text-muted transition-all"
                              >
                                Abort
                              </button>
                              <button 
                                type="submit" 
                                className="flex-[2] py-5 bg-brand-primary hover:bg-brand-primary/90 text-bg-main rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-brand-primary/20 transition-all"
                              >
                                Commit Node Sync
                              </button>
                           </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div 
                key="activity"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                {user?.role === 'seller' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {[
                       { label: 'Yield Catalog', val: sellerStats.totalProducts, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                       { label: 'Transmission Flow', val: sellerStats.totalOrders, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                       { label: 'Total Revenue', val: `₹${sellerStats.earnings}`, icon: CreditCard, color: 'text-brand-primary', bg: 'bg-brand-primary/10' }
                     ].map((stat, i) => (
                       <div key={i} className="glass-card p-8">
                          <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                             <stat.icon className="w-6 h-6" />
                          </div>
                          <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-2">{stat.label}</p>
                          <p className="text-3xl font-black text-white tracking-tight">{stat.val}</p>
                       </div>
                     ))}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Order <span className="text-brand-primary">History _</span></h2>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Search */}
                        <div className="relative group w-full sm:w-64">
                          <input 
                            type="text" 
                            placeholder="Search Order ID..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-brand-primary/40 transition-all placeholder:text-text-muted/40"
                            value={orderSearch}
                            onChange={(e) => setOrderSearch(e.target.value)}
                          />
                          <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/40 group-focus-within:text-brand-primary/60 transition-colors" />
                        </div>

                        {/* Status Filter */}
                        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 shrink-0">
                          {['All', 'Pending', 'Delivered', 'Cancelled'].map(status => (
                            <button
                              key={status}
                              onClick={() => setOrderStatusFilter(status)}
                              className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                orderStatusFilter === status 
                                ? 'bg-brand-primary text-bg-main' 
                                : 'text-text-muted hover:text-white'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {orders
                        .filter(order => {
                          const currentUserId = user?._id || user?.id;
                          const isCustomerOfOrder = order.customerId === currentUserId;
                          const matchesSearch = String(order._id || '').toLowerCase().includes(orderSearch.toLowerCase());
                          const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
                          return isCustomerOfOrder && matchesSearch && matchesStatus;
                        }).length > 0 ? (
                        orders
                          .filter(order => {
                            const currentUserId = user?._id || user?.id;
                            const isCustomerOfOrder = order.customerId === currentUserId;
                            const matchesSearch = String(order._id || '').toLowerCase().includes(orderSearch.toLowerCase());
                            const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
                            return isCustomerOfOrder && matchesSearch && matchesStatus;
                          })
                          .sort((a, b) => new Date(b.date || Date.now()) - new Date(a.date || Date.now()))
                          .map((order) => (
                            <div key={order._id} className="glass-card p-8 group relative overflow-hidden transition-all duration-500 hover:border-brand-primary/30">
                              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-brand-primary/20 transition-colors">
                                    <Package className="w-8 h-8 text-text-muted/20" />
                                    {order.items?.[0]?.product?.image && (
                                      <img 
                                        src={order.items[0].product.image} 
                                        alt="Product" 
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-3 mb-2">
                                      <p className="text-[10px] font-black uppercase text-brand-primary tracking-widest">#{String(order._id).slice(-8)}</p>
                                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter ${
                                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-400' :
                                        order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' :
                                        'bg-blue-500/10 text-blue-400'
                                      }`}>
                                        {order.status}
                                      </span>
                                    </div>
                                    <h3 className="text-sm font-black text-white mb-1 uppercase tracking-tight">
                                      {order.items?.[0]?.product?.name || 'Bulk Crop Batch'} 
                                      {order.items?.length > 1 && <span className="text-text-muted text-xs capitalize ml-2">+{order.items.length - 1} more</span>}
                                    </h3>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                      {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • {order.paymentMethod}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-8 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0 border-white/5">
                                  <div className="text-right flex-1 lg:flex-none">
                                    <p className="text-[8px] font-black uppercase text-text-muted tracking-[0.2em] mb-1">Total Payload</p>
                                    <p className="text-xl font-black text-white uppercase tracking-tight">₹{order.total}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => navigate(`/track-order/${order._id}`)}
                                      className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase text-white transition-all border border-white/10"
                                    >
                                      Track / Info
                                    </button>
                                    {order.status === 'Delivered' && (
                                      <button className="px-6 py-3 bg-brand-primary text-bg-main rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-brand-primary/20">
                                        Reorder
                                      </button>
                                    )}
                                    {order.status === 'Pending' && (
                                      <button className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-black uppercase transition-all">
                                        Cancel Node
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-24 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">
                          <Package className="w-16 h-16 text-text-muted/10 mx-auto mb-6" />
                          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">No Transmissions Found</h3>
                          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-8">Your delivery registry is currently empty.</p>
                          <button 
                            onClick={() => navigate('/')}
                            className="px-8 py-4 bg-brand-primary text-bg-main rounded-[1.25rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-brand-primary/20 transform hover:-translate-y-1 transition-all"
                          >
                            Start Shopping Yields
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;
