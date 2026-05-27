'use server';

import { revalidatePath } from 'next/cache';

import { getIronSessionTyped } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { assessSubmissionIntegrity } from '@/lib/integrity';
import { judgeSubmission, statusLabel } from '@/lib/judge';
import { recalculateUserStats } from '@/lib/user-stats';

const MAX_CODE_LENGTH = 512_000;

export async function submitCode(input: {
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
  if (input.code.trim().length === 0) {
    return { ok: false, message: '제출할 코드가 비어 있습니다.' };
  }

  const problem = await prisma.problem.findUnique({
    where: { id: input.problemId },
    include: { testCases: { orderBy: { order: 'asc' } } },
  });
  if (!problem) {
    return { ok: false, message: '문제를 찾을 수 없습니다.' };
  }

  const judge = await judgeSubmission({
    language: input.language,
    code: input.code,
    timeLimitMs: problem.timeLimit,
    memoryLimitMb: problem.memoryLimit,
    testcases: problem.testCases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      output: tc.output,
    })),
  });
  const isAc = judge.status === 'AC';
  const integrity = assessSubmissionIntegrity({
    code: input.code,
    language: input.language,
    status: judge.status,
  });

  await prisma.$transaction(async (tx) => {
    const submission = await tx.submission.create({
      data: {
        userId: user.id,
        problemId: problem.id,
        language: input.language,
        code: input.code,
        codeLength: input.code.length,
        status: judge.status,
        verificationStatus: isAc && problem.type === 'VERIFIED' ? 'PENDING_EXPLANATION' : 'NOT_REQUIRED',
        integrityScore: integrity.score,
        integrityFlags: JSON.stringify(integrity.flags),
        execTime: judge.execTime ?? null,
        memory: judge.memory ?? null,
        judgedAt: new Date(),
      },
    });
    if (integrity.score >= 25) {
      await tx.reviewCase.create({
        data: {
          submissionId: submission.id,
          riskScore: integrity.score,
          riskLevel: integrity.level,
          signals: { create: integrity.signals },
        },
      });
    }

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
    status: statusLabel(judge.status),
    execTime: judge.execTime,
    memory: judge.memory,
    message: judge.message,
  };
}

export const submitDemoCode = submitCode;
