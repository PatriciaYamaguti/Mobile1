export type User = {
  id?: number;
  name?: string;
  email?: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

export type PasswordPayload = {
  appName: string;
  password: string;
};

export type PasswordHistoryEntry = {
  id: number | string;
  appName: string;
  password: string;
  createdAt?: string;
};

export type PasswordSyncStatus = 'pending' | 'synced';

export type LocalPasswordEntry = {
  id: string;
  appName: string;
  password: string;
  createdAt: string;
  syncStatus: PasswordSyncStatus;
  remoteId?: number;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type AppError = Error & {
  status?: number;
};
