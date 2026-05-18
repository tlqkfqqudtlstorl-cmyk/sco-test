import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUserOptional } from '@/lib/auth/current-user';

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

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-12 max-w-2xl">
        <header className="mb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            운영
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            관리자
          </h1>
        </header>
        <div className="box p-6 space-y-4 text-[var(--text-secondary)]">
          <p>
            문제 CRUD·유저 관리·신고 처리 등은 Phase 3 범위입니다. 현재는 역할
            검증만 연결되어 있습니다.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>데이터베이스 백업 및 마이그레이션은 배포 환경에서 수행하세요.</li>
            <li>시드 계정 비밀번호는 개발용입니다. 운영 전 반드시 교체하세요.</li>
          </ul>
          <Link href="/problems" className="pill-link inline-block">
            문제 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
