const API_BASE = '/api';

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${API_BASE}${url}`, {
      credentials: 'include',
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  delete: async <T>(url: string): Promise<T | null> => {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return null;
  },
};
