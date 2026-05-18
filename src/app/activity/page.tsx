import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUserOptional } from '@/lib/auth/current-user';
import { listSubmissionsForUser } from '@/lib/activity-db';
import ActivityClient from '@/components/ActivityClient';

export const metadata = {
  title: '활동',
};

export default async function ActivityPage() {
  const user = await getCurrentUserOptional();
  if (!user) {
    redirect('/login?next=/activity');
  }

  const submissions = await listSubmissionsForUser(user.id, 200);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-10">
        <header className="mb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            제출
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            내 활동
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            최근 제출 내역입니다. 행을 클릭하면 제출한 코드를 볼 수 있습니다.
          </p>
        </header>

        <ActivityClient submissions={submissions} />
      </div>
    </div>
  );
}
