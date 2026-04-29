import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  IndianRupee, 
  CheckCircle2, 
  Download,
  Calendar,
  X,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useData } from '../../context/DataContext.jsx';

const Transactions = () => {
  const { transactions } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  // Summary Metrics
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyEarnings = transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.status === 'SUCCESS' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingAmount = transactions
      .filter(t => t.status === 'PENDING')
      .reduce((sum, t) => sum + t.amount, 0);

    const failedCount = transactions.filter(t => t.status === 'FAILED').length;

    return {
      monthlyEarnings,
      pendingAmount,
      failedCount
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tId = t._id || t.id || '';
      const matchesSearch = tId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (t.orderId || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

      const date = new Date(t.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      
      let matchesDate = true;
      if (dateFilter === 'TODAY') {
        matchesDate = date >= today;
      } else if (dateFilter === 'LAST_7_DAYS') {
        matchesDate = date >= last7Days;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [transactions, searchTerm, statusFilter, dateFilter]);

  const exportToCSV = () => {
    const headers = ['Transaction ID,Order ID,Amount,Payment Method,Status,Date'];
    const rows = filteredTransactions.map(t => 
      `${t.id},${t.orderId},${t.amount},${t.method},${t.status},${new Date(t.date).toLocaleString()}`
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ekart_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-sans font-black tracking-tighter text-white">Financial <span className="text-brand-primary">Records</span></h1>
          <p className="text-text-secondary mt-1 text-[10px] font-black uppercase tracking-widest">Track every payment and settlement accurately.</p>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={filteredTransactions.length === 0}
          className="btn-terminal px-8 text-bg-main"
        >
          <Download className="w-5 h-5" /> Export Manifest
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card flex items-center gap-6 p-8 border-brand-primary/10">
            <div className="w-14 h-14 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary">
               <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
               <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black mb-1">Monthly Yield</p>
               <h3 className="text-4xl font-black text-white tracking-tighter">₹{stats.monthlyEarnings.toLocaleString('en-IN')}</h3>
            </div>
         </motion.div>

         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card flex items-center gap-6 p-8 border-amber-500/10">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500">
               <Calendar className="w-7 h-7" />
            </div>
            <div>
               <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black mb-1">Pending (COD)</p>
               <h3 className="text-4xl font-black text-white tracking-tighter">₹{stats.pendingAmount.toLocaleString('en-IN')}</h3>
            </div>
         </motion.div>

         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card flex items-center gap-6 p-8 border-white/5">
            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-text-muted">
               <ArrowUpRight className="w-7 h-7 rotate-180" />
            </div>
            <div>
               <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black mb-1">Failed Nodes</p>
               <h3 className="text-4xl font-black text-white tracking-tighter">{stats.failedCount < 10 ? `0${stats.failedCount}` : stats.failedCount}</h3>
            </div>
         </motion.div>
      </div>

      {/* Main Table Section */}
      <div className="glass-card p-0 overflow-hidden border-white/5">
        <div className="p-8 border-b border-white/5 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 bg-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by Transaction or Order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-12 h-12 bg-white/5 border-white/10" 
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
             <div className="relative min-w-[140px]">
               <select 
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value)}
                 className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 pr-10 text-[10px] font-black uppercase tracking-widest text-text-muted outline-none focus:border-brand-primary appearance-none"
               >
                 <option value="ALL">All Status</option>
                 <option value="SUCCESS">Success</option>
                 <option value="PENDING">Pending</option>
                 <option value="FAILED">Failed</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-text-muted" />
             </div>

             <div className="relative min-w-[140px]">
               <select 
                 value={dateFilter}
                 onChange={(e) => setDateFilter(e.target.value)}
                 className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 pr-10 text-[10px] font-black uppercase tracking-widest text-text-muted outline-none focus:border-brand-primary appearance-none"
               >
                 <option value="ALL">All Time</option>
                 <option value="TODAY">Today</option>
                 <option value="LAST_7_DAYS">Last 7 Days</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-text-muted" />
             </div>

             {(searchTerm || statusFilter !== 'ALL' || dateFilter !== 'ALL') && (
               <button 
                 onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setDateFilter('ALL'); }}
                 className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors px-2 text-[10px] font-black uppercase tracking-widest"
               >
                 <X className="w-4 h-4" /> Purge Filter
               </button>
             )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Node Hash</th>
                <th className="px-8 py-5">Sequence ID</th>
                <th className="px-8 py-5 text-right">Yield</th>
                <th className="px-8 py-5 text-center">Protocol</th>
                <th className="px-8 py-5 text-center">State</th>
                <th className="px-8 py-5 text-right">Sync Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(txn => (
                  <tr key={txn._id || txn.id} className="group hover:bg-white/5 transition-all">
                    <td className="px-8 py-6 font-mono text-[9px] font-black text-text-muted group-hover:text-brand-primary transition-colors">
                      {String(txn._id || txn.id).toUpperCase()}
                    </td>
                    <td className="px-8 py-6">
                      <Link 
                        to={`/seller/orders/${txn.orderId}`}
                        className="text-[11px] text-white font-black hover:text-brand-primary hover:underline underline-offset-4 flex animate-pulse-slow items-center gap-2 uppercase font-mono tracking-widest"
                      >
                         #{String(txn.orderId).slice(-8)}
                         <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-xl font-black text-white flex items-center justify-end gap-1 font-sans tracking-tighter">
                         ₹{txn.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest bg-white/5 border border-white/5 px-3 py-1 rounded-lg group-hover:border-brand-primary/20 transition-all">
                        {txn.method}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                        txn.status === 'SUCCESS' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :
                        txn.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-[10px] font-black text-white uppercase tracking-widest">
                        {new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-[9px] text-text-muted font-black uppercase mt-1">
                        {new Date(txn.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-text-muted border border-white/5">
                        <Search className="w-10 h-10" />
                      </div>
                      <div>
                        <p className="text-white font-black uppercase tracking-widest text-[11px]">NULL DATA SET</p>
                        <p className="text-text-muted font-medium text-[10px] uppercase mt-2">No transactions match current vector.</p>
                      </div>
                      <button 
                        onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setDateFilter('ALL'); }}
                        className="text-brand-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                      >
                        Reset Protocol
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
