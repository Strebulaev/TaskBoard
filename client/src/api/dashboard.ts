import { apiClient } from './client';
import type { DashboardStats } from '@/types/dashboard';
import type { Task } from '@/types/task';

interface DashboardStatsParams {
  projectId?: string;
}

interface UpcomingTasksParams {
  projectId?: string;
  days?: number;
}

export const dashboardApi = {
  getStats: async (params?: DashboardStatsParams): Promise<DashboardStats> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.projectId) {
        queryParams.append('projectId', params.projectId);
      }

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return await apiClient.get<DashboardStats>(`/dashboard/stats${query}`);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw new Error('Unable to load dashboard statistics. Please try again.', { cause: error });
    }
  },

  getUpcoming: async (params?: UpcomingTasksParams): Promise<Task[]> => {
    const days = params?.days ?? 1;

    if (days < 0 || !Number.isInteger(days)) {
      throw new Error('Days must be a positive integer');
    }

    try {
      const queryParams = new URLSearchParams();

      if (params?.projectId) {
        queryParams.append('projectId', params.projectId);
      }
      queryParams.append('days', String(days));

      return await apiClient.get<Task[]>(`/dashboard/upcoming?${queryParams.toString()}`);
    } catch (error) {
      console.error('Failed to fetch upcoming tasks:', error);
      throw new Error('Unable to load upcoming tasks. Please try again.', { cause: error });
    }
  },
};
