import { create } from 'zustand';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  deadline?: string;
  projectId: string;
  createdBy: string;
  assigneeId?: string;
  reviewerId?: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    title: string;
  };
  creator?: {
    id: string;
    name: string;
  };
  assignee?: {
    id: string;
    name: string;
  };
  reviewer?: {
    id: string;
    name: string;
  };
}

interface CreateTaskData {
  title: string;
  description?: string;
  status: string;
  deadline?: string;
  projectId: string;
  assigneeId?: string;
  reviewerId?: string;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
  deadline?: string;
  assigneeId?: string;
  reviewerId?: string;
}

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTasksByProject: (
    projectId: string,
    filters?: { status?: string; search?: string }
  ) => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tasks/my', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      set({ tasks: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        isLoading: false,
      });
    }
  },

  fetchTasksByProject: async (
    projectId: string,
    filters?: { status?: string; search?: string }
  ) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      const url = `/api/tasks/project/${projectId}${
        params.toString() ? '?' + params.toString() : ''
      }`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch project tasks');
      const data = await response.json();
      set({ tasks: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch project tasks',
        isLoading: false,
      });
    }
  },

  createTask: async (data: CreateTaskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      set((state) => ({ tasks: [...state.tasks, newTask], isLoading: false }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create task',
        isLoading: false,
      });
    }
  },

  updateTask: async (id: string, data: UpdateTaskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update task',
        isLoading: false,
      });
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete task',
        isLoading: false,
      });
    }
  },

  updateStatus: async (id: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      const updatedTask = await response.json();
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update status',
        isLoading: false,
      });
    }
  },
}));
