import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mail, Globe, Calendar, Trophy, CheckCircle, Clock, ExternalLink, Code2, MapPin, Medal, Target } from 'lucide-react';

import { tierFromRating } from '@/lib/ranking-db';
import { getPublicProfileByUsername } from '@/lib/profile-db';
import { listSubmissionsForUser } from '@/lib/activity-db';
import { listSolvedProblemNumbersForUser } from '@/lib/problems-db';
import { getCurrentUserOptional } from '@/lib/auth/current-user';
import ProfileAvatar from '@/components/ProfileAvatar';
import ProfileStatsCharts from '@/components/ProfileStatsCharts';
import { TierIcon } from '@/components/TierIcon';

const TIER_META: Record<string, { color: string; bg: string; border: string; label: string }> = {
  자갈:    { color: 'text-[var(--text-muted)]', bg: 'bg-[var(--bg-tertiary)]', border: 'border-[var(--border-primary)]', label: 'Gravel' },
  돌멩이:  { color: 'text-[var(--text-secondary)]', bg: 'bg-[var(--bg-tertiary)]', border: 'border-[var(--border-primary)]', label: 'Pebble' },
  암석:    { color: 'text-[var(--text-secondary)]', bg: 'bg-[var(--bg-tertiary)]', border: 'border-[var(--border-primary)]', label: 'Rock' },
  광석:    { color: 'text-[var(--text-primary)]', bg: 'bg-[var(--bg-tertiary)]', border: 'border-[var(--border-primary)]', label: 'Ore' },
  수정:    { color: 'text-[var(--accent-positive)]', bg: 'bg-[var(--bg-tertiary)]', border: 'border-[var(--border-primary)]', label: 'Crystal' },
  자수정:  { color: 'text-[var(--accent-link)]', bg: 'bg-[var(--bg-tertiary)]', border: 'border-[var(--border-primary)]', label: 'Amethyst' },
  사파이어:{ color: 'text-[var(--accent-link)]', bg: 'bg-[var(--bg-tertiary)]', border: 'border-[var(--border-primary)]', label: 'Sapphire' },
  다이아몬드:{ color: 'text-[var(--accent-positive)]', bg: 'bg-[var(--bg-tertiary)]', border: 'border-[var(--border-primary)]', label: 'Diamond' },
};

const STATUS_BADGE: Record<string, string> = {
  AC: 'bg-green-500/15 text-green-400',
  WA: 'bg-red-500/15 text-red-400',
  TLE: 'bg-yellow-500/15 text-yellow-400',
  MLE: 'bg-orange-500/15 text-orange-400',
  CE: 'bg-gray-500/15 text-gray-400',
  RE: 'bg-pink-500/15 text-pink-400',
  PENDING: 'bg-blue-500/15 text-blue-400',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const u = await getPublicProfileByUsername(username);
  if (!u) return { title: '사용자' };
  return { title: u.displayName?.trim() || u.username };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [u, currentUser] = await Promise.all([
    getPublicProfileByUsername(username),
    getCurrentUserOptional(),
  ]);
  if (!u) notFound();

  const isOwner = currentUser?.id === u.id;
  const display = u.displayName?.trim() || u.username;
  const initial = display[0]?.toUpperCase() || '?';
  const tierObj = tierFromRating(u.rating);
  const meta = TIER_META[tierObj.name];
  const solvedNums = await listSolvedProblemNumbersForUser(u.id);
  const allSubmissions = await listSubmissionsForUser(u.id, 500);
  const submissions = allSubmissions.slice(0, 5);

  const diffBreakdown = { easy: 0, medium: 0, hard: 0 };
  const statusBreakdown: Record<string, number> = {};
  const langBreakdown: Record<string, number> = {};
  let acCount = 0;
  for (const s of allSubmissions) {
    const d = s.problem.difficulty.toLowerCase();
    if (d in diffBreakdown) diffBreakdown[d as keyof typeof diffBreakdown]++;
    statusBreakdown[s.status] = (statusBreakdown[s.status] || 0) + 1;
    if (s.language) langBreakdown[s.language] = (langBreakdown[s.language] || 0) + 1;
    if (s.status === 'AC') acCount++;
  }

  const today = new Date();
  const last14: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = allSubmissions.filter(
      (s) => s.createdAt.toISOString().slice(0, 10) === key,
    ).length;
    last14.push({ date: key, count });
  }

  const statsData = {
    difficultyBreakdown: diffBreakdown,
    statusBreakdown,
    languageBreakdown: langBreakdown,
    dailyActivity: last14,
    totalSubmissions: allSubmissions.length,
    acCount,
  };

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 text-center shadow-sm">
              <div className="mb-4">
                <ProfileAvatar src={u.avatarUrl} initial={initial} isOwner={isOwner} />
              </div>

              <h1 className="text-xl font-bold text-[var(--text-primary)]">{display}</h1>
              <p className="font-mono text-sm text-[var(--text-muted)] mt-0.5">@{u.username}</p>

              <div className="flex items-center justify-center gap-2 mt-3">
                {u.role === 'ADMIN' && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">ADMIN</span>
                )}
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${meta.bg} ${meta.color} ${meta.border} border`}>
                  <TierIcon name={tierObj.name} className="h-5 w-5" />
                  <span>{tierObj.name}</span>
                </span>
              </div>

              {u.bio && (
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-4 whitespace-pre-wrap">{u.bio}</p>
              )}

              <div className="mt-5 space-y-2.5 text-left">
                {u.organization && (
                  <div className="flex items-center gap-2.5 text-sm text-[var(--text-muted)]">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{u.organization}</span>
                  </div>
                )}
                {isOwner && currentUser?.email && (
                  <div className="flex items-center gap-2.5 text-sm text-[var(--text-muted)]">
                    <Mail size={14} className="shrink-0" />
                    <span className="truncate">{currentUser.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-sm text-[var(--text-muted)]">
                  <Calendar size={14} className="shrink-0" />
                  <span>{u.createdAt.toISOString().slice(0, 10)} 가입</span>
                </div>
              </div>

              <div className="mt-5 flex justify-center gap-3">
                {u.githubUrl && (
                  <a href={u.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors no-underline">
                    <Code2 size={12} /> GitHub
                  </a>
                )}
                {u.blogUrl && (
                  <a href={u.blogUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors no-underline">
                    <Globe size={12} /> 블로그
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 shadow-sm">
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-4 flex items-center gap-2">
                <Medal size={14} className={meta.color} />
                통계
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-4 text-center">
                  <p className={`text-2xl font-bold font-mono ${meta.color}`}>{u.rating}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">레이팅</p>
                </div>
                <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-4 text-center">
                  <p className="text-2xl font-bold font-mono text-[var(--accent-positive)]">{u.solved}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">해결</p>
                </div>
                <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-4 text-center">
                  <p className="text-2xl font-bold font-mono text-[var(--text-primary)]">{submissions.length}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">제출</p>
                </div>
              </div>
            </div>

            {solvedNums.length > 0 && (
              <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 shadow-sm">
                <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-4 flex items-center gap-2">
                  <CheckCircle size={14} className="text-[var(--accent-positive)]" />
                  푼 문제 · {solvedNums.length}개
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {solvedNums.slice(0, 60).map((n) => (
                    <Link key={n} href={`/problems/${n}`}
                      className="inline-flex items-center justify-center w-9 h-9 text-xs font-mono font-semibold rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--accent-positive)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-positive)] no-underline transition-colors">
                      {n}
                    </Link>
                  ))}
                  {solvedNums.length > 60 && (
                    <span className="inline-flex items-center justify-center w-9 h-9 text-xs font-mono text-[var(--text-muted)]">+{solvedNums.length - 60}</span>
                  )}
                </div>
              </div>
            )}

            {submissions.length > 0 && (
              <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 shadow-sm">
                <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Clock size={14} className="text-[var(--text-secondary)]" />
                  최근 제출
                </h2>
                <div className="space-y-1">
                  {submissions.map((s) => (
                    <Link key={s.id} href={`/problems/${s.problem.id}`}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors no-underline">
                      <span className="font-mono text-[var(--text-muted)] shrink-0 w-10">#{s.problem.number}</span>
                      <span className="flex-1 truncate">{s.problem.title}</span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md shrink-0 ${STATUS_BADGE[s.status] || 'bg-gray-500/15 text-gray-400'}`}>{s.status}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Link href="/problems" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] no-underline transition-colors shadow-sm">
                <Target size={14} /> 문제 풀러 가기
              </Link>
              <Link href="/ranking" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] no-underline transition-colors shadow-sm">
                <Trophy size={14} /> 랭킹 보기
              </Link>
            </div>

            {allSubmissions.length > 0 && (
              <ProfileStatsCharts stats={statsData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
