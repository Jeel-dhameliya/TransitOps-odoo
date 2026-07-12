import api from './api';

export const driverApi = {
  getAll: () => api.get('/drivers'),
  create: (data) => api.post('/drivers', data),
  delete: (id) => api.delete(`/drivers/${id}`),
};
