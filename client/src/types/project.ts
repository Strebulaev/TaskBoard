import type { User } from './user';
import type { Task } from './task';

export interface Project {
  id: string;
  title: string;
  description?: string;
  repoLink?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members?: {
    userId: string;
    role: string;
    user: User;
  }[];
  tasks?: Task[];
}
