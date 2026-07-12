import api from './api';

export const authApi = {
  login: async (credentials) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { token: 'mock-jwt-token', user: { name: 'Admin', role: 'admin' } } });
      }, 1000);
    });
    // return api.post('/auth/login', credentials);
  },
};
