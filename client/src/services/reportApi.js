import api from './api';

export const reportApi = {
  getDashboardKPIs: () => api.get('/reports/dashboard'),
  getVehicleFinancials: () => api.get('/reports/financials'),
  exportFinancialsCSV: async () => {
    const response = await api.get('/reports/financials/export/csv', { responseType: 'blob' });
    return response;
  },
};
