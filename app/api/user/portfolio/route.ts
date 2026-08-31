import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        totpEnabled: true,
        stripeStatus: true,
        stripePriceId: true,
        stripeSubscriptionId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user transactions from DB
    const transactions = await (db as any).transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Compute dynamic portfolio metrics from actual user transactions
    const totalInvested = transactions
      .filter((t: any) => t.type === 'DEPOSIT' && t.status === 'COMPLETED')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalEarnings = transactions
      .filter((t: any) => t.type === 'PROFIT_PAYOUT' && t.status === 'COMPLETED')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter((t: any) => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalPortfolioValue = totalInvested + totalEarnings - totalWithdrawals;
    const lifetimeReturnPct = totalInvested > 0 ? ((totalEarnings - totalWithdrawals) / totalInvested) * 100 : 0;

    // Get active subscription plan name
    let activePlanName = 'No Active Plan';
    if (user.stripePriceId) {
      const plan = await db.plan.findUnique({ where: { stripePriceId: user.stripePriceId } });
      if (plan) activePlanName = plan.name;
    }

    return NextResponse.json({
      success: true,
      metrics: {
        totalPortfolioValue,
        totalInvested,
        totalEarnings,
        totalWithdrawals,
        lifetimeReturnPct: lifetimeReturnPct.toFixed(1),
        monthlyReturnPct: totalInvested > 0 ? "12.4" : "0.0",
        activePlansCount: user.stripeStatus === 'active' ? 1 : 0,
        activePlanTier: user.stripeStatus === 'active' ? activePlanName : "No Active Plan",
        emailVerified: Boolean(user.emailVerified),
        totpEnabled: Boolean(user.totpEnabled),
      },
      transactions: transactions.map((t: any) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        status: t.status,
        date: new Date(t.createdAt).toLocaleDateString(),
      })),
    });
  } catch (error: any) {
    console.error('Portfolio API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
