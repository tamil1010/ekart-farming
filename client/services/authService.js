import api from './api';

// Mock users for demo
const MOCK_USERS = [
  { id: '1', name: 'Demo Customer', email: 'customer@test.com', password: '123456', role: 'CUSTOMER' },
  { id: '2', name: 'Demo Seller', email: 'seller@test.com', password: '123456', role: 'SELLER' },
  { id: '3', name: 'Demo Admin', email: 'admin@test.com', password: '123456', role: 'ADMIN' },
];

export const authService = {
  login: async (credentials) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = MOCK_USERS.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      const token = 'mock-jwt-token-' + user.id;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    }
    
    throw new Error('Invalid email or password');
  },
  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      role: userData.role || 'CUSTOMER'
    };
    const token = 'mock-jwt-token-' + newUser.id;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { user: newUser, token };
  },
  getCurrentUser: async () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};


