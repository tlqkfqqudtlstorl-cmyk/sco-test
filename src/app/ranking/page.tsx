import Link from 'next/link';
import { Trophy, Target, Activity } from 'lucide-react';
import { TIERS, listLeaderboard } from '@/lib/ranking-db';
import { TierIcon } from '@/components/TierIcon';

export const metadata = {
  title: '랭킹',
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-yellow-500/20 border border-yellow-500/30 mx-auto">
        <span className="text-base" role="img" aria-label="gold">👑</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-300/15 border border-gray-300/25 mx-auto">
        <span className="text-base" role="img" aria-label="silver">🥈</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/25 mx-auto">
        <span className="text-base" role="img" aria-label="bronze">🥉</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] mx-auto">
      <span className="font-mono text-sm font-bold text-[var(--text-secondary)]">
        {String(rank).padStart(2, '0')}
      </span>
    </div>
  );
}

export default async function RankingPage() {
  const rows = await listLeaderboard(80);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-10">
        <header className="mb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            순위표
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] tracking-tight">
                랭킹
              </h1>
              <p className="mt-2 max-w-xl text-sm text-[var(--text-secondary)]">
                로그인 후 제출한 결과가 사용자별 통계·순위에 반영됩니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium no-underline transition-colors border bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--border-strong)]"
              >
                <Target size={12} />
                문제 목록
              </Link>
              <Link
                href="/activity"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium no-underline transition-colors border bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--border-strong)]"
              >
                <Activity size={12} />
                내 활동
              </Link>
            </div>
          </div>
        </header>

        <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-5 mb-6 shadow-sm">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-4">
            티어표
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIERS.map((t) => (
                <div key={t.name} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)]">
                  <TierIcon name={t.name} className="h-7 w-7 shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{t.name}</span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] ml-auto shrink-0">{t.range}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)] flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
              <Trophy size={14} className="text-[var(--accent-link)]" />
              상위 {rows.length}명
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              레이팅 기준
            </span>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="w-16 text-center">순위</th>
                  <th>사용자</th>
                  <th className="w-36 hidden sm:table-cell">티어</th>
                  <th className="w-24 text-right">해결</th>
                  <th className="w-28 text-right">레이팅</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.userId}>
                    <td className="text-center align-middle">
                      <RankBadge rank={r.rank} />
                    </td>
                    <td className="align-middle">
                      <Link
                        href={`/users/${r.username}`}
                        className="text-[var(--text-primary)] hover:text-[var(--accent-blue)] no-underline font-medium"
                      >
                        {r.username}
                      </Link>
                      {r.bio && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1 max-w-xs">
                          {r.bio}
                        </p>
                      )}
                    </td>
                    <td className="hidden sm:table-cell align-middle">
                      <span className="inline-flex items-center gap-1.5 text-sm whitespace-nowrap">
                        <TierIcon name={TIERS.find((t) => r.rating >= t.min && r.rating <= t.max)?.name ?? ''} className="h-5 w-5" />
                        <span>{TIERS.find((t) => r.rating >= t.min && r.rating <= t.max)?.name}</span>
                      </span>
                    </td>
                    <td className="text-right font-mono text-sm text-[var(--text-secondary)] align-middle">
                      {r.solved}
                    </td>
                    <td className="text-right font-mono text-sm text-[var(--accent-positive)] font-semibold align-middle">
                      {r.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
