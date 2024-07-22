import { PrismaClient as PClient } from '@prisma/client';

function createPrismaClient() {
  return new PClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
    ],
  });
}
export type PrismaClient = ReturnType<typeof createPrismaClient>;

export * from './schema';
export default createPrismaClient;
