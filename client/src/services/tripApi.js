import api from './api';

export const tripApi = {
  getAll: () => api.get('/trips'),
  create: (data) => api.post('/trips', data),
  getById: (id) => api.get(`/trips/${id}`),
  updateStatus: (id, status) => api.put(`/trips/${id}/status`, { status }),
};
