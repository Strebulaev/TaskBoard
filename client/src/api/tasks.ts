import { apiClient } from './client';

export const tasksApi = {
  getMy: () => apiClient.get('/tasks/my'),
  getByProject: (projectId: string, params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    return apiClient.get(`/tasks/project/${projectId}?${query.toString()}`);
  },
  getById: (id: string) => apiClient.get(`/tasks/${id}`),

  create: (data: {
    title: string;
    description?: string;
    status?: string;
    deadline?: string;
    projectId: string;
    assigneeId?: string;
    reviewerId?: string;
  }) => apiClient.post('/tasks', data),
  update: (
    id: string,
    data: {
      title?: string;
      description?: string;
      deadline?: string;
      assigneeId?: string | null;
      reviewerId?: string | null;
    }
  ) => apiClient.put(`/tasks/${id}`, data),
  delete: (id: string) => apiClient.delete(`/tasks/${id}`),

  updateStatus: (id: string, status: string) => apiClient.put(`/tasks/${id}/status`, { status }),

  assignAssignee: (id: string, assigneeId: string | null) =>
    apiClient.put(`/tasks/${id}/assignee`, { assigneeId }),
  assignReviewer: (id: string, reviewerId: string | null) =>
    apiClient.put(`/tasks/${id}/reviewer`, { reviewerId }),
};
