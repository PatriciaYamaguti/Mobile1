export type User = {
  id?: number;
  name?: string;
  email?: string;
};

export type AuthContextType = {
  token: string | null;
  user: User | null;
  loadingAuth: boolean;
  signIn: (nextToken: string, nextUser: User) => Promise<void>;
  signOut: () => Promise<void>;
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
  id: number;
  appName: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type AppError = Error & {
  status?: number;
};
