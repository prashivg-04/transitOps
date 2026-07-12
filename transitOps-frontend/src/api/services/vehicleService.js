import apiClient from '../client';

export const vehicleService = {
  getVehicles: async (skip = 0, limit = 20, search = null) => {
    const params = { skip, limit };
    if (search) params.search = search;
    const response = await apiClient.get('/vehicles', { params });
    return response.data;
  },

  getAvailableVehicles: async (skip = 0, limit = 20) => {
    const response = await apiClient.get('/vehicles/available', { params: { skip, limit } });
    return response.data;
  },

  getVehiclesByStatus: async (status, skip = 0, limit = 20) => {
    const response = await apiClient.get(`/vehicles/status/${status}`, { params: { skip, limit } });
    return response.data;
  },

  getVehicle: async (id) => {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await apiClient.post('/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const response = await apiClient.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await apiClient.delete(`/vehicles/${id}`);
    return response.data;
  },
};

export default vehicleService;