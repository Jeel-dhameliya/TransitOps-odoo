import api from './api';

export const tripApi = {
  getAll: async () => {
    return { data: [
      { id: 1, route: 'NY to LA', vehicleId: 1, driverId: 1, status: 'In-Progress' },
      { id: 2, route: 'Chicago to Miami', vehicleId: 2, driverId: 2, status: 'Pending' }
    ]};
  },
};
