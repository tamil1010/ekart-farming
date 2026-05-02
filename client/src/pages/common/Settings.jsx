import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Lock,
  Bell,
  Shield,
  Eye,
  Globe,
  Monitor,
  Trash2,
  LogOut,
  ChevronRight,
  Smartphone,
  CreditCard,
  User,
  Mail,
  Smartphone as Phone,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [notifications, setNotifications] = useState({
    orders: true,
    payments: true,
    promotions: false,
    security: true
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('ekart-theme') || 'organic');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ekart-theme', theme);
  }, [theme]);
  const [isDeleting, setIsDeleting] = useState(false);

  const sections = [
    { id: 'account', label: 'Identity Matrix', icon: User },
    { id: 'security', label: 'Vault Access', icon: Lock },
    { id: 'notifications', label: 'Neural Alerts', icon: Bell },
    { id: 'privacy', label: 'Stealth Mode', icon: Eye },
  ];

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Terminal <span className="text-brand-primary">Settings _</span></h1>
        <p className="text-text-secondary mt-1 font-medium italic">Configure your instance parameters and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           {sections.map((section) => (
             <button
               key={section.id}
               onClick={() => setActiveSection(section.id)}
               className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                 activeSection === section.id 
                 ? 'bg-brand-primary text-bg-main border-brand-primary shadow-lg shadow-brand-primary/20' 
                 : 'bg-white/[0.03] text-text-secondary border-white/5 hover:bg-white/[0.06]'
               }`}
             >
                <div className="flex items-center gap-3">
                   <section.icon className="w-5 h-5 flex-shrink-0" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{section.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === section.id ? 'rotate-90' : ''}`} />
             </button>
           ))}

           <div className="pt-8 space-y-4">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                 <LogOut className="w-5 h-5" /> Terminate Session
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
           <AnimatePresence mode="wait">
             {activeSection === 'account' && (
               <motion.div 
                 key="account"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <div className="glass-card p-8">
                     <h2 className="text-lg font-black text-white uppercase tracking-tight mb-8">Base Identification</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Display Name</label>
                           <input type="text" defaultValue={user?.name} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Email Node</label>
                           <input type="email" defaultValue={user?.email} disabled className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-text-muted outline-none cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Mobile Sync</label>
                           <input type="text" placeholder="+91 XXXX XXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Entity Role</label>
                           <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-black text-brand-primary uppercase tracking-widest">
                             {user?.role}
                           </div>
                        </div>
                     </div>
                     <div className="mt-10 flex justify-end">
                        <button className="btn-terminal px-10 py-4">Save Parameters</button>
                     </div>
                  </div>
               </motion.div>
             )}

             {activeSection === 'security' && (
               <motion.div 
                 key="security"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <div className="glass-card p-8">
                     <h2 className="text-lg font-black text-white uppercase tracking-tight mb-8">Access Protocols</h2>
                     <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Current Access Key</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">New Access Key</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all" />
                           </div>
                        </div>
                        <div className="p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-3xl flex items-start gap-4">
                           <Shield className="w-6 h-6 text-brand-primary mt-1" />
                           <div>
                              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Two-Factor Authentication</h4>
                              <p className="text-[10px] text-text-secondary font-medium leading-relaxed">Add an extra layer of security to your account with hardware or mobile verification codes.</p>
                              <button className="mt-4 text-[10px] font-black text-brand-primary uppercase tracking-widest border-b border-brand-primary pb-0.5">Enable Protocol</button>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="glass-card p-8">
                     <h2 className="text-sm font-black text-white uppercase tracking-widest italic mb-6">Recent Logins _</h2>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                           <div className="flex items-center gap-4">
                              <Monitor className="w-5 h-5 text-text-muted" />
                              <div>
                                 <div className="text-[10px] font-black text-white uppercase">MacOS / Chrome</div>
                                 <div className="text-[9px] text-text-muted font-bold tracking-widest mt-0.5">Mumbai, India • April 29, 2026</div>
                              </div>
                           </div>
                           <span className="text-[9px] font-black text-emerald-500 uppercase px-2 py-1 bg-emerald-500/10 rounded-lg">Active Now</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                           <div className="flex items-center gap-4">
                              <Smartphone className="w-5 h-5 text-text-muted" />
                              <div>
                                 <div className="text-[10px] font-black text-white uppercase">iPhone 15 / App</div>
                                 <div className="text-[9px] text-text-muted font-bold tracking-widest mt-0.5">Pune, India • April 28, 2026</div>
                              </div>
                           </div>
                           <button className="text-[9px] font-black text-red-500 uppercase hover:underline">Revoke Access</button>
                        </div>
                     </div>
                  </div>
               </motion.div>
             )}

             {activeSection === 'notifications' && (
               <motion.div 
                 key="notifications"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <div className="glass-card p-8">
                     <h2 className="text-lg font-black text-white uppercase tracking-tight mb-8">Neural Signal Matrix</h2>
                     <div className="space-y-6">
                        {[
                           { key: 'orders', label: 'Order Updates', desc: 'Sync when items are scanned, shipped or finalized.' },
                           { key: 'payments', label: 'Financial Settlements', desc: 'Confirmations for revenue transfers and withdrawals.' },
                           { key: 'promotions', label: 'Intelligence Sync', desc: 'Marketing insights and regional demand projections.' },
                           { key: 'security', label: 'Shield Alerts', desc: 'Protocol breaches or unfamiliar login attempts.' }
                        ].map((item) => (
                           <div key={item.key} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                              <div className="max-w-md">
                                 <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.label}</h4>
                                 <p className="text-[10px] text-text-muted font-medium mt-1">{item.desc}</p>
                              </div>
                              <button 
                                 onClick={() => handleToggle(item.key)}
                                 className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${notifications[item.key] ? 'bg-brand-primary' : 'bg-white/10'}`}
                              >
                                 <div className={`w-4 h-4 rounded-full bg-bg-main transition-transform duration-300 ${notifications[item.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               </motion.div>
             )}

             {activeSection === 'app' && (
               <motion.div 
                 key="app"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <div className="glass-card p-8">
                     <h2 className="text-lg font-black text-white uppercase tracking-tight mb-8">Environmental Params</h2>
                     <div className="space-y-10">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Interface Skin</label>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                              {['Organic', 'Light', 'Dark', 'Cyber', 'Ocean', 'Sunset'].map((t) => (
                                 <button 
                                    key={t}
                                    onClick={() => setTheme(t.toLowerCase())}
                                    className={`relative p-6 rounded-3xl border-2 transition-all ${theme === t.toLowerCase() ? 'border-brand-primary bg-brand-primary/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}
                                 >
                                    <div className="text-[10px] font-black text-white uppercase tracking-widest">{t}</div>
                                    {theme === t.toLowerCase() && (
                                       <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-bg-main shadow-lg">
                                          <Check className="w-4 h-4" />
                                       </div>
                                    )}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Default Dialect</label>
                           <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 appearance-none">
                              <option className="bg-bg-main">English (Global)</option>
                              <option className="bg-bg-main">Hindi (Regional)</option>
                              <option className="bg-bg-main">Marathi (Local)</option>
                           </select>
                        </div>
                     </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Danger Zone */}
           <div className="glass-card p-8 border-red-500/20 bg-red-500/[0.01]">
              <div className="flex items-center gap-3 mb-6">
                 <AlertTriangle className="w-5 h-5 text-red-500" />
                 <h2 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] italic">Catastrophic Zone _</h2>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="max-w-md">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Erase Entity Matrix</h4>
                    <p className="text-[10px] text-text-muted font-medium leading-relaxed">Permanently delete your account, items, and neural history. This operation is irreversible and cannot be recovered.</p>
                 </div>
                 <button 
                  onClick={() => setIsDeleting(true)}
                  className="px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                 >
                    <Trash2 className="w-4 h-4" /> Delete Identity
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg-main/80 backdrop-blur-md">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="glass-card max-w-sm w-full p-8 text-center border-red-500/20"
            >
               <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                  <AlertTriangle className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Final Protocol?</h3>
               <p className="text-xs text-text-secondary font-bold leading-relaxed mb-8">Type <span className="text-red-500">ERASE</span> to confirm permanent identity removal.</p>
               <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center text-sm font-black text-red-500 outline-none focus:border-red-500/40 mb-6 uppercase" placeholder="Confirmation Key" />
               <div className="flex gap-4">
                  <button onClick={() => setIsDeleting(false)} className="flex-1 px-4 py-3 bg-white/5 text-white rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/5">Abort</button>
                  <button className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20">Execute</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
