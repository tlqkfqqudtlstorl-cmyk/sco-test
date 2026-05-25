import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';

export const TIERS = [
  { emoji: '🪨', name: '자갈', range: '0–1199', min: 0, max: 1199 },
  { emoji: '🥚', name: '돌멩이', range: '1200–1399', min: 1200, max: 1399 },
  { emoji: '🏔️', name: '암석', range: '1400–1599', min: 1400, max: 1599 },
  { emoji: '💎', name: '광석', range: '1600–1799', min: 1600, max: 1799 },
  { emoji: '🔮', name: '수정', range: '1800–1999', min: 1800, max: 1999 },
  { emoji: '💜', name: '자수정', range: '2000–2199', min: 2000, max: 2199 },
  { emoji: '💙', name: '사파이어', range: '2200–2399', min: 2200, max: 2399 },
  { emoji: '💠', name: '다이아몬드', range: '2400+', min: 2400, max: Infinity },
] as const;

export function tierFromRating(rating: number) {
  return TIERS.find((t) => rating >= t.min && rating <= t.max) ?? TIERS[0];
}

/** 레이팅 구간 → 티어 라벨 (UI용, DB 컬럼 아님). */
export function tierLabelFromRating(rating: number): string {
  const t = tierFromRating(rating);
  return `${t.emoji} ${t.name}`;
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
