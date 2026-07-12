import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../api';

export const useVehicles = (skip = 0, limit = 20, search = null) => {
  return useQuery({
    queryKey: ['vehicles', skip, limit, search],
    queryFn: () => vehicleService.getVehicles(skip, limit, search),
  });
};

export const useAvailableVehicles = (skip = 0, limit = 20) => {
  return useQuery({
    queryKey: ['availableVehicles', skip, limit],
    queryFn: () => vehicleService.getAvailableVehicles(skip, limit),
  });
};

export const useVehiclesByStatus = (status, skip = 0, limit = 20) => {
  return useQuery({
    queryKey: ['vehiclesByStatus', status, skip, limit],
    queryFn: () => vehicleService.getVehiclesByStatus(status, skip, limit),
    enabled: !!status,
  });
};

export const useVehicle = (id) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getVehicle(id),
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleData) => vehicleService.createVehicle(vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, vehicleData }) => vehicleService.updateVehicle(id, vehicleData),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => vehicleService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};