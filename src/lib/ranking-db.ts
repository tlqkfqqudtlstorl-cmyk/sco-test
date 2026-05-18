import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';

/** 레이팅 구간 → 티어 라벨 (UI용, DB 컬럼 아님). */
export function tierLabelFromRating(rating: number): string {
  if (rating >= 2400) return '그랜드마스터';
  if (rating >= 2200) return '마스터';
  if (rating >= 2000) return '다이아';
  if (rating >= 1800) return '플래티넘';
  if (rating >= 1600) return '골드';
  if (rating >= 1400) return '실버';
  if (rating >= 1200) return '브론즈';
  return '루키';
}

export type LeaderboardRow = {
  rank: number;
  userId: string;
  username: string;
  bio: string | null;
  solved: number;
  rating: number;
  tierLabel: string;
};

export async function listLeaderboard(limit = 100): Promise<LeaderboardRow[]> {
  /**
   * SQLite에 직접 조회합니다. Turbopack 캐시 등으로 `@prisma/client`가 스키마보다
   * 오래된 경우 `findMany({ select: { bio: true } })`가 런타임 검증에서 실패할 수 있어,
   * DB 컬럼과만 맞춥니다(`users.bio` 마이그레이션 적용 필요).
   */
  const rows = await prisma.$queryRaw<
    { id: string; username: string; bio: string | null; solved: number; rating: number }[]
  >(Prisma.sql`
    SELECT id, username, bio, solved, rating FROM users
    ORDER BY rating DESC, solved DESC, username ASC
    LIMIT ${limit}
  `);

  return rows.map((u, i) => ({
    rank: i + 1,
    userId: u.id,
    username: u.username,
    bio: u.bio,
    solved: u.solved,
    rating: u.rating,
    tierLabel: tierLabelFromRating(u.rating),
  }));
}
