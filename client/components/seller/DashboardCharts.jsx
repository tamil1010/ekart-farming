import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const pieData = [
  { name: 'Pending', value: 400 },
  { name: 'Shipped', value: 300 },
  { name: 'Delivered', value: 300 },
];

const COLORS = ['#f59e0b', '#3b82f6', '#22c55e'];

export const SalesChart = () => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#525252', fontSize: 10, fontWeight: 700 }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#525252', fontSize: 10, fontWeight: 700 }} 
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#171717', 
            borderColor: '#262626',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '900',
            textTransform: 'uppercase'
          }}
          itemStyle={{ color: '#22c55e' }}
        />
        <Area 
          type="monotone" 
          dataKey="sales" 
          stroke="#22c55e" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorSales)" 
          dot={{ fill: '#22c55e', strokeWidth: 2, r: 4, stroke: '#171717' }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const OrderStatusDist = () => (
  <div className="h-48 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
           contentStyle={{ 
            backgroundColor: '#171717', 
            borderColor: '#262626',
            borderRadius: '12px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
