import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, Transaction, User, Payout } from '../types';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingPayments: number;
  deliveredOrders: number;
  shippedOrders: number;
  pendingOrders: number;
}

interface DataContextType {
  products: Product[];
  orders: Order[];
  transactions: Transaction[];
  payouts: Payout[];
  stats: DashboardStats;
  placeOrder: (orderData: any) => void;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  updateProductStock: (productId: string, quantity: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteOrder: (id: string) => void;
  requestPayout: (payoutData: Omit<Payout, 'id' | 'status' | 'requestDate'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Organic Basmati Rice', description: 'Long-grain aromatic rice grown organically in the foothills of Himalayas.', price: 120, category: 'Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', stock: 500, unit: 'kg', sellerId: 's1' },
  { id: '2', name: 'Premium Mustard Seeds', description: 'Pure mustard seeds for oil extraction and culinary use.', price: 45, category: 'Seeds', image: 'https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400', stock: 1200, unit: 'kg', sellerId: 's1' },
  { id: '3', name: 'Desi Cow Ghee', description: 'Traditional A2 ghee made using the Bilona method.', price: 950, category: 'Dairy', image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400', stock: 50, unit: 'liter', sellerId: 's2' },
  { id: '4', name: 'Organic Wheat Flour', description: 'Stone-ground whole wheat flour with no additives.', price: 350, category: 'Grains', image: 'https://images.unsplash.com/photo-1501746734258-dd16999cc0e6?w=400', stock: 5, unit: '5kg', sellerId: 's2' },
  { id: '5', name: 'Premium Rice', description: 'High-quality long grain rice.', price: 95, category: 'Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', stock: 100, unit: 'kg', sellerId: 's1' },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ekart_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ekart_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ekart_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [payouts, setPayouts] = useState<Payout[]>(() => {
    const saved = localStorage.getItem('ekart_payouts');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('ekart_products', JSON.stringify(products));
    localStorage.setItem('ekart_orders', JSON.stringify(orders));
    localStorage.setItem('ekart_transactions', JSON.stringify(transactions));
    localStorage.setItem('ekart_payouts', JSON.stringify(payouts));
  }, [products, orders, transactions, payouts]);

  // Derived Stats
  const stats: DashboardStats = {
    totalRevenue: orders
      .filter(o => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.total, 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    pendingPayments: orders
      .filter(o => o.paymentStatus === 'PENDING')
      .reduce((sum, o) => sum + o.total, 0),
    deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
    shippedOrders: orders.filter(o => o.status === 'SHIPPED').length,
    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
  };

  const generateTimeline = (status: Order['status']) => {
    const statuses = ['PENDING', 'ACCEPTED', 'SHIPPED', 'DELIVERED'];
    const currentIdx = statuses.indexOf(status === 'CANCELLED' ? 'PENDING' : status);
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return [
      { status: 'Order Placed', time: timeStr, date: dateStr, active: true, completed: true },
      { status: 'Processing', time: currentIdx >= 1 ? timeStr : '-', date: currentIdx >= 1 ? dateStr : '-', active: currentIdx >= 1, completed: currentIdx >= 1 },
      { status: 'Shipped', time: currentIdx >= 2 ? timeStr : '-', date: currentIdx >= 2 ? dateStr : '-', active: currentIdx >= 2, completed: currentIdx >= 2 },
      { status: 'Delivered', time: currentIdx >= 3 ? timeStr : '-', date: currentIdx >= 3 ? dateStr : '-', active: currentIdx >= 3, completed: currentIdx >= 3 },
    ];
  };

  const placeOrder = (orderData: any) => {
    const total = orderData.total;
    const tax = Math.round(total * 0.05);
    const shipping = 49;
    const discount = orderData.discount || 0;
    const subtotal = total - tax - shipping + discount;

    const isOnline = orderData.paymentMethod !== 'COD';
    const transactionId = isOnline ? `TXN-${Math.floor(100000 + Math.random() * 900000)}` : undefined;
    const paymentStatus = isOnline ? 'PAID' : 'PENDING';
    const paymentDate = isOnline ? new Date().toISOString() : undefined;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: orderData.userId || 'GUEST',
      items: orderData.items,
      total: orderData.total,
      subtotal,
      shipping,
      tax,
      discount,
      status: 'PENDING',
      paymentStatus,
      paymentDate,
      transactionId,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      shippingAddress: orderData.shippingAddress || {
        fullAddress: orderData.address || '123 Farm Lane',
        city: orderData.city || 'Punjab',
        state: orderData.state || 'Punjab',
        pincode: orderData.pincode || '140001',
        country: orderData.country || 'India',
        addressType: orderData.addressType || 'Home'
      },
      customerName: orderData.customerName || 'Rahul Kumar',
      customerPhone: orderData.customerPhone || '+91 9876543210',
      customerEmail: orderData.customerEmail,
      customerType: orderData.userId ? 'Registered' : 'Guest',
      paymentMethod: orderData.paymentMethod,
      timeline: generateTimeline('PENDING')
    };

    // Update Stock
    setProducts(prev => prev.map(p => {
      const orderItem = newOrder.items.find(item => item.id === p.id);
      if (orderItem) {
        return { ...p, stock: Math.max(0, p.stock - orderItem.quantity) };
      }
      return p;
    }));

    // Add Order
    setOrders(prev => [newOrder, ...prev]);

    // Create Transaction
    const newTxn: Transaction = {
      id: transactionId || `TXN-COD-${newOrder.id}`,
      orderId: newOrder.id,
      amount: newOrder.total,
      status: isOnline ? 'SUCCESS' : 'PENDING',
      date: isOnline ? new Date().toISOString() : new Date().toISOString(),
      method: orderData.paymentMethod
    };
    setTransactions(prev => [newTxn, ...prev]);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        let paymentStatus = order.paymentStatus;
        let paymentDate = order.paymentDate;
        
        // Logical side effects for delivery
        if (newStatus === 'DELIVERED') {
          paymentStatus = 'PAID'; // COD becomes PAID on delivery
          paymentDate = new Date().toISOString();
          
          // Also update transaction status
          setTransactions(txns => txns.map(t => 
            t.orderId === orderId ? { ...t, status: 'SUCCESS' as const, date: new Date().toISOString() } : t
          ));
        }

        return { 
          ...order, 
          status: newStatus, 
          paymentStatus,
          paymentDate,
          timeline: generateTimeline(newStatus)
        };
      }
      return order;
    }));
  };

  const updateProductStock = (productId: string, quantity: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: quantity } : p
    ));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9)
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const editProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => String(p.id) === String(id) ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    // Robust filtering using loose equality just in case of type mismatches between string/numeric IDs
    setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => String(o.id) !== String(id)));
    // Also cleanup associated transactions
    setTransactions(prev => prev.filter(t => String(t.orderId) !== String(id)));
  };

  const requestPayout = (payoutData: Omit<Payout, 'id' | 'status' | 'requestDate'>) => {
    const newPayout: Payout = {
      ...payoutData,
      id: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'PROCESSING',
      requestDate: new Date().toISOString()
    };
    setPayouts(prev => [newPayout, ...prev]);
  };

  return (
    <DataContext.Provider value={{ 
      products, 
      orders, 
      transactions, 
      payouts,
      stats, 
      placeOrder, 
      updateOrderStatus,
      updateProductStock,
      addProduct,
      editProduct,
      deleteProduct,
      deleteOrder,
      requestPayout
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
