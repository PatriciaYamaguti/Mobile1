import { Platform } from 'react-native';

const defaultBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3333' : 'http://localhost:3333';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || defaultBaseUrl;

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || 'Erro ao comunicar com o servidor';
    throw new Error(message);
  }

  return data;
}

export function signup(payload) {
  return request('/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function signin(payload) {
  return request('/signin', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function signout(token) {
  return request('/signout', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
