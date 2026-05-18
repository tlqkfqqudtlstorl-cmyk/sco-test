import Link from 'next/link';
import { notFound } from 'next/navigation';

import { tierLabelFromRating } from '@/lib/ranking-db';
import { getPublicProfileByUsername } from '@/lib/profile-db';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const u = await getPublicProfileByUsername(username);
  if (!u) return { title: '사용자' };
  const name = u.displayName?.trim() || u.username;
  return { title: name };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const u = await getPublicProfileByUsername(username);
  if (!u) notFound();

  const display = u.displayName?.trim() || u.username;
  const tier = tierLabelFromRating(u.rating);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-10 max-w-3xl">
        <div className="box p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0 space-y-2">
              <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                {display}
              </h1>
              <p className="font-mono text-sm text-[var(--text-muted)]">
                @{u.username}
              </p>
              {u.organization ? (
                <p className="text-sm text-[var(--text-secondary)]">{u.organization}</p>
              ) : null}
              {u.bio ? (
                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap mt-4">
                  {u.bio}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-4 pt-4 text-sm">
                {u.githubUrl ? (
                  <a
                    href={u.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-link)] hover:underline"
                  >
                    GitHub
                  </a>
                ) : null}
                {u.blogUrl ? (
                  <a
                    href={u.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-link)] hover:underline"
                  >
                    블로그
                  </a>
                ) : null}
              </div>
            </div>
            {u.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={u.avatarUrl}
                alt=""
                className="w-24 h-24 rounded-lg object-cover border border-[var(--border-primary)]"
              />
            ) : null}
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[var(--border-primary)]">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                레이팅
              </p>
              <p className="text-xl font-mono text-[var(--accent-green)]">{u.rating}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                해결
              </p>
              <p className="text-xl font-mono text-[var(--text-primary)]">{u.solved}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                티어
              </p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{tier}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                가입
              </p>
              <p className="text-sm font-mono text-[var(--text-secondary)]">
                {u.createdAt.toISOString().slice(0, 10)}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/problems" className="pill-link">
              문제 목록
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
