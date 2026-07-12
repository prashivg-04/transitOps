import apiClient from '../client';

export const tripService = {
  getTrips: async (skip = 0, limit = 20) => {
    const response = await apiClient.get('/trips', { params: { skip, limit } });
    return response.data;
  },

  getTrip: async (id) => {
    const response = await apiClient.get(`/trips/${id}`);
    return response.data;
  },

  createTrip: async (tripData) => {
    const response = await apiClient.post('/trips', tripData);
    return response.data;
  },

  updateTrip: async (id, tripData) => {
    const response = await apiClient.put(`/trips/${id}`, tripData);
    return response.data;
  },

  deleteTrip: async (id) => {
    const response = await apiClient.delete(`/trips/${id}`);
    return response.data;
  },

  dispatchTrip: async (id, dispatchData) => {
    const response = await apiClient.post(`/trips/${id}/dispatch`, dispatchData);
    return response.data;
  },

  completeTrip: async (id, completeData) => {
    const response = await apiClient.post(`/trips/${id}/complete`, completeData);
    return response.data;
  },

  cancelTrip: async (id) => {
    const response = await apiClient.post(`/trips/${id}/cancel`);
    return response.data;
  },
};

export default tripService;