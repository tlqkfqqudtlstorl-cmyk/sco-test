'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUserOptional } from '@/lib/auth/current-user';
import { prisma } from '@/lib/db';

type Result = { ok?: boolean; error?: string };

export async function submitExplanationAction(input: {
  submissionId: string;
  algorithm: string;
  coreIdea: string;
  timeComplexity: string;
  spaceComplexity: string;
  counterexamples: string;
  justification: string;
}): Promise<Result> {
  const user = await getCurrentUserOptional();
  if (!user) return { error: '로그인이 필요합니다.' };
  const submission = await prisma.submission.findFirst({
    where: { id: input.submissionId, userId: user.id, status: 'AC' },
    select: { id: true, problem: { select: { number: true } } },
  });
  if (!submission) return { error: '검증 가능한 제출을 찾을 수 없습니다.' };

  await prisma.submissionExplanation.upsert({
    where: { submissionId: input.submissionId },
    create: input,
    update: {
      algorithm: input.algorithm,
      coreIdea: input.coreIdea,
      timeComplexity: input.timeComplexity,
      spaceComplexity: input.spaceComplexity,
      counterexamples: input.counterexamples,
      justification: input.justification,
    },
  });
  await prisma.submission.update({
    where: { id: input.submissionId },
    data: { verificationStatus: 'PENDING_REVIEW' },
  });
  revalidatePath('/activity');
  revalidatePath(`/problems/${submission.problem.number}`);
  return { ok: true };
}

export async function submitUnderstandingAnswersAction(input: {
  submissionId: string;
  answers: { questionId: string; answer: string }[];
}): Promise<Result> {
  const user = await getCurrentUserOptional();
  if (!user) return { error: '로그인이 필요합니다.' };
  const submission = await prisma.submission.findFirst({
    where: { id: input.submissionId, userId: user.id },
    select: { id: true },
  });
  if (!submission) return { error: '제출을 찾을 수 없습니다.' };

  const questions = await prisma.understandingQuestion.findMany({
    where: { id: { in: input.answers.map((a) => a.questionId) } },
  });
  const answerById = new Map(input.answers.map((a) => [a.questionId, a.answer.trim()]));
  await prisma.$transaction(
    questions.map((q) =>
      prisma.understandingAnswer.upsert({
        where: { questionId_submissionId: { questionId: q.id, submissionId: input.submissionId } },
        create: {
          questionId: q.id,
          submissionId: input.submissionId,
          answer: answerById.get(q.id) ?? '',
          isCorrect: (answerById.get(q.id) ?? '').toLowerCase() === q.correctAnswer.trim().toLowerCase(),
        },
        update: {
          answer: answerById.get(q.id) ?? '',
          isCorrect: (answerById.get(q.id) ?? '').toLowerCase() === q.correctAnswer.trim().toLowerCase(),
        },
      }),
    ),
  );
  return { ok: true };
}
