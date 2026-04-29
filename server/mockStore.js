// Simple shared in-memory store for demo mode
export const mockUsers = [
  {
    _id: 'mock-customer-1',
    name: 'Test Customer',
    email: 'customer@example.com',
    password: 'password123',
    role: 'CUSTOMER',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock-seller-1',
    name: 'Test Seller',
    email: 'seller@example.com',
    password: 'password123',
    role: 'SELLER',
    createdAt: new Date().toISOString()
  }
];
