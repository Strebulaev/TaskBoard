import type { Task } from './task';

export interface DashboardStats {
  total: number;
  statusCounts: {
    todo: number;
    in_progress: number;
    review: number;
    done: number;
    overdue: number;
  };
  chartData: {
    date: string;
    all: number;
    done: number;
    overdue: number;
  }[];
}

export type UpcomingTasks = Task[];
