import { Request, Response } from 'express';
import { taskService } from '../services/taskService';

export const taskController = {
  async create(req: Request, res: Response) {
    const { title, description, status, deadline, projectId, assigneeId, reviewerId } = req.body;
    const userId = req.userId!;

    const task = await taskService.createTask({
      title,
      description,
      status,
      deadline: deadline ? new Date(deadline) : undefined,
      projectId,
      createdBy: userId,
      assigneeId,
      reviewerId,
    });

    res.status(201).json(task);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const task = await taskService.getTaskById(id as string);
    res.json(task);
  },

  async getByProject(req: Request, res: Response) {
    const { projectId } = req.params;
    const { status, search } = req.query;

    const tasks = await taskService.getProjectTasks(projectId as string, {
      status: status as string,
      search: search as string,
    });

    res.json(tasks);
  },

  async getMyTasks(req: Request, res: Response) {
    const userId = req.userId!;
    const tasks = await taskService.getUserTasks(userId);
    res.json(tasks);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, deadline, assigneeId, reviewerId } = req.body;
    const userId = req.userId!;

    const task = await taskService.updateTask(
      id as string,
      {
        title,
        description,
        deadline: deadline ? new Date(deadline) : undefined,
        assigneeId,
        reviewerId,
      },
      userId
    );

    res.json(task);
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.userId!;

    await taskService.deleteTask(id as string, userId);
    res.status(204).send();
  },

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId!;

    const task = await taskService.updateStatus(id as string, status, userId);
    res.json(task);
  },

  async assignAssignee(req: Request, res: Response) {
    const { id } = req.params;
    const { assigneeId } = req.body;
    const userId = req.userId!;

    const task = await taskService.assignAssignee(id as string, assigneeId || null, userId);
    res.json(task);
  },

  async assignReviewer(req: Request, res: Response) {
    const { id } = req.params;
    const { reviewerId } = req.body;
    const userId = req.userId!;

    const task = await taskService.assignReviewer(id as string, reviewerId || null, userId);
    res.json(task);
  },
};
