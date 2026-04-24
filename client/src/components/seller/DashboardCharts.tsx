import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 2000, orders: 12 },
  { name: 'Thu', sales: 2780, orders: 20 },
  { name: 'Fri', sales: 1890, orders: 15 },
  { name: 'Sat', sales: 2390, orders: 25 },
  { name: 'Sun', sales: 3490, orders: 30 },
];

const orderStatusData = [
  { name: 'Pending', value: 8, color: '#f59e0b' },
  { name: 'Shipped', value: 12, color: '#3b82f6' },
  { name: 'Delivered', value: 25, color: '#10b981' },
];

export const SalesChart: React.FC = () => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16, 185, 129, 0.1)" />
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f1717', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: '#fff' }}
          itemStyle={{ color: '#10b981' }}
        />
        <Area type="monotone" dataKey="sales" stroke="#10b981" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const OrderStatusDist: React.FC = () => (
  <div className="h-[300px] w-full relative">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={orderStatusData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {orderStatusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f1717', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center">
        <p className="text-2xl font-bold">45</p>
        <p className="text-[10px] text-text-secondary uppercase">Total</p>
      </div>
    </div>
  </div>
);
