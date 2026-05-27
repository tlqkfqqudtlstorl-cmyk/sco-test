import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: '로그인',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-12">
        <header className="mb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            계정
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            로그인
          </h1>
        </header>
        <LoginForm nextPath={sp.next} error={sp.error} />
      </div>
    </div>
  );
}
