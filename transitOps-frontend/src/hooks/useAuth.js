import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (data) => {
      // data is already unwrapped by authService: { access_token, refresh_token, token_type, user }
      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      if (data?.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData) => authService.register(userData),
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    queryClient.clear();
  };
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};