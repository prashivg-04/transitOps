import apiClient from '../client';

export const driverService = {
  getDrivers: async (skip = 0, limit = 20) => {
    const response = await apiClient.get('/drivers', { params: { skip, limit } });
    return response.data;
  },

  getAvailableDrivers: async (skip = 0, limit = 20) => {
    const response = await apiClient.get('/drivers/available', { params: { skip, limit } });
    return response.data;
  },

  getDriver: async (id) => {
    const response = await apiClient.get(`/drivers/${id}`);
    return response.data;
  },

  createDriver: async (driverData) => {
    const response = await apiClient.post('/drivers', driverData);
    return response.data;
  },

  updateDriver: async (id, driverData) => {
    const response = await apiClient.put(`/drivers/${id}`, driverData);
    return response.data;
  },

  deleteDriver: async (id) => {
    const response = await apiClient.delete(`/drivers/${id}`);
    return response.data;
  },
};

export default driverService;