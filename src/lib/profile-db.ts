import { prisma } from '@/lib/db';

export async function getPublicProfileByUsername(username: string) {
  return prisma.user.findFirst({
    where: { username, status: 'ACTIVE' },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      organization: true,
      githubUrl: true,
      blogUrl: true,
      avatarUrl: true,
      rating: true,
      solved: true,
      createdAt: true,
      role: true,
    },
  });
}
