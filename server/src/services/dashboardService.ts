import { prisma } from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const dashboardService = {
  async getStats(projectId?: string, userId?: string) {
    const where: Prisma.TaskWhereInput = {};
    if (projectId) {
      where.projectId = projectId;
    } else if (userId) {
      where.project = {
        members: {
          some: { userId },
        },
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: true,
        reviewer: true,
        creator: true,
        project: true,
      },
    });

    const total = tasks.length;
    const statusCounts = {
      todo: tasks.filter((t) => t.status === 'todo').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      review: tasks.filter((t) => t.status === 'review').length,
      done: tasks.filter((t) => t.status === 'done').length,
      overdue: tasks.filter((t) => t.deadline && t.deadline < new Date() && t.status !== 'done')
        .length,
    };

    const days = 7;
    const dates = Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      return d.toISOString().split('T')[0];
    });

    const chartData = dates.map((date) => {
      const dayTasks = tasks.filter((t) => {
        if (!t.deadline) return false;
        const deadlineDate = t.deadline.toISOString().split('T')[0];
        return deadlineDate === date;
      });

      return {
        date,
        all: dayTasks.length,
        done: dayTasks.filter((t) => t.status === 'done').length,
        overdue: dayTasks.filter(
          (t) => t.deadline && t.deadline < new Date() && t.status !== 'done'
        ).length,
      };
    });

    return {
      total,
      statusCounts,
      chartData,
    };
  },

  async getUpcomingTasks(days: number, projectId?: string, userId?: string) {
    const targetStart = new Date();
    targetStart.setDate(targetStart.getDate() + days - 1);
    targetStart.setHours(0, 0, 0, 0);

    const targetEnd = new Date(targetStart);
    targetEnd.setDate(targetEnd.getDate() + 1);

    const where: Prisma.TaskWhereInput = {
      deadline: {
        gte: targetStart,
        lt: targetEnd,
      },
    };

    if (projectId) {
      where.projectId = projectId;
    } else if (userId) {
      where.project = {
        members: {
          some: { userId },
        },
      };
    }

    return prisma.task.findMany({
      where,
      include: {
        assignee: true,
        reviewer: true,
        creator: true,
        project: true,
      },
      orderBy: { deadline: 'asc' },
    });
  },
};
