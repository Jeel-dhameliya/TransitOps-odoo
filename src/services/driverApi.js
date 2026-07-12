import api from './api';

export const driverApi = {
  getAll: async () => {
    return { data: [
      { id: 1, name: 'John Doe', licenseNumber: 'DL123456', status: 'Available' },
      { id: 2, name: 'Jane Smith', licenseNumber: 'DL654321', status: 'On-Trip' }
    ]};
  },
};
