import api from './api';

export const vehicleApi = {
  getAll: () => api.get('/vehicles'),
  create: (data) => api.post('/vehicles', data),
};
