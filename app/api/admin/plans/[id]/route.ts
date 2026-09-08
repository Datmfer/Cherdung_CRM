import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity } from '@/lib/activity';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = verifyToken(token);
    if (!session || session.role.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, price, interval, features } = body;

    const existingPlan = await db.plan.findUnique({ where: { id } });
    if (!existingPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (price !== undefined) updates.price = parseFloat(price);
    if (interval !== undefined) updates.interval = interval;
    if (features !== undefined) {
      updates.features = Array.isArray(features) ? JSON.stringify(features) : features;
    }

    const updatedPlan = await db.plan.update({
      where: { id },
      data: updates,
    });

    await logActivity(session.userId, 'ADMIN_PLAN_UPDATED', { planId: id, updates }, req);

    return NextResponse.json({
      success: true,
      plan: {
        ...updatedPlan,
        features: typeof updatedPlan.features === 'string' ? JSON.parse(updatedPlan.features) : updatedPlan.features,
      },
    });
  } catch (error: any) {
    console.error('Update plan error:', error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = verifyToken(token);
    if (!session || session.role.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await db.plan.delete({ where: { id } });

    await logActivity(session.userId, 'ADMIN_PLAN_DELETED', { planId: id }, req);

    return NextResponse.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error: any) {
    console.error('Delete plan error:', error);
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
  }
}

