import React, { useState, useMemo } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Timer, 
  CreditCard,
  ChevronRight,
  Plus,
  ArrowRight,
  X,
  Wallet,
  Building2,
  PhoneCall
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

import { useData } from '../../context/DataContext';

const StoreEarnings: React.FC = () => {
  const { transactions, payouts, requestPayout } = useData();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'Bank' | 'UPI'>('Bank');
  const [accountDetail, setAccountDetail] = useState('');
  const [chartView, setChartView] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');

  // Financial Calculations
  const metrics = useMemo(() => {
    const totalEarnings = transactions
      .filter(t => t.status === 'SUCCESS')
      .reduce((sum, t) => sum + t.amount, 0);

    const withdrawnAmount = payouts
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayouts = payouts
      .filter(p => p.status === 'PROCESSING')
      .reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = totalEarnings - withdrawnAmount - pendingPayouts;

    const pendingBalance = transactions
      .filter(t => t.status === 'PENDING')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalEarnings,
      availableBalance,
      pendingBalance,
      withdrawnAmount
    };
  }, [transactions, payouts]);

  // Breakdown Calculations
  const breakdown = useMemo(() => {
    const onlineEarnings = transactions
      .filter(t => t.status === 'SUCCESS' && t.method !== 'COD')
      .reduce((sum, t) => sum + t.amount, 0);

    const codEarnings = transactions
      .filter(t => t.status === 'SUCCESS' && t.method === 'COD')
      .reduce((sum, t) => sum + t.amount, 0);

    const platformFees = Math.round((onlineEarnings + codEarnings) * 0.05); // 5% fee
    const netEarnings = onlineEarnings + codEarnings - platformFees;

    return {
      onlineEarnings,
      codEarnings,
      platformFees,
      netEarnings
    };
  }, [transactions]);

  // Chart Data Simulation based on actual transactions
  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => ({
      name: day,
      amount: Math.floor(Math.random() * 5000) + 2000 // In a real app, this would filter transactions by day
    }));
    return data;
  }, [transactions]);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (amount > metrics.availableBalance) {
      alert("Insufficient available balance");
      return;
    }

    if (!accountDetail) {
      alert("Please provide account details");
      return;
    }

    requestPayout({
      amount,
      method: withdrawMethod,
      accountDetail
    });

    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setAccountDetail('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Financial Center</h1>
          <p className="text-text-secondary mt-1 max-w-lg font-medium">Manage your farm earnings, monitor settlement cycles, and request payouts.</p>
        </div>
        <button 
          onClick={() => setShowWithdrawModal(true)}
          className="group relative bg-brand-primary px-8 py-4 rounded-2xl text-bg-dark font-black flex items-center gap-2 overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
           <span className="relative z-10">Withdraw Funds</span>
           <ArrowUpRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card bg-emerald-500/5 border-emerald-500/10 p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
               <IndianRupee className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500/50" />
          </div>
          <div className="mt-8">
            <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest mb-1">Total Earnings</p>
            <h2 className="text-3xl font-black text-white">₹{metrics.totalEarnings.toLocaleString('en-IN')}</h2>
          </div>
        </motion.div>

        {/* Available Balance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card bg-brand-primary/5 border-brand-primary/10 p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
               <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-8">
            <p className="text-[10px] font-black text-brand-primary/70 uppercase tracking-widest mb-1">Available to Withdraw</p>
            <h2 className="text-3xl font-black text-white">₹{metrics.availableBalance.toLocaleString('en-IN')}</h2>
          </div>
        </motion.div>

        {/* Pending Balance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card bg-orange-500/5 border-orange-500/10 p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400">
               <Timer className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-8">
            <p className="text-[10px] font-black text-orange-500/70 uppercase tracking-widest mb-1">Pending (COD In-Transit)</p>
            <h2 className="text-3xl font-black text-white">₹{metrics.pendingBalance.toLocaleString('en-IN')}</h2>
          </div>
        </motion.div>

        {/* Withdrawn Amount */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card bg-blue-500/5 border-blue-500/10 p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
               <ArrowDownRight className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-8">
            <p className="text-[10px] font-black text-blue-500/70 uppercase tracking-widest mb-1">Total Withdrawn</p>
            <h2 className="text-3xl font-black text-white">₹{metrics.withdrawnAmount.toLocaleString('en-IN')}</h2>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Earnings Breakdown & Analytics */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="glass-card h-[400px] flex flex-col p-8">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-primary" /> Store Revenue Analytics
              </h3>
              <div className="flex bg-bg-surface p-1 rounded-xl border border-brand-dark">
                 <button 
                   onClick={() => setChartView('WEEKLY')}
                   className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${chartView === 'WEEKLY' ? 'bg-brand-primary text-bg-dark' : 'text-text-secondary hover:text-white'}`}
                 >
                   WEEKLY
                 </button>
                 <button 
                   onClick={() => setChartView('MONTHLY')}
                   className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${chartView === 'MONTHLY' ? 'bg-brand-primary text-bg-dark' : 'text-text-secondary hover:text-white'}`}
                 >
                   MONTHLY
                 </button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="earnGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f1717', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fill="url(#earnGradient)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-8 border-brand-dark/30">
            <h3 className="text-xl font-bold mb-8">Earnings Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Online Payments</p>
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest">Card, UPI, Net Banking</p>
                    </div>
                  </div>
                  <p className="text-lg font-black text-white">₹{breakdown.onlineEarnings.toLocaleString()}</p>
                </div>

                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                      <Timer className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Cash on Delivery</p>
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest">Settled after delivery</p>
                    </div>
                  </div>
                  <p className="text-lg font-black text-white">₹{breakdown.codEarnings.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6 bg-bg-surface/50 border border-brand-dark rounded-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-text-secondary text-sm">
                    <span>Platform Fees (5%)</span>
                    <span className="font-bold text-red-400/80">-₹{breakdown.platformFees.toLocaleString()}</span>
                  </div>
                  <div className="h-[1px] bg-brand-dark/20 w-full"></div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-black text-white">Net Earnings</span>
                    <span className="text-2xl font-black text-brand-primary">₹{breakdown.netEarnings.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-[10px] text-text-secondary mt-4 italic">Settlements are processed weekly every Monday.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payout History Side Tab */}
        <div className="lg:col-span-4 glass-card p-0 flex flex-col overflow-hidden border-brand-dark/30">
          <div className="p-8 border-b border-brand-dark/20 flex justify-between items-center bg-bg-surface/30">
             <h3 className="text-lg font-black uppercase tracking-widest text-white">Payout History</h3>
             <button className="text-[10px] font-black text-brand-primary uppercase hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar max-h-[600px]">
             {payouts.length > 0 ? (
               payouts.map((payout) => (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   key={payout.id} 
                   className="p-4 bg-bg-surface border border-brand-dark/10 rounded-2xl flex items-center justify-between group hover:border-brand-primary/30 transition-all"
                 >
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-xl ${payout.method === 'Bank' ? 'bg-blue-500/10 text-blue-400' : 'bg-brand-primary/10 text-brand-primary'}`}>
                          {payout.method === 'Bank' ? <Building2 className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />}
                       </div>
                       <div className="min-w-0">
                          <p className="font-black text-white truncate">₹{payout.amount.toLocaleString()}</p>
                          <p className="text-[10px] text-text-secondary font-mono truncate">{payout.accountDetail}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.2em] mb-1 inline-block ${
                         payout.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' :
                         payout.status === 'PROCESSING' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-500'
                       }`}>
                         {payout.status}
                       </span>
                       <p className="text-[10px] text-text-secondary font-medium mt-1">
                          {new Date(payout.requestDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                       </p>
                    </div>
                 </motion.div>
               ))
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-20">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Download className="w-8 h-8 text-text-secondary" />
                 </div>
                 <p className="text-sm font-bold">No payouts initiated yet.</p>
                 <p className="text-xs text-text-secondary mt-1">Request your first withdrawal to see it here.</p>
               </div>
             )}
          </div>
          <div className="p-8 bg-bg-surface/30 mt-auto border-t border-brand-dark/20 text-center">
             <p className="text-xs text-text-secondary font-medium">Standard processing time: 2-3 business days.</p>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdrawModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card border-brand-primary/30 p-0 overflow-hidden"
            >
              <div className="p-8 border-b border-brand-dark/20 flex justify-between items-center bg-brand-primary/5">
                <div>
                  <h3 className="text-2xl font-black text-white">Withdraw Funds</h3>
                  <p className="text-text-secondary text-sm mt-1">Available balance: <span className="text-brand-primary font-bold">₹{metrics.availableBalance.toLocaleString()}</span></p>
                </div>
                <button 
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-2 hover:bg-bg-surface rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleWithdraw} className="p-8 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-1">Amount to Withdraw (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-brand-primary" />
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={metrics.availableBalance}
                      className="w-full bg-bg-surface border-2 border-brand-dark rounded-2xl h-16 pl-14 pr-6 text-2xl font-black text-white outline-none focus:border-brand-primary transition-all placeholder:text-text-secondary/30"
                      required
                    />
                  </div>
                  <div className="flex justify-between px-1">
                    <p className="text-[10px] text-text-secondary">Min: ₹500</p>
                    <button 
                      type="button"
                      onClick={() => setWithdrawAmount(metrics.availableBalance.toString())}
                      className="text-[10px] font-black text-brand-primary hover:underline uppercase tracking-widest"
                    >
                      Withdraw All
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-1">Payout Method</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setWithdrawMethod('Bank')}
                      className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                        withdrawMethod === 'Bank' ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-dark bg-bg-surface hover:border-text-secondary/50'
                      }`}
                    >
                      <Building2 className={`w-8 h-8 ${withdrawMethod === 'Bank' ? 'text-brand-primary' : 'text-text-secondary'}`} />
                      <span className={`text-xs font-black uppercase tracking-widest ${withdrawMethod === 'Bank' ? 'text-white' : 'text-text-secondary'}`}>Bank Account</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setWithdrawMethod('UPI')}
                      className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                        withdrawMethod === 'UPI' ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-dark bg-bg-surface hover:border-text-secondary/50'
                      }`}
                    >
                      <PhoneCall className={`w-8 h-8 ${withdrawMethod === 'UPI' ? 'text-brand-primary' : 'text-text-secondary'}`} />
                      <span className={`text-xs font-black uppercase tracking-widest ${withdrawMethod === 'UPI' ? 'text-white' : 'text-text-secondary'}`}>UPI ID</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-1">
                    {withdrawMethod === 'Bank' ? 'Account Number / IFSC' : 'UPI Address (VPA)'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={withdrawMethod === 'Bank' ? 'XXXX XXXX XXXX XXXX' : 'username@bank'}
                    value={accountDetail}
                    onChange={(e) => setAccountDetail(e.target.value)}
                    className="w-full bg-bg-surface border-2 border-brand-dark rounded-2xl h-14 px-6 text-lg font-black text-white outline-none focus:border-brand-primary transition-all placeholder:text-text-secondary/30"
                    required
                  />
                  <p className="text-[10px] text-text-secondary px-1 flex items-center gap-1">
                    <Timer className="w-3 h-3" /> Double check your details before proceeding.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand-primary h-16 rounded-2xl text-bg-dark font-black tracking-widest uppercase text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                >
                  Confirm Withdrawal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoreEarnings;
