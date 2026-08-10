import { db } from './db';
import { User as UserType } from './types';
import { hashPassword } from './auth';

export async function getUsers(): Promise<UserType[]> {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toUpperCase() as any,
      emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
      avatarUrl: user.avatarUrl,
      totpEnabled: user.totpEnabled,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching users from DB:', error);
    return [];
  }
}

export async function findUserByEmail(email: string) {
  try {
    return await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  } catch (error) {
    return null;
  }
}

export async function findUserById(id: string) {
  try {
    return await db.user.findUnique({
      where: { id },
    });
  } catch (error) {
    return null;
  }
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role?: string;
  emailVerified?: Date | null;
}) {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = data.password.startsWith('$2')
    ? data.password
    : await hashPassword(data.password);

  return db.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: hashedPassword,
      name: data.name,
      role: (data.role || 'USER').toUpperCase(),
      emailVerified: data.emailVerified !== undefined ? data.emailVerified : null,
    },
  });
}

export async function updateUser(id: string, updates: Record<string, any>) {
  try {
    if (updates.password) {
      updates.passwordHash = await hashPassword(updates.password);
      delete updates.password;
    }
    return await db.user.update({
      where: { id },
      data: updates,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await db.user.delete({ where: { id } });
    return true;
  } catch (error) {
    return false;
  }
}
