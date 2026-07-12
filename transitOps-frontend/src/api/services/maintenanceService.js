import apiClient from '../client';

export const maintenanceService = {
  getMaintenanceRecords: async (skip = 0, limit = 20) => {
    const response = await apiClient.get('/maintenance', { params: { skip, limit } });
    return response.data;
  },

  createMaintenance: async (maintenanceData) => {
    const response = await apiClient.post('/maintenance', maintenanceData);
    return response.data;
  },

  updateMaintenance: async (id, maintenanceData) => {
    const response = await apiClient.put(`/maintenance/${id}`, maintenanceData);
    return response.data;
  },

  deleteMaintenance: async (id) => {
    const response = await apiClient.delete(`/maintenance/${id}`);
    return response.data;
  },

  closeMaintenance: async (id) => {
    const response = await apiClient.post(`/maintenance/${id}/close`);
    return response.data;
  },
};

export default maintenanceService;