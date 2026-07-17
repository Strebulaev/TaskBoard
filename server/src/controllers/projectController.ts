import { Request, Response } from 'express';
import { projectService } from '../services/projectService';

export const projectController = {
  async create(req: Request, res: Response) {
    const { title, description, repoLink } = req.body;
    const userId = req.userId!;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const project = await projectService.createProject({
      title,
      description,
      repoLink,
      userId,
    });

    res.status(201).json(project);
  },

  async getAll(req: Request, res: Response) {
    const userId = req.userId!;
    const projects = await projectService.getUserProjects(userId);
    res.json(projects);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const project = await projectService.getProjectById(id as string);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, repoLink } = req.body;
    const userId = req.userId!;

    try {
      const project = await projectService.updateProject(
        id as string,
        { title, description, repoLink },
        userId
      );
      res.json(project);
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.userId!;

    try {
      await projectService.deleteProject(id as string, userId);
      res.status(204).send();
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  },

  async addMember(req: Request, res: Response) {
    const { id } = req.params;
    const { userId, role } = req.body;
    const currentUserId = req.userId!;

    try {
      const member = await projectService.addMember(id as string, userId, role, currentUserId);
      res.status(201).json(member);
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  },

  async removeMember(req: Request, res: Response) {
    const { id, userId } = req.params;
    const currentUserId = req.userId!;

    try {
      await projectService.removeMember(id as string, userId as string, currentUserId);
      res.status(204).send();
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  },

  async updateMemberRole(req: Request, res: Response) {
    const { id, userId } = req.params;
    const { role } = req.body;
    const currentUserId = req.userId!;

    try {
      const member = await projectService.updateMemberRole(
        id as string,
        userId as string,
        role,
        currentUserId
      );
      res.json(member);
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  },

  async getMembers(req: Request, res: Response) {
    const { id } = req.params;
    const members = await projectService.getProjectMembers(id as string);
    res.json(members);
  },
};
