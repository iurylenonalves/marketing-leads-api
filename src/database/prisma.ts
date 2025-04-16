import { PrismaClient } from '@prisma/client';

// Para evitar múltiplas conexões em ambiente serverless
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Log apenas em ambiente de desenvolvimento
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;