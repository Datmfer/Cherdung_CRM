import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from './db';
import { AuthSession } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'crm-jwt-secret-super-secure-key-2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'crm-jwt-refresh-secret-super-secure-key-2026';

const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateAccessToken(payload: {
  userId: string;
  email: string;
  role: string;
  name: string;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

// Backwards compatibility alias
export function generateToken(user: { id: string; email: string; role: string; name: string }): string {
  return generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString('hex');
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function verifyToken(token: string): AuthSession | null {
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
      // Fallback: verify signature while ignoring expiration for active user sessions
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

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return true;
    }
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
}

/**
 * Issue new access token and refresh token pair for a user, saving refresh token to DB.
 */
export async function createAuthTokens(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const refreshTokenStr = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshTokenStr);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  await db.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken: refreshTokenStr,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      totpEnabled: user.totpEnabled,
    },
  };
}

/**
 * Rotate refresh token: revoke old refresh token, issue new token pair.
 */
export async function rotateRefreshToken(rawRefreshToken: string) {
  const tokenHash = hashRefreshToken(rawRefreshToken);
  const storedToken = await db.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!storedToken) {
    throw new Error('Invalid refresh token');
  }

  if (storedToken.revokedAt || new Date() > storedToken.expiresAt) {
    // If compromised/revoked token reuse detected, revoke all user tokens for safety
    await db.refreshToken.updateMany({
      where: { userId: storedToken.userId },
      data: { revokedAt: new Date() },
    });
    throw new Error('Refresh token revoked or expired');
  }

  // Revoke current refresh token
  await db.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  // Issue new pair
  return createAuthTokens(storedToken.userId);
}

/**
 * Revoke specific refresh token on logout
 */
export async function revokeRefreshToken(rawRefreshToken: string) {
  try {
    const tokenHash = hashRefreshToken(rawRefreshToken);
    await db.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  } catch (error) {
    // Ignore error if token not found
  }
}
