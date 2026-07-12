import apiClient from '../client';

export const dashboardService = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },
};

export default dashboardService;