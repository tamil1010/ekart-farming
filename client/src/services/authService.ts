import api from './api';

export const authService = {
  login: async (credentials: any) => {
    // Simulated API call
    console.log('Logging in with:', credentials);
    
    // Check if there's a registered role in local storage
    const email = credentials.email.toLowerCase();
    const usersMap = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const registeredRole = usersMap[email];
    
    // Logic to decide role based on database mapping OR email keywords
    let role: 'ADMIN' | 'SELLER' | 'CUSTOMER' = registeredRole || 'CUSTOMER';
    let name = role === 'SELLER' ? 'John Farmer' : role === 'ADMIN' ? 'Admin User' : 'Rahul K.';

    // Email keywords fallback for new/unregistered sessions in dev
    if (!usersMap[email]) {
      if (email.includes('admin')) {
        role = 'ADMIN';
        name = 'Admin User';
      } else if (email.includes('seller') || email.includes('farmer')) {
        role = 'SELLER';
        name = 'John Farmer';
      } else if (email.includes('customer')) {
        role = 'CUSTOMER';
        name = 'Rahul K.';
      }
    }

    return {
      token: 'mock-jwt-token',
      user: {
        id: btoa(credentials.email).replace(/=/g, ''), // Deterministic ID based on email
        name,
        email: credentials.email,
        role: role,
      }
    };
  },
  register: async (data: any) => {
    console.log('Registering user:', data);
    return { message: 'Success' };
  }
};
