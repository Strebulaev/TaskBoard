import { prisma } from '../config/database.js';

export const userService = {
  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        description: true,
        createdAt: true,
      },
    });
    if (!user) throw new Error('User not found');
    return user;
  },

  async updateUser(id: string, data: { name?: string; description?: string; avatarUrl?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        description: true,
        createdAt: true,
      },
    });
  },
};
