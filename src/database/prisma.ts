import { PrismaClient } from '@prisma/client';
import { testPrismaConnection } from './prisma-diagnostic';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});


testPrismaConnection()
  .then(result => {
    if (result.success) {
      console.log('Prisma initialized successfully');
    } else {
      console.error('Prisma initialization failed:', result.error);
    }
  })
  .catch(err => {
    console.error('Failed to run Prisma diagnostics:', err);
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;