import api from './api';

export const authApi = {
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate error for specific passwords
        if (credentials.password && credentials.password !== 'password' && credentials.password !== '********') {
           reject({ response: { data: { message: 'Invalid credentials. Account locked after 5 failed attempts.' } } });
           return;
        }
        resolve({ 
          data: { 
            token: 'mock-jwt-token', 
            user: { 
              name: credentials.email ? credentials.email.split('@')[0] : 'Admin', 
              role: credentials.role || 'Dispatcher' 
            } 
          } 
        });
      }, 800);
    });
  },
};
