import { Platform } from 'react-native';

const defaultBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3333' : 'http://localhost:3333';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || defaultBaseUrl;

async function request(path, options = {}) {
  const { headers: customHeaders = {}, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || 'Erro ao comunicar com o servidor';
    const error = new Error(message);
    error.status = response.status;
    throw error;
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

export function savePasswordHistory(token, payload) {
  return request('/passwords', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function listPasswordHistory(token) {
  return request('/passwords', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deletePasswordHistory(token, id) {
  return request(`/passwords/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
