import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log('🌱 Starting Prisma DB Seeding & Migration...');

  // 1. Migrate users from data/users.json if it exists
  const usersJsonPath = path.join(process.cwd(), 'data', 'users.json');
  if (fs.existsSync(usersJsonPath)) {
    try {
      const fileData = fs.readFileSync(usersJsonPath, 'utf-8');
      const oldUsers = JSON.parse(fileData);

      console.log(`📦 Found ${oldUsers.length} accounts in users.json. Migrating to DB...`);

      for (const oldUser of oldUsers) {
        if (!oldUser.email) continue;
        const normalizedEmail = oldUser.email.toLowerCase();

        await prisma.user.upsert({
          where: { email: normalizedEmail },
          update: {
            passwordHash: oldUser.password,
            name: oldUser.name,
            role: (oldUser.role || 'USER').toUpperCase(),
          },
          create: {
            id: oldUser.id || undefined,
            email: normalizedEmail,
            passwordHash: oldUser.password,
            name: oldUser.name,
            role: (oldUser.role || 'USER').toUpperCase(),
            emailVerified: new Date(),
          },
        });
        console.log(`  └─ Migrated account: ${normalizedEmail} (${oldUser.role})`);
      }
    } catch (err) {
      console.error('Error migrating users.json:', err);
    }
  }

  // 2. Ensure default demo accounts exist
  const adminPassword = await hashPassword('admin123');
  await prisma.user.upsert({
    where: { email: 'admin@cherdung.com' },
    update: {},
    create: {
      email: 'admin@cherdung.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  const supportPassword = await hashPassword('support123');
  await prisma.user.upsert({
    where: { email: 'support@cherdung.com' },
    update: {},
    create: {
      email: 'support@cherdung.com',
      passwordHash: supportPassword,
      name: 'Support Agent',
      role: 'SUPPORT',
      emailVerified: new Date(),
    },
  });

  const userPassword = await hashPassword('user12345');
  await prisma.user.upsert({
    where: { email: 'user@cherdung.com' },
    update: {},
    create: {
      email: 'user@cherdung.com',
      passwordHash: userPassword,
      name: 'Demo Client',
      role: 'USER',
      emailVerified: new Date(),
    },
  });

  // 3. Seed Default Plans
  const plans = [
    {
      name: 'Starter Tier',
      stripePriceId: 'price_starter_mock',
      price: 49,
      interval: 'monthly',
      features: JSON.stringify(['Up to 5 Users', 'Basic CRM Analytics', 'Standard Support', '5GB Storage']),
    },
    {
      name: 'Professional Tier',
      stripePriceId: 'price_pro_mock',
      price: 149,
      interval: 'monthly',
      features: JSON.stringify(['Up to 25 Users', 'Advanced AI Insights', 'Priority 24/7 Support', '50GB Storage', 'Custom Workflows']),
    },
    {
      name: 'Enterprise Tier',
      stripePriceId: 'price_enterprise_mock',
      price: 499,
      interval: 'monthly',
      features: JSON.stringify(['Unlimited Users', 'Dedicated Account Manager', 'Custom API Integrations', 'Unlimited Storage', 'SLA Guarantee']),
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { stripePriceId: plan.stripePriceId },
      update: plan,
      create: plan,
    });
  }

  console.log('🚀 Database seeding & migration completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
