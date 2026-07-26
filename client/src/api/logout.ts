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

export const login = async () => {
  try {
    await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
    });
    useUserStore.getState().clearUser();
  } catch (error) {
    console.error('Login error:', error);
  }
};
