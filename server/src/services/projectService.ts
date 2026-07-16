import { projectRepository } from '../repositories/projectRepository';

export const projectService = {
  async createProject(data: {
    title: string;
    description?: string;
    repoLink?: string;
    userId: string;
  }) {
    const project = await projectRepository.create({
      title: data.title,
      description: data.description,
      repoLink: data.repoLink,
      createdBy: data.userId,
    });

    await projectRepository.addMember(project.id, data.userId, 'owner');
    return project;
  },

  async getProjectById(id: string) {
    return projectRepository.findById(id);
  },

  async getUserProjects(userId: string) {
    return projectRepository.findByUser(userId);
  },

  async updateProject(
    id: string,
    data: { title?: string; description?: string; repoLink?: string },
    userId: string
  ) {
    const project = await projectRepository.findById(id);
    if (!project) throw new Error('Project not found');

    const member = project.members.find((m) => m.userId === userId);
    if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
      throw new Error('Not authorized');
    }

    return projectRepository.update(id, data);
  },

  async deleteProject(id: string, userId: string) {
    const project = await projectRepository.findById(id);
    if (!project) throw new Error('Project not found');

    const member = project.members.find((m) => m.userId === userId);
    if (!member || member.role !== 'owner') {
      throw new Error('Only owner can delete project');
    }

    return projectRepository.delete(id);
  },

  async addMember(projectId: string, userId: string, role: string, currentUserId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new Error('Project not found');

    const member = project.members.find((m) => m.userId === currentUserId);
    if (!member || member.role !== 'owner') {
      throw new Error('Only owner can add members');
    }

    return projectRepository.addMember(projectId, userId, role);
  },

  async removeMember(projectId: string, userId: string, currentUserId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new Error('Project not found');

    const member = project.members.find((m) => m.userId === currentUserId);
    if (!member || member.role !== 'owner') {
      throw new Error('Only owner can remove members');
    }

    return projectRepository.removeMember(projectId, userId);
  },

  async updateMemberRole(projectId: string, userId: string, role: string, currentUserId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new Error('Project not found');

    const member = project.members.find((m) => m.userId === currentUserId);
    if (!member || member.role !== 'owner') {
      throw new Error('Only owner can change roles');
    }

    return projectRepository.updateMemberRole(projectId, userId, role);
  },

  async getProjectMembers(projectId: string) {
    return projectRepository.getMembers(projectId);
  },
};
