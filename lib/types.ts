export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'SUPPORT' | 'USER' | 'admin' | 'support' | 'user';
  name: string;
  emailVerified?: string | null;
  avatarUrl?: string | null;
  totpEnabled?: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  stripeStatus?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  role: string;
  name: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  totpCode?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  user?: {
    name: string;
    email: string;
  };
  action: string;
  metadata?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}
