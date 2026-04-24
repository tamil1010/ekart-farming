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
import { motion, AnimatePresence } from 'motion/react';

import { useData } from '../../context/DataContext';

const Transactions: React.FC = () => {
  const { transactions } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'LAST_7_DAYS'>('ALL');

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
      const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Financial Records</h1>
          <p className="text-text-secondary mt-1">Track every payment and settlement accurately.</p>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={filteredTransactions.length === 0}
          className="bg-bg-surface px-6 py-3 rounded-2xl text-white font-bold border border-brand-dark flex items-center gap-2 hover:border-brand-primary/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 text-brand-primary" /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card flex items-center gap-6 border-emerald-500/10">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
               <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
               <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-1">Total Monthly Earnings</p>
               <h3 className="text-3xl font-black text-white">₹{stats.monthlyEarnings.toLocaleString('en-IN')}</h3>
            </div>
         </motion.div>

         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card flex items-center gap-6 border-orange-500/10">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400">
               <Calendar className="w-7 h-7" />
            </div>
            <div>
               <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-1">Pending Settlements (COD)</p>
               <h3 className="text-3xl font-black text-white">₹{stats.pendingAmount.toLocaleString('en-IN')}</h3>
            </div>
         </motion.div>

         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card flex items-center gap-6 border-red-500/10">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
               <ArrowUpRight className="w-7 h-7 rotate-180" />
            </div>
            <div>
               <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-1">Failed Transactions</p>
               <h3 className="text-3xl font-black text-white">{stats.failedCount < 10 ? `0${stats.failedCount}` : stats.failedCount}</h3>
            </div>
         </motion.div>
      </div>

      {/* Main Table Section */}
      <div className="glass-card p-0 overflow-hidden border-brand-dark/30">
        <div className="p-8 border-b border-brand-dark/20 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 bg-bg-surface/30">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search by Transaction or Order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-12 h-12 bg-bg-surface" 
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
             <div className="relative min-w-[140px]">
               <select 
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value as any)}
                 className="w-full h-12 bg-bg-surface border border-brand-dark rounded-xl px-4 pr-10 text-sm font-bold text-text-secondary outline-none focus:border-brand-primary appearance-none"
               >
                 <option value="ALL">All Status</option>
                 <option value="SUCCESS">Success</option>
                 <option value="PENDING">Pending</option>
                 <option value="FAILED">Failed</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-text-secondary" />
             </div>

             <div className="relative min-w-[140px]">
               <select 
                 value={dateFilter}
                 onChange={(e) => setDateFilter(e.target.value as any)}
                 className="w-full h-12 bg-bg-surface border border-brand-dark rounded-xl px-4 pr-10 text-sm font-bold text-text-secondary outline-none focus:border-brand-primary appearance-none"
               >
                 <option value="ALL">All Time</option>
                 <option value="TODAY">Today</option>
                 <option value="LAST_7_DAYS">Last 7 Days</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-text-secondary" />
             </div>

             {(searchTerm || statusFilter !== 'ALL' || dateFilter !== 'ALL') && (
               <button 
                 onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setDateFilter('ALL'); }}
                 className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors px-2 text-xs font-black uppercase tracking-widest"
               >
                 <X className="w-4 h-4" /> Reset
               </button>
             )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-surface/50 text-text-secondary text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Payment Method</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/10">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(txn => (
                  <tr key={txn.id} className="group hover:bg-white/5 transition-all">
                    <td className="px-8 py-6 font-mono text-[10px] font-black text-slate-400 group-hover:text-brand-primary">
                      {txn.id}
                    </td>
                    <td className="px-8 py-6">
                      <Link 
                        to={`/seller/orders/${txn.orderId}`}
                        className="text-sm text-brand-primary font-black hover:underline underline-offset-4 flex items-center gap-2"
                      >
                         {txn.orderId}
                         <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-lg font-black text-white flex items-center gap-1 font-mono">
                         <IndianRupee className="w-4 h-4 text-brand-primary" /> {txn.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                        {txn.method}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        txn.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        txn.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-xs font-bold text-slate-200">
                        {new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-text-secondary font-medium">
                        {new Date(txn.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-bg-surface rounded-3xl flex items-center justify-center text-text-secondary">
                        <Search className="w-8 h-8" />
                      </div>
                      <p className="text-text-secondary font-bold">No transactions found matching your selection.</p>
                      <button 
                        onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setDateFilter('ALL'); }}
                        className="text-brand-primary text-sm font-black uppercase tracking-widest hover:underline"
                      >
                        Clear Filters
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
