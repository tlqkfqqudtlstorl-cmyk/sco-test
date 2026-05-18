import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: '회원가입',
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-12">
        <header className="mb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            계정
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            회원가입
          </h1>
        </header>
        <RegisterForm />
      </div>
    </div>
  );
}
