import { apiClient } from './client';
import type { DashboardStats } from '@/types/dashboard';
import type { Task } from '@/types/task';

export const dashboardApi = {
  getStats: (projectId?: string): Promise<DashboardStats> => {
    const query = projectId ? `?projectId=${projectId}` : '';
    return apiClient.get(`/dashboard/stats${query}`);
  },
  getUpcoming: (projectId?: string, days: number = 1): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    params.append('days', String(days));
    return apiClient.get(`/dashboard/upcoming?${params.toString()}`);
  },
};
