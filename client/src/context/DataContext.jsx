import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch products from DB on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Fetch orders from DB on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchOrders();
    }
  }, []);

  // ✅ Sync transactions from paid orders
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (e) {
      console.error('Failed to fetch products:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (role = 'customer') => {
  try {
    const endpoint = role === 'seller'
      ? '/api/orders/seller'
      : '/api/orders/my-orders';
    const res = await api.get(endpoint);
    setOrders(res.data);
  } catch (e) {
    console.error('Failed to fetch orders:', e);
  }
};

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

  // ✅ Place order — saves to DB
  const placeOrder = async (orderData) => {
    try {
      const res = await api.post('/api/orders', orderData);
      setOrders(prev => [res.data, ...prev]);
      return res.data;
    } catch (e) {
      console.error('Failed to place order:', e);
      throw new Error(e.response?.data?.error || 'Failed to place order');
    }
  };

  // ✅ Update order status — saves to DB
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(order =>
        order._id === orderId ? res.data : order
      ));
    } catch (e) {
      console.error('Failed to update order status:', e);
      throw new Error(e.response?.data?.error || 'Failed to update status');
    }
  };

  // ✅ Add product — saves to DB
  const addProduct = async (productData) => {
    try {
      const res = await api.post('/api/products', productData);
      setProducts(prev => [res.data, ...prev]);
      return res.data;
    } catch (e) {
      console.error('Failed to add product:', e);
      throw new Error(e.response?.data?.error || 'Failed to add product');
    }
  };

  // ✅ Edit product — saves to DB
  const editProduct = async (id, updates) => {
    try {
      const res = await api.patch(`/api/products/${id}`, updates);
      setProducts(prev => prev.map(p => p._id === id ? res.data : p));
    } catch (e) {
      console.error('Failed to edit product:', e);
      throw new Error(e.response?.data?.error || 'Failed to edit product');
    }
  };

  // ✅ Update stock — saves to DB
  const updateStock = async (id, newStock) => {
    try {
      const res = await api.patch(`/api/products/${id}`, { stock: Number(newStock) });
      setProducts(prev => prev.map(p => p._id === id ? res.data : p));
    } catch (e) {
      console.error('Failed to update stock:', e);
      throw new Error(e.response?.data?.error || 'Failed to update stock');
    }
  };

  // ✅ Delete product — removes from DB
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      console.error('Failed to delete product:', e);
      throw new Error(e.response?.data?.error || 'Failed to delete product');
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await api.delete(`/api/orders/${orderId}`);
      setOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (e) {
      // If no delete endpoint, just remove from state
      setOrders(prev => prev.filter(o => o._id !== orderId));
    }
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
      requestPayout,
      fetchProducts,
      fetchOrders,
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