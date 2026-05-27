import type { Prisma } from '@prisma/client';
import type {
  CategoryNav,
  Problem,
  ProblemClient,
  ProblemDifficulty,
  ProblemExample,
  ProblemListItemClient,
  ProblemStatus,
  ProblemType,
} from '@/types';
import { prisma } from '@/lib/db';

const problemWithRelations = {
  category: true,
  subCategory: true,
} satisfies Prisma.ProblemInclude;

export type ProblemWithRelations = Prisma.ProblemGetPayload<{
  include: typeof problemWithRelations;
}>;

function parseExamples(json: string): ProblemExample[] {
  try {
    const raw = JSON.parse(json) as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => {
      const o = item as Record<string, unknown>;
      return {
        input: String(o.input ?? ''),
        output: String(o.output ?? ''),
        explanation: o.explanation != null ? String(o.explanation) : undefined,
      };
    });
  } catch {
    return [];
  }
}

function parseTags(json: string): string[] {
  try {
    const raw = JSON.parse(json) as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.map((t) => String(t));
  } catch {
    return [];
  }
}

export function mapRowToProblem(row: ProblemWithRelations): Problem {
  const submit = row.submitCount;
  const ac = row.acCount;
  const acceptanceRate =
    submit > 0 ? Math.round((ac / submit) * 1000) / 10 : 0;

  return {
    id: row.id,
    number: row.number,
    title: row.title,
    type: (row.type as ProblemType) || 'STANDARD',
    premium: row.premium,
    difficulty: row.difficulty as ProblemDifficulty,
    status: (row.status as ProblemStatus) || 'PUBLISHED',
    tags: parseTags(row.tags),
    timeLimit: row.timeLimit,
    memoryLimit: row.memoryLimit,
    description: row.description,
    inputDescription: row.inputDesc,
    outputDescription: row.outputDesc,
    examples: parseExamples(row.examples),
    imageUrl: row.imageUrl ?? undefined,
    hint: row.hint ?? undefined,
    requiresExplanation: false,
    requiresUnderstanding: false,
    requiresCodePatch: false,
    submissionCount: row.submitCount,
    acCount: row.acCount,
    verifiedCount: 0,
    acceptanceRate,
    authorId: 'system',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    publishedAt: row.createdAt,
  };
}

export function toProblemClient(p: Problem): ProblemClient {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    publishedAt: p.publishedAt?.toISOString(),
  };
}

export function toProblemListItemClient(
  row: ProblemWithRelations,
): ProblemListItemClient {
  const base = toProblemClient(mapRowToProblem(row));
  return {
    ...base,
    categorySlug: row.category.slug,
    categoryName: row.category.name,
    subCategorySlug: row.subCategory?.slug ?? null,
    subCategoryName: row.subCategory?.name ?? null,
  };
}

export async function listCategoriesWithSubs() {
  return prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      subCategories: { orderBy: { order: 'asc' } },
    },
  });
}

/** 로그인 사용자 기준 AC 낸 문제 번호(미로그인이면 빈 배열). */
export async function listSolvedProblemNumbersForUser(
  userId: string | null,
): Promise<number[]> {
  if (!userId) return [];

  const grouped = await prisma.submission.groupBy({
    by: ['problemId'],
    where: { userId, status: 'AC' },
  });
  if (grouped.length === 0) return [];

  const problems = await prisma.problem.findMany({
    where: { id: { in: grouped.map((g) => g.problemId) } },
    select: { number: true },
  });

  return problems.map((p) => p.number).sort((a, b) => a - b);
}

export async function listProblems(filters?: {
  categorySlug?: string;
  subCategorySlug?: string;
}): Promise<ProblemWithRelations[]> {
  const where: Prisma.ProblemWhereInput = {};

  if (filters?.subCategorySlug) {
    where.subCategory = { slug: filters.subCategorySlug };
  } else if (filters?.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }

  return prisma.problem.findMany({
    where,
    orderBy: { number: 'asc' },
    include: problemWithRelations,
  });
}

export async function getProblemById(id: string) {
  return prisma.problem.findUnique({
    where: { id },
    include: problemWithRelations,
  });
}

export async function getProblemByNumber(number: number) {
  return prisma.problem.findUnique({
    where: { number },
    include: problemWithRelations,
  });
}

/** `id` 세그먼트가 숫자면 번호로, 아니면 cuid로 조회합니다. */
export async function getProblemByRouteParam(param: string) {
  if (/^\d+$/.test(param)) {
    const n = Number(param);
    if (Number.isSafeInteger(n)) {
      const byNum = await getProblemByNumber(n);
      if (byNum) return byNum;
    }
  }
  return getProblemById(param);
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { subCategories: { orderBy: { order: 'asc' } } },
  });
}

export async function assertSubCategoryPath(
  categorySlug: string,
  subSlug: string,
) {
  return prisma.subCategory.findFirst({
    where: {
      slug: subSlug,
      category: { slug: categorySlug },
    },
  });
}

export async function getPrevNextProblem(number: number) {
  const [prev, next] = await Promise.all([
    prisma.problem.findFirst({
      where: { number: { lt: number } },
      orderBy: { number: 'desc' },
      select: { number: true, title: true },
    }),
    prisma.problem.findFirst({
      where: { number: { gt: number } },
      orderBy: { number: 'asc' },
      select: { number: true, title: true },
    }),
  ]);
  return { prev, next };
}

/** 클라이언트 컴포넌트용 — Date 필드 제거 */
export function categoriesToNav(
  rows: Awaited<ReturnType<typeof listCategoriesWithSubs>>,
): CategoryNav[] {
  return rows.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    icon: c.icon,
    order: c.order,
    subCategories: c.subCategories.map((s) => ({
      slug: s.slug,
      name: s.name,
      order: s.order,
    })),
  }));
}
