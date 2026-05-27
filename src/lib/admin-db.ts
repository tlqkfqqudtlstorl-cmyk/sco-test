import { prisma } from '@/lib/db';

export async function getAdminOverview() {
  const [
    users,
    problems,
    submissions,
    contests,
    recentUsers,
    recentSubmissions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.problem.count(),
    prisma.submission.count(),
    prisma.contest.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { username: true, email: true, role: true, status: true, createdAt: true },
    }),
    prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        user: { select: { username: true } },
        problem: { select: { number: true, title: true } },
      },
    }),
  ]);

  return { users, problems, submissions, contests, recentUsers, recentSubmissions };
}
