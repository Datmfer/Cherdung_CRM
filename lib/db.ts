import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Always ensure a fresh instance in dev if schema models update
export const db =
  (process.env.NODE_ENV === 'development'
    ? new PrismaClient({ log: ['error', 'warn'] })
    : globalForPrisma.prisma ?? new PrismaClient());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
