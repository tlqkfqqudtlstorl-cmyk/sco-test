import { prisma } from '@/lib/db';

export async function listPublicContests() {
  return prisma.contest.findMany({
    where: { isPublic: true },
    orderBy: [{ startTime: 'asc' }, { createdAt: 'desc' }],
    include: {
      _count: { select: { participants: true, problems: true } },
      participants: { select: { userId: true } },
    },
  });
}

export async function getContestBySlug(slug: string) {
  return prisma.contest.findUnique({
    where: { slug },
    include: {
      problems: {
        orderBy: { order: 'asc' },
        include: { problem: { select: { number: true, title: true, difficulty: true } } },
      },
      participants: { include: { user: { select: { username: true, rating: true } } } },
    },
  });
}
