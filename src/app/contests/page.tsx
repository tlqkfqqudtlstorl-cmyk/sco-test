import Link from 'next/link';

export const metadata = {
  title: '대회',
};

export default function ContestsPage() {
  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-12 max-w-2xl">
        <header className="mb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            대회
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            준비 중
          </h1>
          <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
            대회 생성·참가·랭킹 동결 등은 이후 단계에서 연동할 예정입니다. 지금은{' '}
            <Link href="/problems" className="text-[var(--accent-link)]">
              연습 문제
            </Link>
            과{' '}
            <Link href="/ranking" className="text-[var(--accent-link)]">
              랭킹
            </Link>
            을 이용해 주세요.
          </p>
        </header>
      </div>
    </div>
  );
}
