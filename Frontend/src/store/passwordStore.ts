import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { API_BASE_URL } from '../services/api';
import type { LocalPasswordEntry, PasswordHistoryEntry } from '../types';

function buildLocalId() {
  return `local-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

type PasswordStore = {
  password: string;
  history: LocalPasswordEntry[];
  isOnline: boolean;
  syncing: boolean;
  setPassword: (value: string) => void;
  addToHistory: (appName: string, password: string) => void;
  clearHistory: () => void;
  removeFromHistory: (localId: string, token: string | null) => Promise<void>;
  setOnline: (value: boolean) => void;
  syncPending: (token: string | null) => Promise<void>;
};

export const usePasswordStore = create<PasswordStore>()(
  persist(
    (set, get) => ({
      password: '',
      history: [],
      isOnline: false,
      syncing: false,
      setPassword: (value) => set({ password: value }),
      addToHistory: (appName, password) => {
        const entry: LocalPasswordEntry = {
          id: buildLocalId(),
          appName: appName.trim(),
          password,
          createdAt: new Date().toISOString(),
          syncStatus: 'pending',
        };
        set((state) => ({ history: [entry, ...state.history] }));
      },
      clearHistory: () => set({ history: [] }),
      removeFromHistory: async (localId, token) => {
        const { history, isOnline } = get();
        const target = history.find((item) => item.id === localId);
        if (!target) return;

        if (token && isOnline && target.remoteId) {
          try {
            await axios.delete(`${API_BASE_URL}/passwords/${target.remoteId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          } catch {
            return;
          }
        }

        set((state) => ({
          history: state.history.filter((item) => item.id !== localId),
        }));
      },
      setOnline: (value) => set({ isOnline: value }),
      syncPending: async (token) => {
        const { history, isOnline, syncing } = get();
        if (!token || !isOnline || syncing) return;

        const pending = history.filter((item) => item.syncStatus === 'pending');
        if (pending.length === 0) return;

        set({ syncing: true });

        try {
          for (const item of pending) {
            try {
              const response = await axios.post<PasswordHistoryEntry>(
                `${API_BASE_URL}/passwords`,
                {
                  appName: item.appName,
                  password: item.password,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              set((state) => ({
                history: state.history.map((entry) =>
                  entry.id === item.id
                    ? { ...entry, syncStatus: 'synced', remoteId: Number(response.data.id) }
                    : entry
                ),
              }));
            } catch {}
          }
        } finally {
          set({ syncing: false });
        }
      },
    }),
    {
      name: 'password-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        password: state.password,
        history: state.history,
      }),
    }
  )
);
