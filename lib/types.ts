export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'support' | 'user';
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  role: 'admin' | 'support' | 'user';
  name: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
