import { useUserStore } from '@store/userStore';
import { useEffect } from 'react';

export function useUser() {
  const { user, isLoading, error, fetchUser, clearUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isLoading, error, clearUser, refetch: fetchUser };
}
