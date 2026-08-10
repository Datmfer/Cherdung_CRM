import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = verifyToken(token);
    if (!session) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        stripePriceId: true,
        stripeStatus: true,
        stripeSubscriptionId: true,
      },
    });

    const plans = await db.plan.findMany();

    return NextResponse.json({
      success: true,
      subscription: user,
      availablePlans: plans.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        interval: p.interval,
        features: JSON.parse(p.features || '[]'),
        stripePriceId: p.stripePriceId,
      })),
    });
  } catch (error: any) {
    console.error('User investments endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
