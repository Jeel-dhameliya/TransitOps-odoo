import api from './api';

export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const email = response.data.email || '';
    return {
      data: {
        token: response.data.token,
        user: {
          _id: response.data._id,
          name: email ? email.split('@')[0] : 'User',
          email: email,
          role: response.data.role || credentials.role || 'Driver'
        }
      }
    };
  },

  register: async (credentials) => {
    const response = await api.post('/auth/register', credentials);
    const email = response.data.email || credentials.email || '';
    return {
      data: {
        token: response.data.token,
        user: {
          _id: response.data._id,
          name: email ? email.split('@')[0] : 'User',
          email: email,
          role: response.data.role || credentials.role || 'Driver'
        }
      }
    };
  },
};
