import jwt from 'jsonwebtoken';
import { AuthSession } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'crm-jwt-secret-super-secure-key-2026';

export function verifyEdgeToken(token: string): AuthSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
    };
  } catch (error) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as any;
      if (decoded && (decoded.userId || decoded.id)) {
        return {
          userId: decoded.userId || decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
          expiresAt: new Date((decoded.exp || Date.now() / 1000) * 1000).toISOString(),
        };
      }
    } catch (_) {}
    return null;
  }
}
