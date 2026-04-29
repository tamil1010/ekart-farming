import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Send,
  Upload,
  ArrowRight,
  Package,
  ShoppingCart,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketStatus, setTicketStatus] = useState('idle'); // idle, success
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedTicketId, setExpandedTicketId] = useState(null);
  
  // Form State
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    type: 'Order',
    description: '',
    orderId: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  const faqs = [
    {
      question: "How to place an order?",
      answer: "Browse the marketplace, select your preferred produce, add to cart, and proceed to checkout using our secure payment gateway."
    },
    {
      question: "How to track my order?",
      answer: "Go to 'My Orders' in your profile section or click on the track icon in your order confirmation email to see real-time delivery status."
    },
    {
      question: "How to cancel order?",
      answer: "Orders can be cancelled within 2 hours of placement or until they are dispatched. Go to 'Order Details' to find the cancellation option."
    },
    {
      question: "Payment issues?",
      answer: "If your payment failed but amount was deducted, it is usually refunded within 3-5 business days. Contact support with your transaction ID for assistance."
    },
    {
      question: "Seller registration?",
      answer: "To become a seller, register your account and select 'Seller' as your role. Complete the KYC and farm verification process to start listing your yields."
    }
  ];

  const [tickets, setTickets] = useState([
    { id: 'TKT-9921', subject: 'Delayed Delivery', type: 'Delivery', status: 'In Progress', date: '2026-04-25', description: 'My order #ORD-1234 has not arrived yet despite the expected date being yesterday.' },
    { id: 'TKT-9804', subject: 'Payment Failed', type: 'Payment', status: 'Resolved', date: '2026-04-20', description: 'The payment was deducted from my account but the order remains pending.' },
  ]);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTicket = {
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: ticketForm.subject,
        type: ticketForm.type,
        status: 'Open',
        date: new Date().toISOString().split('T')[0],
        description: ticketForm.description
      };
      
      setTickets([newTicket, ...tickets]);
      setIsSubmitting(false);
      setTicketStatus('success');
      setTicketForm({ subject: '', type: 'Order', description: '', orderId: '' });
      setPreviewImage(null);
      
      setTimeout(() => setTicketStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Support <span className="text-brand-primary">Terminal _</span></h1>
          <p className="text-text-secondary mt-1 font-medium italic">Advanced resolution hub and neural help network.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 w-full lg:w-auto">
           <div className="relative w-full lg:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search Knowledge Base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-10 pr-4 py-3 text-xs font-black uppercase tracking-widest text-white outline-none"
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Channels & FAQs */}
        <div className="lg:col-span-1 space-y-8">
          {/* Support Channels */}
          <div className="glass-card p-8 space-y-6">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic mb-6">Neural Channels _</h2>
            <div className="space-y-4">
               {[
                 { id: 'email', label: 'Email Support', detail: 'support@ekartfarming.com', icon: Mail, color: 'text-brand-primary', bg: 'bg-brand-primary/10', action: 'Send Mail' },
                 { id: 'phone', label: 'Phone Ops', detail: '+91 1800-EKART-FARM', icon: Phone, color: 'text-blue-500', bg: 'bg-blue-500/10', action: 'Call Now' },
                 { id: 'chat', label: 'Live Chat', detail: 'Operational (24/7)', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10', action: 'Initialize Chat' }
               ].map(channel => (
                 <div key={channel.id} className="space-y-3">
                   <button 
                     onClick={() => setSelectedChannel(selectedChannel === channel.id ? null : channel.id)}
                     className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${selectedChannel === channel.id ? 'bg-white/10 border-brand-primary scale-[1.02]' : 'bg-white/[0.03] border-white/5 hover:border-white/10'}`}
                   >
                      <div className={`w-10 h-10 rounded-xl ${channel.bg} flex items-center justify-center ${channel.color}`}>
                         <channel.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{channel.label}</div>
                        <div className="text-xs font-bold text-text-secondary">{channel.detail}</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${selectedChannel === channel.id ? 'rotate-180' : ''}`} />
                   </button>
                   
                   <AnimatePresence>
                     {selectedChannel === channel.id && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="px-4 overflow-hidden"
                       >
                         <div className="bg-bg-surface p-4 rounded-xl border border-white/5 space-y-3">
                            <p className="text-[10px] font-medium text-text-secondary italic">Our priority response team is ready to assist via this channel.</p>
                            <button className="w-full btn-terminal py-2 text-[10px] uppercase tracking-widest">{channel.action}</button>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
               ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="glass-card p-8">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic mb-8">Base Intel _</h2>
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => (
                <div key={idx} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="flex justify-between items-center w-full text-left group"
                  >
                    <span className="text-xs font-black text-white uppercase tracking-tight group-hover:text-brand-primary transition-colors">{faq.question}</span>
                    {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-brand-primary" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-xs text-text-secondary leading-relaxed font-medium">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )) : (
                <div className="text-center py-4 italic text-[10px] text-text-muted">No matching intel records found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Form & Archives */}
        <div className="lg:col-span-2 space-y-8">
           {/* Raise Ticket Form */}
           <div className="glass-card p-8 bg-brand-primary/[0.02]">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-full border-2 border-brand-primary flex items-center justify-center text-brand-primary font-black italic">
                    RT
                 </div>
                 <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Raise Support Ticket _</h2>
                    <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Protocol-based issue reporting</p>
                 </div>
              </div>

              <form onSubmit={handleSubmitTicket} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Subject Matter</label>
                    <input 
                       required
                       type="text" 
                       value={ticketForm.subject}
                       onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                       placeholder="Brief issue title" 
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Issue Node</label>
                    <select 
                       required
                       value={ticketForm.type}
                       onChange={(e) => setTicketForm({...ticketForm, type: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all appearance-none"
                    >
                       <option className="bg-bg-main" value="Order">Order Retrieval</option>
                       <option className="bg-bg-main" value="Payment">Payment Settlement</option>
                       <option className="bg-bg-main" value="Delivery">Logistics Node</option>
                       <option className="bg-bg-main" value="Account">Identity Matrix</option>
                    </select>
                 </div>
                 
                 <AnimatePresence>
                   {ticketForm.type === 'Order' && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       className="md:col-span-2 space-y-2"
                     >
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Order ID Access Key</label>
                        <input 
                           type="text" 
                           value={ticketForm.orderId}
                           onChange={(e) => setTicketForm({...ticketForm, orderId: e.target.value})}
                           placeholder="ORD-XXXXXX" 
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all"
                        />
                     </motion.div>
                   )}
                 </AnimatePresence>

                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Transmission Payload (Description)</label>
                    <textarea 
                       required
                       rows="4" 
                       value={ticketForm.description}
                       onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                       placeholder="Describe the anomaly in detail..." 
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all resize-none"
                    ></textarea>
                 </div>
                 <div className="md:col-span-2">
                    <div className="relative border-2 border-dashed border-white/10 rounded-3xl p-8 text-center group hover:border-brand-primary/40 transition-all cursor-pointer">
                       <input 
                         type="file" 
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                         onChange={handleFileChange}
                         accept="image/*"
                       />
                       {previewImage ? (
                          <div className="relative inline-block">
                             <img src={previewImage} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-white/20" />
                             <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-bg-main">
                                <Check className="w-3 h-3" />
                             </div>
                          </div>
                       ) : (
                          <>
                             <Upload className="w-8 h-8 text-text-muted group-hover:text-brand-primary transition-all mx-auto mb-4" />
                             <div className="text-[10px] font-black text-white uppercase tracking-widest">Upload Visual Evidence</div>
                             <p className="text-[9px] text-text-muted mt-2 uppercase font-black">Support formats: JPG, PNG, PDF (Max 5MB)</p>
                          </>
                       )}
                    </div>
                 </div>
                 <div className="md:col-span-2">
                    <button 
                       disabled={isSubmitting}
                       className="w-full btn-terminal py-5 text-bg-main text-sm font-black uppercase tracking-[0.2em] relative overflow-hidden group"
                    >
                       <span className="relative z-10">
                          {isSubmitting ? 'Transmitting Data...' : ticketStatus === 'success' ? 'Protocol Success' : 'Initialize Support Protocol'}
                          {ticketStatus === 'success' && <CheckCircle className="inline ml-2 w-5 h-5" />}
                       </span>
                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                 </div>
              </form>
           </div>

           {/* Ticket History */}
           <div className="glass-card p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                 <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Active Archives _</h2>
                    <p className="text-[9px] text-text-muted mt-1 uppercase font-bold tracking-widest">History of requested resolutions</p>
                 </div>
                 <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
                    {['All', 'Open', 'In Progress', 'Resolved'].map((filter) => (
                       <button 
                          key={filter}
                          onClick={() => setStatusFilter(filter)}
                          className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === filter ? 'bg-brand-primary text-bg-main' : 'text-text-muted hover:text-white'}`}
                       >
                          {filter}
                       </button>
                    ))}
                 </div>
              </div>
              
              <div className="space-y-4">
                 {filteredTickets.length > 0 ? filteredTickets.map((t) => (
                    <div key={t.id} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-brand-primary/20 transition-all group">
                       <button 
                          onClick={() => setExpandedTicketId(expandedTicketId === t.id ? null : t.id)}
                          className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 text-left"
                       >
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white font-mono text-[10px] font-black italic">
                                {t.id.slice(-2)}
                             </div>
                             <div>
                                <div className="text-[11px] font-black text-white uppercase tracking-tight">{t.subject}</div>
                                <div className="flex items-center gap-2 mt-1">
                                   <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{t.id} • {t.type}</span>
                                   <span className="text-[9px] text-text-muted">•</span>
                                   <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{t.date}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-current ${
                                t.status === 'Resolved' ? 'text-emerald-500 bg-emerald-500/10' : 
                                t.status === 'In Progress' ? 'text-amber-500 bg-amber-500/10' : 
                                'text-blue-500 bg-blue-500/10'
                             }`}>
                                {t.status}
                             </span>
                             <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${expandedTicketId === t.id ? 'rotate-180' : ''}`} />
                          </div>
                       </button>
                       
                       <AnimatePresence>
                         {expandedTicketId === t.id && (
                           <motion.div 
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             className="overflow-hidden"
                           >
                             <div className="px-5 pb-5 pt-0">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                   <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Detailed Log:</div>
                                   <p className="text-xs text-text-secondary font-medium leading-relaxed italic">"{t.description}"</p>
                                   <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
                                      <div className="flex items-center gap-2">
                                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                         <div className="text-[9px] font-bold text-text-muted uppercase">Ticket Created • {t.date} 09:00</div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                         <div className={`w-1.5 h-1.5 rounded-full ${t.status !== 'Open' ? 'bg-emerald-500' : 'bg-white/10'}`} />
                                         <div className="text-[9px] font-bold text-text-muted uppercase">Verification Pipeline • {t.date} 11:30</div>
                                      </div>
                                   </div>
                                </div>
                             </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                 )) : (
                   <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                      <HelpCircle className="w-10 h-10 text-white/5 mx-auto mb-4" />
                      <p className="text-xs font-black text-text-muted uppercase tracking-widest">Memory cleared. No active tickets found for this sector.</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Quick Actions */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                 { label: 'Track Asset', icon: FileText, path: '/orders', color: 'text-blue-500', desc: 'Real-time logistics sync' },
                 { label: 'Network Orders', icon: ShoppingCart, path: '/orders', color: 'text-purple-500', desc: 'Full transmission history' },
                 { label: 'Entity Profile', icon: User, path: '/profile', color: 'text-brand-primary', desc: 'Secure parameter management' }
              ].map((action, i) => (
                 <button 
                    key={i} 
                    onClick={() => navigate(action.path)}
                    className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-brand-primary/40 transition-all group text-left relative overflow-hidden"
                 >
                    <div className="relative z-10">
                       <action.icon className={`w-6 h-6 mb-4 ${action.color} group-hover:scale-110 transition-transform`} />
                       <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{action.label}</div>
                       <div className="text-[9px] text-text-muted font-bold uppercase tracking-tight">{action.desc}</div>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowRight className="w-4 h-4 text-white/20" />
                    </div>
                 </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// Internal Link component since I cannot use Link from react-router-dom directly without import
const Link = ({ to, children, className }) => {
   const navigate = useNavigate();
   return (
      <a 
         href={to} 
         onClick={(e) => { e.preventDefault(); navigate(to); }}
         className={className}
      >
         {children}
      </a>
   )
}

export default Support;
