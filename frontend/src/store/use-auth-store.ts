import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/types/auth';

type AuthState = {
  user: User | null;
  changeUser: (newUser: User) => void;
  token: string | null;
  changeToken: (newToken: string) => void;
  logout: () => void;
};

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      changeUser: (newUser: User) =>
        set(() => ({
          user: newUser,
        })),
      token: null,
      changeToken: (newToken: string) =>
        set(() => ({
          token: newToken,
        })),
      logout: () =>
        set(() => ({
          user: null,
          token: null,
        })),
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;
