import path from 'path';
import { PrismaClient as SQLiteClient } from '../node_modules/.prisma/client-sqlite';
import { PrismaClient as PostgresClient } from '@prisma/client';

const sqlite = new SQLiteClient({
  datasources: {
    db: {
      url: `file:${path.resolve('prisma/dev.db')}`,
    },
  },
});

const postgres = new PostgresClient();

async function main() {
  console.log('Reading SQLite database...');

  const users = await sqlite.user.findMany();
  const refreshTokens = await sqlite.refreshToken.findMany();
  const sessions = await sqlite.session.findMany();
  const verificationTokens = await sqlite.verificationToken.findMany();
  const passwordResetTokens = await sqlite.passwordResetToken.findMany();
  const activities = await sqlite.activity.findMany();
  const plans = await sqlite.plan.findMany();

  console.log(`Users: ${users.length}`);
  console.log(`Refresh tokens: ${refreshTokens.length}`);
  console.log(`Sessions: ${sessions.length}`);
  console.log(`Verification tokens: ${verificationTokens.length}`);
  console.log(`Password reset tokens: ${passwordResetTokens.length}`);
  console.log(`Activities: ${activities.length}`);
  console.log(`Plans: ${plans.length}`);

  console.log('\nCopying data to PostgreSQL...');

  for (const user of users) {
    await postgres.user.create({ data: user });
  }

  for (const refreshToken of refreshTokens) {
    await postgres.refreshToken.create({ data: refreshToken });
  }

  for (const session of sessions) {
    await postgres.session.create({ data: session });
  }

  for (const verificationToken of verificationTokens) {
    await postgres.verificationToken.create({ data: verificationToken });
  }

  for (const passwordResetToken of passwordResetTokens) {
    await postgres.passwordResetToken.create({ data: passwordResetToken });
  }

  for (const activity of activities) {
    await postgres.activity.create({ data: activity });
  }

  for (const plan of plans) {
    await postgres.plan.create({ data: plan });
  }

  console.log('\nMigration completed successfully.');
}

main()
  .catch((error) => {
    console.error('Migration failed:');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await sqlite.$disconnect();
    await postgres.$disconnect();
  });
