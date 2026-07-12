import apiClient from '../client';

export const expenseService = {
  getExpenses: async (skip = 0, limit = 20) => {
    const response = await apiClient.get('/expenses', { params: { skip, limit } });
    return response.data;
  },

  createExpense: async (expenseData) => {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data;
  },

  updateExpense: async (id, expenseData) => {
    const response = await apiClient.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },
};

export default expenseService;