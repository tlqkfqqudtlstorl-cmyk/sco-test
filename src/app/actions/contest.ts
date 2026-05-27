'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getCurrentUserOptional } from '@/lib/auth/current-user';
import { prisma } from '@/lib/db';

export async function registerContestAction(contestId: string) {
  const user = await getCurrentUserOptional();
  if (!user) redirect('/login?next=/contests');

  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    include: { _count: { select: { participants: true } } },
  });
  if (!contest || !contest.isPublic) return { error: '대회를 찾을 수 없습니다.' };
  if (contest.status !== 'REGISTERING' && contest.status !== 'UPCOMING') {
    return { error: '현재 참가 신청이 불가능합니다.' };
  }
  if (contest.maxParticipants && contest._count.participants >= contest.maxParticipants) {
    return { error: '참가 정원이 가득 찼습니다.' };
  }

  await prisma.contestParticipation.upsert({
    where: { contestId_userId: { contestId, userId: user.id } },
    create: { contestId, userId: user.id },
    update: { isDisqualified: false, disqualificationReason: null },
  });

  revalidatePath('/contests');
  return { ok: true };
}
