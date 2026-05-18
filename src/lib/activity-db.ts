import { prisma } from '@/lib/db';

export async function listSubmissionsForUser(userId: string, take = 100) {
  return prisma.submission.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      problem: {
        select: { id: true, number: true, title: true, difficulty: true },
      },
    },
  });
}
