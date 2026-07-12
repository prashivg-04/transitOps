import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../api';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getDashboardStats(),
    refetchInterval: 30000,
  });
};