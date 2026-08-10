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
    if (!session || session.role.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const roleFilter = searchParams.get('role');
    const query = searchParams.get('query');
    const format = searchParams.get('format');

    const where: any = {};

    if (roleFilter && roleFilter !== 'all') {
      where.role = roleFilter.toUpperCase();
    }

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { email: { contains: query } },
      ];
    }

    // CSV Export
    if (format === 'csv') {
      const allUsers = await db.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      const csvHeaders = 'ID,Name,Email,Role,Email Verified,Created At\n';
      const csvRows = allUsers
        .map(
          (u) =>
            `"${u.id}","${u.name.replace(/"/g, '""')}","${u.email}","${u.role}","${
              u.emailVerified ? u.emailVerified.toISOString() : 'Unverified'
            }","${u.createdAt.toISOString()}"`
        )
        .join('\n');

      const csvContent = csvHeaders + csvRows;

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=users-export-${Date.now()}.csv`,
        },
      });
    }

    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        ...u,
        role: u.role.toLowerCase(),
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error('Admin users endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
