import React from 'react';
import AnalyticsCards from '../../components/seller/AnalyticsCards';
import { SalesChart, OrderStatusDist } from '../../components/seller/DashboardCharts';
import { AlertCircle, ArrowUpRight, ArrowRight, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, products } = useData();
  
  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Seller Dashboard</h1>
          <p className="text-text-secondary mt-1">Good morning, hope your farm is booming today!</p>
        </div>
        <Link to="/seller/marketplace" className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center">
          List New Product <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <AnalyticsCards />

      {/* Warning Box */}
      <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-center gap-4 text-orange-500">
        <AlertCircle className="w-8 h-8 shrink-0" />
        <div className="flex-1">
          <p className="font-bold">Low Stock Warning!</p>
          <p className="text-sm opacity-80">Organic Basmati Rice is below 10kg. Please restock soon.</p>
        </div>
        <Link to="/seller/marketplace" className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors">
          Manage Inventory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Sales Analytics</h2>
            <div className="flex gap-2">
               <button className="bg-bg-surface px-3 py-1 rounded-md text-xs font-medium text-brand-primary border border-brand-primary/20">Weekly</button>
               <button className="bg-bg-surface px-3 py-1 rounded-md text-xs font-medium text-text-secondary hover:text-white transition-colors">Monthly</button>
            </div>
          </div>
          <SalesChart />
        </div>

        <div className="glass-card">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <OrderStatusDist />
          <div className="mt-4 space-y-3">
             <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                   <span className="text-text-secondary">Pending</span>
                </div>
                <span className="font-bold">17.8%</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span className="text-text-secondary">Shipped</span>
                </div>
                <span className="font-bold">26.7%</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-text-secondary">Delivered</span>
                </div>
                <span className="font-bold">55.5%</span>
             </div>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link to="/seller/orders" className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-brand-dark/20 text-text-secondary text-sm uppercase tracking-wider">
              <tr>
                <th className="pb-4 font-medium">Order ID</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Total</th>
                <th className="pb-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/10">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-bg-surface/30 transition-colors group cursor-pointer" onClick={() => navigate(`/seller/orders/${order.id}`)}>
                  <td className="py-4 font-medium font-mono text-brand-primary">{order.id}</td>
                  <td className="py-4 text-text-secondary">{order.customerName}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400' :
                      order.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400' :
                      order.status === 'ACCEPTED' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 font-bold text-brand-primary">₹{order.total}</td>
                  <td className="py-4 text-right">
                    <button className="p-2 text-text-secondary hover:text-brand-primary transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
