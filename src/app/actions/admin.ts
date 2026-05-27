'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUserOptional } from '@/lib/auth/current-user';
import { prisma } from '@/lib/db';

type ActionResult = { ok?: boolean; error?: string };

async function requireAdmin(): Promise<ActionResult | null> {
  const user = await getCurrentUserOptional();
  if (!user) return { error: '로그인이 필요합니다.' };
  if (user.role !== 'ADMIN') return { error: '관리자 권한이 필요합니다.' };
  return null;
}

export async function updateUserAdminAction(input: {
  userId: string;
  role?: 'USER' | 'REVIEWER' | 'ADMIN';
  status?: 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'DELETED';
}): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  await prisma.user.update({
    where: { id: input.userId },
    data: {
      ...(input.role ? { role: input.role } : {}),
      ...(input.status ? { status: input.status } : {}),
    },
  });
  revalidatePath('/admin');
  revalidatePath('/ranking');
  return { ok: true };
}

export async function upsertProblemAdminAction(input: {
  id?: string;
  number: number;
  title: string;
  categoryId: string;
  subCategoryId?: string | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimit: number;
  memoryLimit: number;
  description: string;
  inputDesc: string;
  outputDesc: string;
  examples?: { input: string; output: string; explanation?: string }[];
  tags?: string[];
  type?: string;
  premium?: boolean;
  status?: string;
  hint?: string | null;
}): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!input.title.trim()) return { error: '문제 제목이 필요합니다.' };

  const examples = input.examples ?? [];
  const data = {
    number: input.number,
    title: input.title.trim(),
    categoryId: input.categoryId,
    subCategoryId: input.subCategoryId ?? null,
    difficulty: input.difficulty,
    timeLimit: input.timeLimit,
    memoryLimit: input.memoryLimit,
    description: input.description,
    inputDesc: input.inputDesc,
    outputDesc: input.outputDesc,
    examples: JSON.stringify(examples),
    tags: JSON.stringify(input.tags ?? []),
    type: input.type ?? 'STANDARD',
    premium: input.premium ?? false,
    status: input.status ?? 'PUBLISHED',
    hint: input.hint ?? null,
  };

  await prisma.$transaction(async (tx) => {
    const problem = input.id
      ? await tx.problem.update({ where: { id: input.id }, data })
      : await tx.problem.create({ data });
    await tx.testCase.deleteMany({ where: { problemId: problem.id } });
    await tx.testCase.createMany({
      data: examples.map((tc, order) => ({
        problemId: problem.id,
        input: tc.input,
        output: tc.output,
        sample: true,
        order,
      })),
    });
  });

  revalidatePath('/admin');
  revalidatePath('/problems');
  return { ok: true };
}

export async function deleteProblemAdminAction(problemId: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;
  await prisma.problem.delete({ where: { id: problemId } });
  revalidatePath('/admin');
  revalidatePath('/problems');
  return { ok: true };
}

export async function upsertContestAdminAction(input: {
  id?: string;
  slug: string;
  title: string;
  description: string;
  format?: 'ICPC' | 'IOI' | 'CUSTOM';
  status?: string;
  startTime: Date;
  endTime: Date;
  freezeTime?: Date | null;
  isPublic?: boolean;
  isRated?: boolean;
  maxParticipants?: number | null;
  problemIds?: string[];
}): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!input.slug.trim() || !input.title.trim()) return { error: 'slug와 제목이 필요합니다.' };

  const user = await getCurrentUserOptional();
  await prisma.$transaction(async (tx) => {
    const contest = input.id
      ? await tx.contest.update({
          where: { id: input.id },
          data: {
            slug: input.slug,
            title: input.title,
            description: input.description,
            format: input.format ?? 'ICPC',
            status: input.status ?? 'UPCOMING',
            startTime: input.startTime,
            endTime: input.endTime,
            freezeTime: input.freezeTime ?? null,
            isPublic: input.isPublic ?? true,
            isRated: input.isRated ?? false,
            maxParticipants: input.maxParticipants ?? null,
          },
        })
      : await tx.contest.create({
          data: {
            slug: input.slug,
            title: input.title,
            description: input.description,
            format: input.format ?? 'ICPC',
            status: input.status ?? 'UPCOMING',
            startTime: input.startTime,
            endTime: input.endTime,
            freezeTime: input.freezeTime ?? null,
            isPublic: input.isPublic ?? true,
            isRated: input.isRated ?? false,
            maxParticipants: input.maxParticipants ?? null,
            createdById: user?.id,
          },
        });

    if (input.problemIds) {
      await tx.contestProblem.deleteMany({ where: { contestId: contest.id } });
      await tx.contestProblem.createMany({
        data: input.problemIds.map((problemId, order) => ({
          contestId: contest.id,
          problemId,
          label: String.fromCharCode(65 + order),
          order,
        })),
      });
    }
  });

  revalidatePath('/admin');
  revalidatePath('/contests');
  return { ok: true };
}

export async function exportOperationalDataAdminAction(): Promise<
  ActionResult & { data?: string }
> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [
    categories,
    subCategories,
    problems,
    testCases,
    contests,
    contestProblems,
    plans,
  ] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.subCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.problem.findMany({ orderBy: { number: 'asc' } }),
    prisma.testCase.findMany({ orderBy: [{ problemId: 'asc' }, { order: 'asc' }] }),
    prisma.contest.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.contestProblem.findMany({ orderBy: [{ contestId: 'asc' }, { order: 'asc' }] }),
    prisma.subscriptionPlan.findMany({ orderBy: { price: 'asc' } }),
  ]);

  return {
    ok: true,
    data: JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        categories,
        subCategories,
        problems,
        testCases,
        contests,
        contestProblems,
        plans,
      },
      null,
      2,
    ),
  };
}
