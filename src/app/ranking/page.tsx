import Link from 'next/link';
import { listLeaderboard } from '@/lib/ranking-db';

export const metadata = {
  title: '랭킹',
};

export default async function RankingPage() {
  const rows = await listLeaderboard(80);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-10">
        <header className="mb-8 animate-in">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            순위표
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
            랭킹
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
            로그인 후 제출한 결과가 사용자별 통계·순위에 반영됩니다. 채점은 현재
            데모 규칙입니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Link
              href="/problems"
              className="pill-link"
            >
              문제 목록
            </Link>
            <span className="text-[var(--text-muted)] self-center">·</span>
            <Link href="/activity" className="text-[var(--accent-link)]">
              내 활동
            </Link>
          </div>
        </header>

        <div className="box overflow-hidden animate-in">
          <div className="px-4 py-3 border-b border-[var(--border-primary)] flex items-center justify-between gap-3 bg-[var(--bg-tertiary)]">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              상위 {rows.length}명
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              정렬: 레이팅 내림차순
            </span>
          </div>
          <div className="table-container">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th className="w-14">순위</th>
                  <th>사용자</th>
                  <th className="w-28 hidden sm:table-cell">티어</th>
                  <th className="w-24 text-right">해결</th>
                  <th className="w-28 text-right">레이팅</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.userId}>
                    <td className="font-mono text-[var(--text-secondary)]">
                      {r.rank}
                    </td>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-[var(--text-primary)]">
                          {r.username}
                        </span>
                        {r.bio && (
                          <span className="text-xs text-[var(--text-muted)] line-clamp-2">
                            {r.bio}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="badge badge-blue">{r.tierLabel}</span>
                    </td>
                    <td className="text-right font-mono text-sm text-[var(--text-secondary)]">
                      {r.solved}
                    </td>
                    <td className="text-right font-mono text-sm text-[var(--accent-green)]">
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
