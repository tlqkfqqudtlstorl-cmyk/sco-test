'use server';

import { revalidatePath } from 'next/cache';

import { getIronSessionTyped } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { recalculateUserStats } from '@/lib/user-stats';

const DEMO_AC_MARKER = '__DEMO_AC__';
const MAX_CODE_LENGTH = 512_000;

/**
 * 데모 제출: 로그인 필수. 실제 채점기 없이 DB 기록 후 `__DEMO_AC__` 포함 시 AC.
 * TODO: 실제 샌드박스 채점 연동 시 판정 분기만 교체.
 */
export async function submitDemoCode(input: {
  problemId: string;
  language: string;
  code: string;
}): Promise<{
  ok: boolean;
  status?: string;
  execTime?: number;
  memory?: number;
  message?: string;
}> {
  const session = await getIronSessionTyped();
  if (!session.userId) {
    return { ok: false, message: '제출하려면 로그인하세요.' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, status: true, username: true },
  });
  if (!user || user.status !== 'ACTIVE') {
    return { ok: false, message: '유효하지 않은 계정입니다.' };
  }

  if (input.code.length > MAX_CODE_LENGTH) {
    return { ok: false, message: '코드가 너무 깁니다.' };
  }

  const problem = await prisma.problem.findUnique({
    where: { id: input.problemId },
  });
  if (!problem) {
    return { ok: false, message: '문제를 찾을 수 없습니다.' };
  }

  const isAc = input.code.includes(DEMO_AC_MARKER);
  const status = isAc ? 'AC' : 'WA';
  const execTime = isAc ? 12 + Math.floor(Math.random() * 40) : undefined;
  const memory = isAc ? 2048 + Math.floor(Math.random() * 4096) : undefined;

  await prisma.$transaction(async (tx) => {
    await tx.submission.create({
      data: {
        userId: user.id,
        problemId: problem.id,
        language: input.language,
        code: input.code,
        status,
        execTime: execTime ?? null,
        memory: memory ?? null,
      },
    });

    await tx.problem.update({
      where: { id: problem.id },
      data: {
        submitCount: { increment: 1 },
        ...(isAc ? { acCount: { increment: 1 } } : {}),
      },
    });
  });

  await recalculateUserStats(user.id);

  revalidatePath('/ranking');
  revalidatePath('/problems');
  revalidatePath(`/problems/${problem.number}`);
  revalidatePath('/activity');
  revalidatePath(`/users/${user.username}`);
  revalidatePath('/settings');

  return {
    ok: true,
    status: isAc ? '맞았습니다' : '틀렸습니다',
    execTime,
    memory,
    message: isAc
      ? `AC! 코드에 "${DEMO_AC_MARKER}"가 있으면 데모 채점에서 항상 통과합니다.`
      : `WA. 데모 AC를 보려면 코드 어딘가에 ${DEMO_AC_MARKER} 를 넣어 제출하세요.`,
  };
}
