import { apiClient } from './client';
import type { Project } from '@/types/project';

export const projectsApi = {
  getAll: (): Promise<Project[]> => apiClient.get('/projects'),
  getById: (id: string): Promise<Project> => apiClient.get(`/projects/${id}`),
  getMembers: (projectId: string): Promise<Project['members']> =>
    apiClient.get(`/projects/${projectId}/members`),
  create: (data: { title: string; description?: string; repoLink?: string }) =>
    apiClient.post('/projects', data),
  update: (id: string, data: { title?: string; description?: string; repoLink?: string }) =>
    apiClient.put(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
  addMember: (projectId: string, userId: string, role: string) =>
    apiClient.post(`/projects/${projectId}/members`, { userId, role }),
  removeMember: (projectId: string, userId: string) =>
    apiClient.delete(`/projects/${projectId}/members/${userId}`),
  updateMemberRole: (projectId: string, userId: string, role: string) =>
    apiClient.put(`/projects/${projectId}/members/${userId}`, { role }),
};
