import apiClient from '../client';

export const fuelService = {
  getFuelLogs: async (skip = 0, limit = 20) => {
    const response = await apiClient.get('/fuel', { params: { skip, limit } });
    return response.data;
  },

  createFuelLog: async (fuelData) => {
    const response = await apiClient.post('/fuel', fuelData);
    return response.data;
  },

  updateFuelLog: async (id, fuelData) => {
    const response = await apiClient.put(`/fuel/${id}`, fuelData);
    return response.data;
  },

  deleteFuelLog: async (id) => {
    const response = await apiClient.delete(`/fuel/${id}`);
    return response.data;
  },
};

export default fuelService;