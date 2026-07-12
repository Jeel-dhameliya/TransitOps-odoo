import api from './api';

export const fuelApi = {
  getAll: () => api.get('/fuel'),
  create: (data) => api.post('/fuel', data),
};
