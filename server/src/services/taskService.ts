import { taskRepository } from '../repositories/taskRepository';
import { projectRepository } from '../repositories/projectRepository';
import { Status } from '@prisma/client';

export const taskService = {
  async createTask(data: {
    title: string;
    description?: string;
    status?: Status;
    deadline?: Date;
    projectId: string;
    createdBy: string;
    assigneeId?: string;
    reviewerId?: string;
  }) {
    const project = await projectRepository.findById(data.projectId);
    if (!project) throw new Error('Project not found');

    const member = project.members.find((m) => m.userId === data.createdBy);
    if (!member) throw new Error('Not a project member');

    return taskRepository.create({
      title: data.title,
      description: data.description,
      status: data.status || Status.todo,
      deadline: data.deadline,
      projectId: data.projectId,
      createdBy: data.createdBy,
      assigneeId: data.assigneeId,
      reviewerId: data.reviewerId,
    });
  },

  async getTaskById(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error('Task not found');
    return task;
  },

  async getProjectTasks(projectId: string, filters?: { status?: string; search?: string }) {
    return taskRepository.findByProject(projectId, filters);
  },

  async getUserTasks(userId: string) {
    return taskRepository.getByUser(userId);
  },

  async updateTask(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: Status;
      deadline?: Date;
      assigneeId?: string;
      reviewerId?: string;
    },
    userId: string
  ) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error('Task not found');

    const project = await projectRepository.findById(task.projectId);
    const member = project?.members.find((m) => m.userId === userId);

    const isAuthor = task.createdBy === userId;
    const isOwner = member?.role === 'owner';
    const isAdmin = member?.role === 'admin';

    if (!isAuthor && !isOwner && !isAdmin) {
      throw new Error('Not authorized to edit task');
    }

    return taskRepository.update(id, data);
  },

  async deleteTask(id: string, userId: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error('Task not found');

    const project = await projectRepository.findById(task.projectId);
    const member = project?.members.find((m) => m.userId === userId);

    const isAuthor = task.createdBy === userId;
    const isOwner = member?.role === 'owner';
    const isAdmin = member?.role === 'admin';

    if (!isAuthor && !isOwner && !isAdmin) {
      throw new Error('Not authorized to delete task');
    }

    return taskRepository.delete(id);
  },

  async updateStatus(id: string, status: Status, userId: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error('Task not found');

    const isAssignee = task.assigneeId === userId;
    const isReviewer = task.reviewerId === userId;
    const isAuthor = task.createdBy === userId;

    if (!isAssignee && !isReviewer && !isAuthor) {
      throw new Error('Not authorized to change status');
    }

    return taskRepository.update(id, { status });
  },

  async assignAssignee(id: string, assigneeId: string | null, userId: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error('Task not found');

    const project = await projectRepository.findById(task.projectId);
    const member = project?.members.find((m) => m.userId === userId);

    const isAuthor = task.createdBy === userId;
    const isOwner = member?.role === 'owner';
    const isAdmin = member?.role === 'admin';

    if (!isAuthor && !isOwner && !isAdmin) {
      throw new Error('Not authorized to assign assignee');
    }

    return taskRepository.update(id, { assigneeId: assigneeId || undefined });
  },

  async assignReviewer(id: string, reviewerId: string | null, userId: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error('Task not found');

    const project = await projectRepository.findById(task.projectId);
    const member = project?.members.find((m) => m.userId === userId);

    const isAuthor = task.createdBy === userId;
    const isOwner = member?.role === 'owner';
    const isAdmin = member?.role === 'admin';

    if (!isAuthor && !isOwner && !isAdmin) {
      throw new Error('Not authorized to assign reviewer');
    }

    return taskRepository.update(id, { reviewerId: reviewerId || undefined });
  },
};
