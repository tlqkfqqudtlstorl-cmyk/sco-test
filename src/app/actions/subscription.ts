'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUserOptional } from '@/lib/auth/current-user';

export async function listPlans() {
  return prisma.subscriptionPlan.findMany({ orderBy: { price: 'asc' } });
}

export async function getUserSubscription() {
  const user = await getCurrentUserOptional();
  if (!user) return null;
  return prisma.userSubscription.findFirst({
    where: { userId: user.id, status: 'ACTIVE' },
    include: { plan: true },
  });
}

export async function subscribeAction(planId: string, paymentMethod: string) {
  const user = await getCurrentUserOptional();
  if (!user) redirect('/login?next=/subscribe');

  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (! plan) return { error: '존재하지 않는 플랜입니다.' };

  const existing = await prisma.userSubscription.findUnique({
    where: { userId_planId: { userId: user.id, planId } },
  });
  if (existing?.status === 'ACTIVE') return { error: '이미 구독 중인 플랜입니다.' };

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  await prisma.userSubscription.upsert({
    where: { userId_planId: { userId: user.id, planId } },
    create: { userId: user.id, planId, status: 'ACTIVE', endDate, paymentMethod },
    update: { status: 'ACTIVE', endDate, paymentMethod, startDate: new Date() },
  });

  revalidatePath('/');
  revalidatePath('/subscribe');
  revalidatePath('/problems');
  return { ok: true };
}

export async function cancelSubscription(subscriptionId: string) {
  const user = await getCurrentUserOptional();
  if (!user) return { error: '로그인이 필요합니다.' };

  await prisma.userSubscription.updateMany({
    where: { id: subscriptionId, userId: user.id },
    data: { status: 'CANCELLED' },
  });

  revalidatePath('/');
  revalidatePath('/subscribe');
  return { ok: true };
}
