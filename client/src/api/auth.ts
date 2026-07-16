import { useUserStore } from '@store/userStore';

export const logout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    useUserStore.getState().clearUser();
  } catch (error) {
    console.error('Logout error:', error);
  }
};
