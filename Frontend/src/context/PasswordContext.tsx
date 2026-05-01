import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import type { ReactNode } from 'react';
import { API_BASE_URL } from '../services/api';
import { useAuth } from './AuthContext';
import type { LocalPasswordEntry, PasswordHistoryEntry } from '../types';

type PasswordState = {
  items: LocalPasswordEntry[];
  loading: boolean;
  isOnline: boolean;
  syncing: boolean;
};

type PasswordAction =
  | { type: 'LOAD_ITEMS'; payload: LocalPasswordEntry[] }
  | { type: 'ADD_ITEM'; payload: LocalPasswordEntry }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'MARK_SYNCED'; payload: { localId: string; remoteId: number } }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'RESET' };

type PasswordContextType = {
  items: LocalPasswordEntry[];
  loading: boolean;
  isOnline: boolean;
  syncing: boolean;
  addPassword: (appName: string, password: string) => Promise<void>;
  removePassword: (localId: string) => Promise<void>;
  syncPending: () => Promise<void>;
};

const PASSWORD_STORAGE_KEY = 'passwordHistoryLocal';

const initialState: PasswordState = {
  items: [],
  loading: true,
  isOnline: false,
  syncing: false,
};

function passwordReducer(state: PasswordState, action: PasswordAction): PasswordState {
  switch (action.type) {
    case 'LOAD_ITEMS':
      return { ...state, items: action.payload, loading: false };
    case 'ADD_ITEM':
      return { ...state, items: [action.payload, ...state.items] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case 'MARK_SYNCED':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.localId
            ? { ...item, syncStatus: 'synced', remoteId: action.payload.remoteId }
            : item
        ),
      };
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'SET_SYNCING':
      return { ...state, syncing: action.payload };
    case 'RESET':
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

const PasswordContext = createContext<PasswordContextType | null>(null);

function toLocalEntry(entry: PasswordHistoryEntry): LocalPasswordEntry {
  const baseId = typeof entry.id === 'number' ? entry.id : Number(entry.id);
  return {
    id: `remote-${baseId}`,
    appName: entry.appName,
    password: entry.password,
    createdAt: entry.createdAt || new Date().toISOString(),
    syncStatus: 'synced',
    remoteId: Number.isFinite(baseId) ? baseId : undefined,
  };
}

function buildLocalId() {
  return `local-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function PasswordProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(passwordReducer, initialState);
  const { token } = useAuth();
  const isSyncingRef = useRef(false);

  useEffect(() => {
    async function loadLocal() {
      try {
        const raw = await AsyncStorage.getItem(PASSWORD_STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as LocalPasswordEntry[]) : [];
        dispatch({ type: 'LOAD_ITEMS', payload: parsed });
      } catch {
        dispatch({ type: 'LOAD_ITEMS', payload: [] });
      }
    }
    loadLocal();
  }, []);

  useEffect(() => {
    if (!state.loading) {
      AsyncStorage.setItem(PASSWORD_STORAGE_KEY, JSON.stringify(state.items)).catch(() => {
        return;
      });
    }
  }, [state.items, state.loading]);

  const syncPending = useCallback(async () => {
    if (!token || !state.isOnline || isSyncingRef.current) return;
    const pending = state.items.filter((item) => item.syncStatus === 'pending');
    if (pending.length === 0) return;

    isSyncingRef.current = true;
    dispatch({ type: 'SET_SYNCING', payload: true });

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

          dispatch({
            type: 'MARK_SYNCED',
            payload: {
              localId: item.id,
              remoteId: Number(response.data.id),
            },
          });
        } catch {
          // Mantem pendente para nova tentativa automatica.
        }
      }
    } finally {
      isSyncingRef.current = false;
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  }, [state.items, state.isOnline, token]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netState) => {
      const connected = Boolean(netState.isConnected && netState.isInternetReachable !== false);
      dispatch({ type: 'SET_ONLINE', payload: connected });
      if (connected) {
        syncPending();
      }
    });

    NetInfo.fetch().then((netState) => {
      const connected = Boolean(netState.isConnected && netState.isInternetReachable !== false);
      dispatch({ type: 'SET_ONLINE', payload: connected });
      if (connected) {
        syncPending();
      }
    });

    return unsubscribe;
  }, [syncPending]);

  useEffect(() => {
    if (!token) {
      dispatch({ type: 'RESET' });
    }
  }, [token]);

  const addPassword = useCallback(async (appName: string, password: string) => {
    const entry: LocalPasswordEntry = {
      id: buildLocalId(),
      appName: appName.trim(),
      password,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending',
    };

    dispatch({ type: 'ADD_ITEM', payload: entry });
  }, []);

  const removePassword = useCallback(
    async (localId: string) => {
      const target = state.items.find((item) => item.id === localId);
      if (!target) return;

      if (token && state.isOnline && target.remoteId) {
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

      dispatch({ type: 'REMOVE_ITEM', payload: localId });
    },
    [state.items, state.isOnline, token]
  );

  const value = useMemo(
    () => ({
      items: state.items,
      loading: state.loading,
      isOnline: state.isOnline,
      syncing: state.syncing,
      addPassword,
      removePassword,
      syncPending,
    }),
    [state.items, state.loading, state.isOnline, state.syncing, addPassword, removePassword, syncPending]
  );

  return <PasswordContext.Provider value={value}>{children}</PasswordContext.Provider>;
}

export function usePasswords() {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error('usePasswords deve ser usado dentro de PasswordProvider');
  }
  return context;
}

export function hydrateFromServerHistory(entries: PasswordHistoryEntry[]) {
  return entries.map(toLocalEntry);
}
