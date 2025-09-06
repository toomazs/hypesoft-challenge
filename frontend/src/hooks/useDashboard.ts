import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos
  });
};
