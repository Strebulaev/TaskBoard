import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@api/tasks';

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (projectId: string, filters?: { status?: string; search?: string }) =>
    [...taskKeys.lists(), projectId, filters] as const,
  my: () => [...taskKeys.lists(), 'my'] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export function useMyTasks() {
  return useQuery({
    queryKey: taskKeys.my(),
    queryFn: tasksApi.getMy,
  });
}

export function useProjectTasks(projectId: string, filters?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: taskKeys.list(projectId, filters),
    queryFn: () => tasksApi.getByProject(projectId, filters),
    enabled: !!projectId,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.my() });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof tasksApi.update>[1] }) =>
      tasksApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.my() });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      tasksApi.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.my() });
    },
  });
}

export function useAssignAssignee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string | null }) =>
      tasksApi.assignAssignee(id, assigneeId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
    },
  });
}

export function useAssignReviewer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewerId }: { id: string; reviewerId: string | null }) =>
      tasksApi.assignReviewer(id, reviewerId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
    },
  });
}
