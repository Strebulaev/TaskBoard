import { useEffect } from 'react';
import { useUserStore } from '@store/userStore';

export function useUser() {
  const { user, isLoading, error, fetchUser } = useUserStore();

  useEffect(() => {
    const hasToken = document.cookie.includes('accessToken');
    if (hasToken && !user && !isLoading) {
      fetchUser();
    }
  }, [user, isLoading, fetchUser]);

  return { user, isLoading, error };
}
