/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  sellerId: string;
  unit: string;
  lastUpdated?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerType: 'Registered' | 'Guest';
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  status: 'PENDING' | 'ACCEPTED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentDate?: string;
  transactionId?: string;
  createdAt: string;
  date: string;
  shippingAddress?: {
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    addressType: 'Home' | 'Work';
  };
  paymentMethod: 'COD' | 'UPI' | 'Card' | 'Net Banking';
  trackingId?: string;
  courierPartner?: string;
  timeline: {
    status: string;
    time: string;
    date: string;
    active: boolean;
    completed: boolean;
  }[];
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  date: string;
  method: 'COD' | 'UPI' | 'Card' | 'Net Banking';
}

export interface Payout {
  id: string;
  amount: number;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  requestDate: string;
  paymentDate?: string;
  method: 'Bank' | 'UPI';
  accountDetail: string;
}

export interface CartItem extends Product {
  quantity: number;
}
