import { prisma } from '@/lib/db';

const BASE_RATING = 1200;

/** 난이도별 첫 AC 시 레이팅 가산. */
export function ratingGainForDifficulty(difficulty: string): number {
  switch (difficulty) {
    case 'EASY':
      return 8;
    case 'MEDIUM':
      return 15;
    case 'HARD':
      return 25;
    default:
      return 10;
  }
}

/**
 * 제출 테이블 기준으로 solved·rating을 재계산합니다 (단일 진실 원천 동기화).
 */
export async function recalculateUserStats(userId: string): Promise<void> {
  const acGroups = await prisma.submission.groupBy({
    by: ['problemId'],
    where: { userId, status: 'AC' },
  });

  if (acGroups.length === 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { solved: 0, rating: BASE_RATING },
    });
    return;
  }

  const problemIds = acGroups.map((g) => g.problemId);
  const problems = await prisma.problem.findMany({
    where: { id: { in: problemIds } },
    select: { difficulty: true },
  });

  const solved = problems.length;
  const gain = problems.reduce(
    (sum, p) => sum + ratingGainForDifficulty(p.difficulty),
    0,
  );
  const rating = BASE_RATING + gain;

  await prisma.user.update({
    where: { id: userId },
    data: { solved, rating },
  });
}
