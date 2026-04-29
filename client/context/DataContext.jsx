import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

const INITIAL_PRODUCTS = [
  { _id: '1', name: 'Premium Basmati Rice', description: 'Long-grain aged aromatic rice sourced from Himalayan foothills.', price: 120, category: 'Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800', stock: 500, unit: 'kg', sellerId: 'mock-seller-1', sellerName: 'Himalaya Farms' },
  { _id: '2', name: 'Organic Alphonso Mangoes', description: 'Sun-ripened premium Ratnagiri Alphonso mangoes.', price: 1200, category: 'Fruits', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800', stock: 50, unit: 'dozen', sellerId: 'mock-seller-1', sellerName: 'Ratnagiri Orchards' },
  { _id: '3', name: 'Fresh Farm Tomatoes', description: 'Plump, organic red tomatoes harvested daily from local farms.', price: 40, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800', stock: 200, unit: 'kg', sellerId: 'mock-seller-1', sellerName: 'Green Valley' },
  { _id: '4', name: 'Wheat Seeds (Hybrid)', description: 'High-yield hybrid wheat seeds for professional cultivation.', price: 850, category: 'Seeds', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800', stock: 100, unit: '5kg', sellerId: 'mock-seller-1', sellerName: 'Agro Seeds Co.' },
  { _id: '5', name: 'Pure Cow Ghee', description: 'Traditional bilona method fresh clarified butter.', price: 650, category: 'Dairy', image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800', stock: 60, unit: 'liter', sellerId: 'mock-seller-1', sellerName: 'Dairy Pure' },
];

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ekart_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If we find electronics, clear them to show new agricultural samples
      if (parsed.some(p => p.name?.toLowerCase().includes('macbook') || p.name?.toLowerCase().includes('iphone'))) {
        localStorage.removeItem('ekart_products');
        return INITIAL_PRODUCTS;
      }
      return parsed;
    }
    return INITIAL_PRODUCTS;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ekart_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('ekart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ekart_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync state across multiple tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ekart_orders') {
        setOrders(JSON.parse(e.newValue));
      }
      if (e.key === 'ekart_products') {
        setProducts(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync transactions with paid orders
  useEffect(() => {
    const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');
    const newTransactions = paidOrders.map(o => ({
      _id: `txn_${o._id}`,
      orderId: o._id,
      amount: o.total || 0,
      method: o.paymentMethod || 'Card',
      status: 'SUCCESS',
      date: o.createdAt
    }));
    setTransactions(newTransactions);
  }, [orders]);

  const stats = {
    totalRevenue: orders
      .filter(o => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + (o.total || 0), 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    pendingPayments: orders
      .filter(o => o.paymentStatus === 'PENDING')
      .reduce((sum, o) => sum + (o.total || 0), 0),
    deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
    shippedOrders: orders.filter(o => o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY').length,
    pendingOrders: orders.filter(o => o.status === 'PENDING' || o.status === 'ACCEPTED').length,
  };

  const placeOrder = async (orderData) => {
    const newOrder = {
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      paymentStatus: 'PAID',
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order._id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
    ));
  };

  const addProduct = async (productData) => {
    const newProduct = {
      _id: Math.random().toString(36).substr(2, 9),
      ...productData
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const editProduct = async (id, updates) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, ...updates } : p));
  };

  const updateStock = async (id, newStock) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: Number(newStock) } : p));
  };

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p._id !== id));
  };
  
  const claimInitialProducts = (sellerId, sellerName) => {
    setProducts(prev => prev.map(p => 
      p.sellerId === 'mock-seller-1' ? { ...p, sellerId, sellerName } : p
    ));
    setOrders(prev => prev.map(o => {
      const updatedItems = o.items.map(item => {
        const itemSellerId = item.product?.sellerId || item.sellerId;
        if (itemSellerId === 'mock-seller-1') {
          return {
            ...item,
            sellerId,
            product: { ...item.product, sellerId }
          };
        }
        return item;
      });
      return { ...o, items: updatedItems };
    }));
  };

  const deleteOrder = async (orderId) => {
    setOrders(prev => prev.filter(o => o._id !== orderId));
  };

  const requestPayout = async (payoutData) => {
    const newPayout = {
      _id: Math.random().toString(36).substr(2, 9),
      requestDate: new Date().toISOString(),
      status: 'PROCESSING',
      ...payoutData
    };
    setPayouts(prev => [newPayout, ...prev]);
    return newPayout;
  };

  return (
    <DataContext.Provider value={{ 
      products, 
      orders, 
      transactions,
      payouts,
      stats,
      loading,
      placeOrder, 
      updateOrderStatus,
      deleteOrder,
      addProduct,
      editProduct,
      updateStock,
      deleteProduct,
      claimInitialProducts,
      requestPayout
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
