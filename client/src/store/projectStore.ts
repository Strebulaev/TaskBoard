import { create } from 'zustand';

interface Project {
  id: string;
  title: string;
  description?: string;
  repoLink?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: Array<{
    userId: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    deadline?: string;
  }>;
}

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (data: {
    title: string;
    description?: string;
    repoLink?: string;
  }) => Promise<void>;
  updateProject: (
    id: string,
    data: { title?: string; description?: string; repoLink?: string }
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/projects', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      set({ projects: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        isLoading: false,
      });
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch project');
      const data = await response.json();
      set({ currentProject: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch project',
        isLoading: false,
      });
    }
  },

  createProject: async (data: { title: string; description?: string; repoLink?: string }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create project');
      const newProject = await response.json();
      set((state) => ({ projects: [...state.projects, newProject], isLoading: false }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create project',
        isLoading: false,
      });
    }
  },

  updateProject: async (
    id: string,
    data: { title?: string; description?: string; repoLink?: string }
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update project');
      const updatedProject = await response.json();
      set((state) => ({
        projects: state.projects.map((project) => (project.id === id ? updatedProject : project)),
        currentProject: updatedProject,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update project',
        isLoading: false,
      });
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete project',
        isLoading: false,
      });
    }
  },
}));
