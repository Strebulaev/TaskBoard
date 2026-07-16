import type { User } from './user';
import type { Project } from './project';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  deadline?: string;
  projectId: string;
  createdBy: string;
  assigneeId?: string;
  reviewerId?: string;
  createdAt: string;
  updatedAt: string;
  project?: Pick<Project, 'id' | 'title'>;
  assignee?: User;
  reviewer?: User;
  creator?: User;
}
