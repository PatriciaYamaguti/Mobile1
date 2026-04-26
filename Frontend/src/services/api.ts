import { Platform } from 'react-native';
import type {
  AppError,
  AuthResponse,
  PasswordHistoryEntry,
  PasswordPayload,
  SignInPayload,
  SignUpPayload,
} from '../types';

const defaultBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3333' : 'http://localhost:3333';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || defaultBaseUrl;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { headers: customHeaders = {}, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  });

  let data: unknown = null;
  try {
    data = (await response.json()) as T;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message?: string }).message || 'Erro ao comunicar com o servidor')
        : 'Erro ao comunicar com o servidor';
    const error: AppError = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data as T;
}

export function signup(payload: SignUpPayload) {
  return request<AuthResponse>('/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function signin(payload: SignInPayload) {
  return request<AuthResponse>('/signin', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function signout(token: string) {
  return request<{ message?: string }>('/signout', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function savePasswordHistory(token: string, payload: PasswordPayload) {
  return request<PasswordHistoryEntry>('/passwords', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function listPasswordHistory(token: string) {
  return request<PasswordHistoryEntry[]>('/passwords', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deletePasswordHistory(token: string, id: number) {
  return request<{ message?: string }>(`/passwords/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
