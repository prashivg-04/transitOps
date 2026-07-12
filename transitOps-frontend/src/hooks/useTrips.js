import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '../api';

export const useTrips = (skip = 0, limit = 20) => {
  return useQuery({
    queryKey: ['trips', skip, limit],
    queryFn: () => tripService.getTrips(skip, limit),
  });
};

export const useTrip = (id) => {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripService.getTrip(id),
    enabled: !!id,
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripData) => tripService.createTrip(tripData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tripData }) => tripService.updateTrip(id, tripData),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => tripService.deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
};

export const useDispatchTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dispatchData }) => tripService.dispatchTrip(id, dispatchData),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
    },
  });
};

export const useCompleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completeData }) => tripService.completeTrip(id, completeData),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useCancelTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => tripService.cancelTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};