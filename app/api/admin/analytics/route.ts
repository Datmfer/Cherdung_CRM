import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = verifyToken(token);
    if (!session || session.role.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [totalUsers, verifiedUsers, adminCount, supportCount, userCount, totalPlans] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { emailVerified: { not: null } } }),
      db.user.count({ where: { role: 'ADMIN' } }),
      db.user.count({ where: { role: 'SUPPORT' } }),
      db.user.count({ where: { role: 'USER' } }),
      db.plan.count(),
    ]);

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        verificationRate: totalUsers ? Math.round((verifiedUsers / totalUsers) * 100) : 0,
        roles: {
          admin: adminCount,
          support: supportCount,
          user: userCount,
        },
        totalPlans,
      },
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
