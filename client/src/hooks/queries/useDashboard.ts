import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@api/dashboard';
import type { DashboardStats } from '@/types/dashboard';

export const dashboardKeys = {
  stats: (projectId?: string) => ['dashboard', 'stats', projectId] as const,
  upcoming: (projectId?: string, days?: number) =>
    ['dashboard', 'upcoming', projectId, days] as const,
};

export function useDashboardStats(projectId?: string) {
  return useQuery<DashboardStats>({
    queryKey: dashboardKeys.stats(projectId),
    queryFn: () => dashboardApi.getStats(projectId),
  });
}

export function useUpcomingTasks(projectId?: string, days: number = 1) {
  return useQuery({
    queryKey: dashboardKeys.upcoming(projectId, days),
    queryFn: () => dashboardApi.getUpcoming(projectId, days),
  });
}
