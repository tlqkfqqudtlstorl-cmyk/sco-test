import { PrismaClient } from '@prisma/client';

// After pulling schema changes: `npx prisma migrate deploy && npx prisma generate` (`npm install` also runs `prisma generate` via postinstall).

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
