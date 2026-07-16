import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, error: null }),

      updateUser: (data) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...data }, error: null });
        }
      },

      clearUser: () => set({ user: null, error: null }),

      fetchUser: async () => {
        const { isLoading, user } = get();
        if (isLoading || user) return;

        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user');
          }
          const data = await response.json();
          set({ user: data.user, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
