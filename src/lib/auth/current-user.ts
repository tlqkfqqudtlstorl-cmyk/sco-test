import { prisma } from '@/lib/db';

import { getIronSessionTyped } from './session';

export type CurrentUserPublic = {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  role: string;
  rating: number;
  solved: number;
  avatarUrl: string | null;
};

export async function getCurrentUserOptional(): Promise<CurrentUserPublic | null> {
  const session = await getIronSessionTyped();
  if (!session.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      role: true,
      status: true,
      rating: true,
      solved: true,
      avatarUrl: true,
    },
  });

  if (!user || user.status !== 'ACTIVE') return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    rating: user.rating,
    solved: user.solved,
    avatarUrl: user.avatarUrl,
  };
}
