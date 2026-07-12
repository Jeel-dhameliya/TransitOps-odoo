import api from './api';

export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return {
      data: {
        token: response.data.token,
        user: {
          name: response.data.email.split('@')[0],
          role: response.data.role
        }
      }
    };
  },
  register: async (credentials) => {
    const response = await api.post('/auth/register', credentials);
    return {
      data: {
        token: response.data.token,
        user: {
          name: response.data.email.split('@')[0],
          role: response.data.role
        }
      }
    };
  },
};
