import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/storage';
import { hashPassword } from '@/lib/auth';

// GET - List all users
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const token = request.cookies.get('auth_token')?.value;
    const session = verifyToken(token || '');
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const users = getUsers();
    
    // Return users without passwords
    const safeUsers = users.map(({ password, ...user }) => user);
    
    return NextResponse.json({
      success: true,
      users: safeUsers,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const token = request.cookies.get('auth_token')?.value;
    const session = verifyToken(token || '');
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'support', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, support, or user' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Return user without password
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
