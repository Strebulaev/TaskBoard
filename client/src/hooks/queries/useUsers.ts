import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@api/users';
import { useUserStore } from '@store/userStore';
import type { User } from '@store/userStore';

export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
};

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('No id provided');
      return usersApi.getById(id);
    },
    enabled: !!id && id.length > 0,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore.getState();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      usersApi.update(id, data) as Promise<User>,
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      setUser(data);
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore.getState();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      usersApi.uploadAvatar(id, file) as Promise<User>,
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      setUser(data);
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore.getState();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteAvatar(id) as Promise<User>,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      setUser(data);
    },
  });
}
