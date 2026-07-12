import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../api';

export const useDrivers = (skip = 0, limit = 20) => {
  return useQuery({
    queryKey: ['drivers', skip, limit],
    queryFn: () => driverService.getDrivers(skip, limit),
  });
};

export const useAvailableDrivers = (skip = 0, limit = 20) => {
  return useQuery({
    queryKey: ['availableDrivers', skip, limit],
    queryFn: () => driverService.getAvailableDrivers(skip, limit),
  });
};

export const useDriver = (id) => {
  return useQuery({
    queryKey: ['driver', id],
    queryFn: () => driverService.getDriver(id),
    enabled: !!id,
  });
};

export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (driverData) => driverService.createDriver(driverData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, driverData }) => driverService.updateDriver(id, driverData),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['driver', id] });
    },
  });
};

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => driverService.deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
};