/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Navbar from './components/common/Navbar.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import Placeholder from './pages/common/Placeholder.jsx';
import BrandIntro from './components/common/BrandIntro.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Lazy load pages
const Login = React.lazy(() => import('./pages/auth/Login.jsx').catch(() => ({ default: () => <Placeholder title="Login Page" /> })));
const Register = React.lazy(() => import('./pages/auth/Register.jsx').catch(() => ({ default: () => <Placeholder title="Register Page" /> })));
const Home = React.lazy(() => import('./pages/customer/Home.jsx').catch(() => ({ default: () => <Placeholder title="Home Page" /> })));
const ProductDetails = React.lazy(() => import('./pages/customer/ProductDetails.jsx').catch(() => ({ default: () => <Placeholder title="Product Details" /> })));
const Cart = React.lazy(() => import('./pages/customer/Cart.jsx').catch(() => ({ default: () => <Placeholder title="Cart Page" /> })));
const Checkout = React.lazy(() => import('./pages/customer/Checkout.jsx').catch(() => ({ default: () => <Placeholder title="Checkout Page" /> })));
const Orders = React.lazy(() => import('./pages/customer/Orders.jsx').catch(() => ({ default: () => <Placeholder title="Orders Page" /> })));
const OrderDetails = React.lazy(() => import('./pages/customer/OrderDetails.jsx').catch(() => ({ default: () => <Placeholder title="Order Details" /> })));
const TrackOrder = React.lazy(() => import('./pages/customer/TrackOrder.jsx').catch(() => ({ default: () => <Placeholder title="Track Order" /> })));
const Profile = React.lazy(() => import('./pages/Profile.jsx').catch(() => ({ default: () => <Placeholder title="Profile Page" /> })));

const SellerDashboard = React.lazy(() => import('./pages/seller/Dashboard.jsx').catch(() => ({ default: () => <Placeholder title="Seller Dashboard" /> })));
const SellerMarketplace = React.lazy(() => import('./pages/seller/Marketplace.jsx').catch(() => ({ default: () => <Placeholder title="Marketplace" /> })));
const SellerOrders = React.lazy(() => import('./pages/seller/Orders.jsx').catch(() => ({ default: () => <Placeholder title="Seller Orders" /> })));
const SellerTransactions = React.lazy(() => import('./pages/seller/Transactions.jsx').catch(() => ({ default: () => <Placeholder title="Transactions" /> })));
const SellerPayments = React.lazy(() => import('./pages/seller/Payments.jsx').catch(() => ({ default: () => <Placeholder title="Payment Settings" /> })));
const SellerPricing = React.lazy(() => import('./pages/seller/Pricing.jsx').catch(() => ({ default: () => <Placeholder title="Pricing Management" /> })));
const SellerAnalytics = React.lazy(() => import('./pages/seller/Analytics.jsx').catch(() => ({ default: () => <Placeholder title="Analytics" /> })));
const SellerOrderDetails = React.lazy(() => import('./pages/seller/OrderDetails.jsx').catch(() => ({ default: () => <Placeholder title="Seller Order Details" /> })));
const Support = React.lazy(() => import('./pages/common/Support.jsx').catch(() => ({ default: () => <Placeholder title="Support" /> })));
const Settings = React.lazy(() => import('./pages/common/Settings.jsx').catch(() => ({ default: () => <Placeholder title="Settings" /> })));

const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard.jsx').catch(() => ({ default: () => <Placeholder title="Admin Dashboard" /> })));
const AdminUsers = React.lazy(() => import('./pages/admin/Users.jsx').catch(() => ({ default: () => <Placeholder title="User Management" /> })));
const AdminProducts = React.lazy(() => import('./pages/admin/Products.jsx').catch(() => ({ default: () => <Placeholder title="Product Verification" /> })));
const AdminOrders = React.lazy(() => import('./pages/admin/Orders.jsx').catch(() => ({ default: () => <Placeholder title="Global Orders" /> })));

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/shop" replace />;
  if (user.role === 'SELLER') return <Navigate to="/seller/dashboard" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/shop" replace />;
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showIntro, setShowIntro] = React.useState(true);
  
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'organic';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-brand-primary animate-pulse font-display text-xl">Initializing AgroMart...</div>
      </div>
    );
  }

  const hasSidebar = user && (user.role === 'SELLER' || user.role === 'ADMIN');

  return (
    <div className="min-h-screen flex flex-col bg-bg-main text-text-primary relative overflow-hidden font-sans">
      <AnimatePresence>
        {showIntro && <BrandIntro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* 3D Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-900/20 blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-teal-400/5 blur-[100px]" />
      </div>

      <Navbar onLogoClick={() => setShowIntro(true)} />
      <div className="flex flex-1 pt-16 relative z-10">
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
                <Route path="/" element={<HomeRedirect />} />

                {/* Shared Authenticated Routes */}
                <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']} />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Customer Routes */}
                <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/track-order/:id" element={<TrackOrder />} />
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
                  <Route path="/seller/analytics" element={<SellerAnalytics />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                </Route>

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
              </Routes>
            </React.Suspense>
          </div>
        </main>
      </div>
      <footer className="bg-bg-card border-t border-brand-dark/20 py-8 px-4 text-center text-text-secondary text-sm">
        <p>&copy; 2026 AgroMart - Your Premium Agricultural Network.</p>
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

