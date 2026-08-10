import { db } from './db';
import { NextRequest } from 'next/server';

export async function logActivity(
  userId: string,
  action: string,
  metadata?: Record<string, any>,
  req?: NextRequest
) {
  try {
    const ipAddress = req?.headers.get('x-forwarded-for') || req?.headers.get('x-real-ip') || undefined;
    const userAgent = req?.headers.get('user-agent') || undefined;

    await db.activity.create({
      data: {
        userId,
        action,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
