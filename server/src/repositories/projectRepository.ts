import { prisma } from '../config/database';

export const projectRepository = {
  async create(data: {
    title: string;
    description?: string;
    repoLink?: string;
    createdBy: string;
  }) {
    return prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        repoLink: data.repoLink,
        createdBy: data.createdBy,
      },
    });
  },

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        creator: true,
        members: {
          include: { user: true },
        },
        tasks: {
          include: {
            creator: true,
            assignee: true,
            reviewer: true,
          },
        },
      },
    });
  },

  async findByUser(userId: string) {
    return prisma.project.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: { user: true },
        },
        tasks: true,
      },
    });
  },

  async update(id: string, data: { title?: string; description?: string; repoLink?: string }) {
    return prisma.project.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  },

  async addMember(projectId: string, userId: string, role: string) {
    return prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: role as 'owner' | 'admin' | 'member',
      },
    });
  },

  async removeMember(projectId: string, userId: string) {
    return prisma.projectMember.delete({
      where: {
        projectId_userId: { projectId, userId },
      },
    });
  },

  async updateMemberRole(projectId: string, userId: string, role: string) {
    return prisma.projectMember.update({
      where: {
        projectId_userId: { projectId, userId },
      },
      data: { role: role as 'owner' | 'admin' | 'member' },
    });
  },

  async getMembers(projectId: string) {
    return prisma.projectMember.findMany({
      where: { projectId },
      include: { user: true },
    });
  },
};
