import api from './api';

export const vehicleApi = {
  getAll: async () => {
    // Mock data
    return { data: [
      { id: 1, registration: 'AB12 CDE', make: 'Volvo', model: 'FH16', status: 'Active' },
      { id: 2, registration: 'FG34 HIJ', make: 'Scania', model: 'R500', status: 'In-Maintenance' }
    ]};
  },
};
