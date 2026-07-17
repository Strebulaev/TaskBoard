import { prisma } from '../config/database.js';
import { Status } from '@prisma/client';

export const taskRepository = {
  async create(data: {
    title: string;
    description?: string;
    status: Status;
    deadline?: Date;
    projectId: string;
    createdBy: string;
    assigneeId?: string;
    reviewerId?: string;
  }) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        deadline: data.deadline,
        projectId: data.projectId,
        createdBy: data.createdBy,
        assigneeId: data.assigneeId,
        reviewerId: data.reviewerId,
      },
      include: {
        creator: true,
        assignee: true,
        reviewer: true,
        project: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        creator: true,
        assignee: true,
        reviewer: true,
        project: {
          include: {
            members: true,
          },
        },
      },
    });
  },

  async findByProject(projectId: string, filters?: { status?: string; search?: string }) {
    const where: {
      projectId: string;
      status?: Status;
      title?: { contains: string };
    } = { projectId };

    if (filters?.status && filters.status !== 'overdue') {
      where.status = filters.status as Status;
    }

    if (filters?.search) {
      where.title = { contains: filters.search };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        creator: true,
        assignee: true,
        reviewer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (filters?.status === 'overdue') {
      const now = new Date();
      return tasks.filter((task) => task.deadline && task.deadline < now && task.status !== 'done');
    }

    return tasks;
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: Status;
      deadline?: Date;
      assigneeId?: string;
      reviewerId?: string;
    }
  ) {
    return prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        deadline: data.deadline,
        assigneeId: data.assigneeId,
        reviewerId: data.reviewerId,
      },
      include: {
        creator: true,
        assignee: true,
        reviewer: true,
        project: true,
      },
    });
  },

  async delete(id: string) {
    return prisma.task.delete({ where: { id } });
  },

  async getByUser(userId: string) {
    return prisma.task.findMany({
      where: {
        OR: [{ createdBy: userId }, { assigneeId: userId }, { reviewerId: userId }],
      },
      include: {
        creator: true,
        assignee: true,
        reviewer: true,
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
