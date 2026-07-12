import apiClient from '../client';

export const reportService = {
  getFuelEfficiencyReport: async () => {
    const response = await apiClient.get('/reports/fuel-efficiency');
    return response.data;
  },

  getFleetUtilizationReport: async () => {
    const response = await apiClient.get('/reports/fleet-utilization');
    return response.data;
  },

  getVehicleROIReport: async (vehicleId) => {
    const response = await apiClient.get('/reports/vehicle-roi', { params: { vehicle_id: vehicleId } });
    return response.data;
  },

  getTripSummaryReport: async () => {
    const response = await apiClient.get('/reports/trip-summary');
    return response.data;
  },

  getDriverSummaryReport: async () => {
    const response = await apiClient.get('/reports/driver-summary');
    return response.data;
  },
};

export default reportService;