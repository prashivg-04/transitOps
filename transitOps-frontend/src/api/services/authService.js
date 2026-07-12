import apiClient from '../client';

export const authService = {
  // Login uses application/x-www-form-urlencoded (OAuth2 password flow)
  // Backend wraps response as: { success, message, data: { access_token, refresh_token, token_type, user } }
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);   // backend OAuth2 field is 'username'
    formData.append('password', password);

    const response = await apiClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    // The backend may return the token directly (not wrapped) for OAuth2 login
    // Try both wrapped and unwrapped formats
    const payload = response.data?.data ?? response.data;
    return payload;
  },

  // Register uses application/json
  // Required fields: full_name, email, password, role
  // Role must be one of: "Fleet Manager" | "Dispatcher" | "Safety Officer" | "Financial Analyst"
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    const payload = response.data?.data ?? response.data;
    return payload;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    const payload = response.data?.data ?? response.data;
    return payload;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    const payload = response.data?.data ?? response.data;
    return payload;
  },
};

export default authService;