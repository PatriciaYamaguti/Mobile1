import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '../types';

type AuthStore = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loadingAuth: boolean;
  login: (nextToken: string, nextUser: User) => void;
  logout: () => void;
  finishHydration: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loadingAuth: true,
      login: (nextToken, nextUser) =>
        set({
          token: nextToken,
          user: nextUser,
          isAuthenticated: true,
          loadingAuth: false,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          loadingAuth: false,
        }),
      finishHydration: () => set({ loadingAuth: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = Boolean(state.token);
        }
        state?.finishHydration();
      },
    }
  )
);
