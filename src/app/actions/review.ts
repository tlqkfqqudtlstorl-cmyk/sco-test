'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUserOptional } from '@/lib/auth/current-user';
import { prisma } from '@/lib/db';

async function requireReviewer() {
  const user = await getCurrentUserOptional();
  if (!user) return { error: '로그인이 필요합니다.' } as const;
  if (user.role !== 'ADMIN' && user.role !== 'REVIEWER') {
    return { error: '리뷰 권한이 필요합니다.' } as const;
  }
  return user;
}

export async function decideReviewCaseAction(input: {
  reviewCaseId: string;
  action: 'APPROVE' | 'REJECT_RANKING' | 'REQUEST_EXPLANATION' | 'ESCALATE' | 'WARN';
  reason: string;
}) {
  const reviewer = await requireReviewer();
  if ('error' in reviewer) return reviewer;

  await prisma.$transaction(async (tx) => {
    await tx.reviewDecision.upsert({
      where: { reviewCaseId: input.reviewCaseId },
      create: {
        reviewCaseId: input.reviewCaseId,
        action: input.action,
        reason: input.reason,
        decidedById: reviewer.id,
      },
      update: {
        action: input.action,
        reason: input.reason,
        decidedById: reviewer.id,
        decidedAt: new Date(),
      },
    });
    await tx.reviewCase.update({
      where: { id: input.reviewCaseId },
      data: {
        reviewerId: reviewer.id,
        status: input.action === 'ESCALATE' ? 'ESCALATED' : input.action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        resolvedAt: new Date(),
      },
    });
  });
  revalidatePath('/admin');
  return { ok: true };
}
