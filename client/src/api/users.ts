import { apiClient } from './client';

export const usersApi = {
  getById: (id: string) => apiClient.get(`/users/${id}`),
  update: (id: string, data: { name?: string; description?: string }) =>
    apiClient.put(`/users/${id}`, data),
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return fetch(`/api/users/${id}/avatar`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    });
  },
  deleteAvatar: (id: string) => apiClient.delete(`/users/${id}/avatar`),
};
