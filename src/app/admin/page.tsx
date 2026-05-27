import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUserOptional } from '@/lib/auth/current-user';
import { getAdminOverview } from '@/lib/admin-db';

export const metadata = {
  title: '관리',
};

export default async function AdminPage() {
  const user = await getCurrentUserOptional();
  if (!user) {
    redirect('/login?next=/admin');
  }
  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
        <div className="container-app py-12">
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            접근 불가
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            관리자만 볼 수 있는 페이지입니다.
          </p>
          <Link href="/" className="pill-link inline-block mt-6">
            홈으로
          </Link>
        </div>
      </div>
    );
  }
  const overview = await getAdminOverview();

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-12 max-w-5xl">
        <header className="mb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            운영
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            관리자
          </h1>
        </header>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            ['사용자', overview.users],
            ['문제', overview.problems],
            ['제출', overview.submissions],
            ['대회', overview.contests],
          ].map(([label, value]) => (
            <div key={label} className="box p-4">
              <p className="text-xs text-[var(--text-muted)]">{label}</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-[var(--text-primary)]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="box overflow-hidden">
            <div className="border-b border-[var(--border-primary)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">
              최근 사용자
            </div>
            <div className="divide-y divide-[var(--border-primary)]">
              {overview.recentUsers.map((u) => (
                <div key={u.username} className="px-4 py-3 text-sm">
                  <Link href={`/users/${u.username}`} className="font-medium text-[var(--text-primary)]">{u.username}</Link>
                  <p className="text-xs text-[var(--text-muted)]">{u.email} · {u.role} · {u.status}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="box overflow-hidden">
            <div className="border-b border-[var(--border-primary)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">
              최근 제출
            </div>
            <div className="divide-y divide-[var(--border-primary)]">
              {overview.recentSubmissions.map((s) => (
                <div key={s.id} className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                  <span className="font-medium text-[var(--text-primary)]">{s.user.username}</span>
                  {' · '}
                  <Link href={`/problems/${s.problem.number}`} className="text-[var(--accent-link)]">{s.problem.number}. {s.problem.title}</Link>
                  <span className="ml-2 font-mono">{s.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
