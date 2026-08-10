import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity } from '@/lib/activity';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = verifyToken(token);
    if (!session || session.role.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const plans = await db.plan.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      plans: plans.map((p) => ({
        id: p.id,
        name: p.name,
        stripePriceId: p.stripePriceId,
        price: p.price,
        interval: p.interval,
        features: JSON.parse(p.features || '[]'),
        createdAt: p.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Fetch plans error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = verifyToken(token);
    if (!session || session.role.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, price, interval, features, stripePriceId } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const priceId = stripePriceId || `price_${Date.now()}`;

    const newPlan = await db.plan.create({
      data: {
        name,
        price: parseFloat(price),
        interval: interval || 'monthly',
        stripePriceId: priceId,
        features: JSON.stringify(Array.isArray(features) ? features : [features]),
      },
    });

    await logActivity(session.userId, 'ADMIN_PLAN_CREATED', { planId: newPlan.id, name }, req);

    return NextResponse.json({
      success: true,
      plan: {
        ...newPlan,
        features: JSON.parse(newPlan.features),
      },
    });
  } catch (error: any) {
    console.error('Create plan error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create plan' }, { status: 500 });
  }
}
