import api from './api';

export const tripApi = {
  getAll: () => api.get('/trips'),
  create: (data) => api.post('/trips', data),
  getById: (id) => api.get(`/trips/${id}`),
  dispatch: (id) => api.put(`/trips/${id}/dispatch`),
  complete: (id, finalOdometer) => api.put(`/trips/${id}/complete`, { finalOdometer: finalOdometer !== undefined ? Number(finalOdometer) : undefined }),
  cancel: (id) => api.put(`/trips/${id}/cancel`),
};
