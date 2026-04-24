/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// Temporary components for pages
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Home = React.lazy(() => import('./pages/customer/Home'));
const ProductDetails = React.lazy(() => import('./pages/customer/ProductDetails'));
const Cart = React.lazy(() => import('./pages/customer/Cart'));
const Checkout = React.lazy(() => import('./pages/customer/Checkout'));
const Orders = React.lazy(() => import('./pages/customer/Orders'));
const OrderDetails = React.lazy(() => import('./pages/customer/OrderDetails'));

const SellerDashboard = React.lazy(() => import('./pages/seller/Dashboard'));
const SellerMarketplace = React.lazy(() => import('./pages/seller/Marketplace'));
const SellerOrders = React.lazy(() => import('./pages/seller/Orders'));
const SellerTransactions = React.lazy(() => import('./pages/seller/Transactions'));
const SellerPayments = React.lazy(() => import('./pages/seller/Payments'));
const SellerPricing = React.lazy(() => import('./pages/seller/Pricing'));
const SellerOrderDetails = React.lazy(() => import('./pages/seller/OrderDetails'));

const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/Users'));
const AdminProducts = React.lazy(() => import('./pages/admin/Products'));
const AdminOrders = React.lazy(() => import('./pages/admin/Orders'));

const AppContent: React.FC = () => {
  const { user } = useAuth();
  
  const hasSidebar = user && (user.role === 'SELLER' || user.role === 'ADMIN');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {hasSidebar && <Sidebar />}
        <main className={`flex-1 transition-all duration-300 ${hasSidebar ? 'md:ml-64' : ''}`}>
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <React.Suspense fallback={<div className="flex items-center justify-center p-20 text-brand-primary">Loading page...</div>}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shop" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/" element={<Navigate to="/register" replace />} />

                {/* Customer Routes */}
                <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                </Route>

                {/* Seller Routes */}
                <Route element={<ProtectedRoute allowedRoles={['SELLER']} />}>
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                  <Route path="/seller/marketplace" element={<SellerMarketplace />} />
                  <Route path="/seller/orders" element={<SellerOrders />} />
                  <Route path="/seller/orders/:id" element={<SellerOrderDetails />} />
                  <Route path="/seller/transactions" element={<SellerTransactions />} />
                  <Route path="/seller/payments" element={<SellerPayments />} />
                  <Route path="/seller/pricing" element={<SellerPricing />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                </Route>
              </Routes>
            </React.Suspense>
          </div>
        </main>
      </div>
      <footer className="bg-bg-card border-t border-brand-dark py-8 px-4 text-center text-text-secondary text-sm">
        <p>&copy; 2026 eKart Farming - Empowering Agriculture digitally.</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

