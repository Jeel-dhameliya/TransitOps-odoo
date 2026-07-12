import api from './api';

export const maintenanceApi = {
  getAll: () => api.get('/maintenance'),
  create: (data) => api.post('/maintenance', data),
  close: (id) => api.put(`/maintenance/${id}/close`),
};
