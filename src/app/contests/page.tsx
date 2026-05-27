import Link from 'next/link';
import { registerContestAction } from '@/app/actions/contest';
import { getCurrentUserOptional } from '@/lib/auth/current-user';
import { listPublicContests } from '@/lib/contest-db';

export const metadata = {
  title: '대회',
};

function label(status: string) {
  return {
    UPCOMING: '예정',
    REGISTERING: '신청 중',
    RUNNING: '진행 중',
    FROZEN: '프리즈',
    FINISHED: '종료',
    REVEALED: '공개 완료',
  }[status] ?? status;
}

export default async function ContestsPage() {
  const [user, contests] = await Promise.all([
    getCurrentUserOptional(),
    listPublicContests(),
  ]);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-12 max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            대회
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            대회 목록
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            공개 대회 참가 신청과 문제 구성을 확인할 수 있습니다.
          </p>
        </header>

        <div className="space-y-4">
          {contests.map((contest) => {
            const joined = contest.participants.some((p) => p.userId === user?.id);
            return (
              <section key={contest.id} className="box p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        {contest.title}
                      </h2>
                      <span className="badge badge-blue">{label(contest.status)}</span>
                      {contest.isRated ? <span className="badge badge-green">레이팅</span> : null}
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      {contest.description}
                    </p>
                  </div>
                  <form action={async () => {
                    'use server';
                    await registerContestAction(contest.id);
                  }}>
                    <button
                      className="btn btn-primary text-sm"
                      disabled={joined || contest.status === 'RUNNING' || contest.status === 'FINISHED'}
                    >
                      {joined ? '신청 완료' : '참가 신청'}
                    </button>
                  </form>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-[var(--text-secondary)] sm:grid-cols-4">
                  <span>형식 {contest.format}</span>
                  <span>문제 {contest._count.problems}</span>
                  <span>참가 {contest._count.participants}</span>
                  <span>{contest.startTime.toISOString().slice(0, 16).replace('T', ' ')}</span>
                </div>
              </section>
            );
          })}
          {contests.length === 0 ? (
            <div className="box p-6 text-sm text-[var(--text-secondary)]">
              공개 대회가 없습니다. <Link href="/problems" className="text-[var(--accent-link)]">연습 문제</Link>를 이용해 주세요.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
