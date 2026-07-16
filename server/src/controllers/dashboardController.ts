import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardService.js';

export const dashboardController = {
  async getStats(req: Request, res: Response) {
    const { projectId } = req.query;
    const userId = req.userId!;
    const stats = await dashboardService.getStats(projectId as string, userId);
    res.json(stats);
  },

  async getUpcoming(req: Request, res: Response) {
    const { projectId, days } = req.query;
    const userId = req.userId!;
    const tasks = await dashboardService.getUpcomingTasks(
      Number(days) || 1,
      projectId as string,
      userId
    );
    res.json(tasks);
  },
};
