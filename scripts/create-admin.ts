import { db } from '../lib/db';
import { hashPassword } from '../lib/auth';

async function createAdmin() {
  const email = 'admin@cherdung.com';
  const password = 'admin123';
  const name = 'Admin User';
  const role = 'ADMIN';

  console.log('Creating admin user in Prisma DB...');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log('Admin user already exists!');
    console.log('User ID:', existingUser.id);
    console.log('Email:', existingUser.email);
    console.log('Role:', existingUser.role);
    return;
  }

  const hashedPassword = await hashPassword(password);

  try {
    const admin = await db.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        role,
        emailVerified: new Date(),
      },
    });

    console.log('✅ Admin user created successfully in Prisma DB!');
    console.log('User ID:', admin.id);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

createAdmin().catch(console.error);
