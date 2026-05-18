import { listPlans, getUserSubscription } from '@/app/actions/subscription';
import SubscribeClient from './SubscribeClient';

export const metadata = { title: '구독' };

export default async function SubscribePage() {
  const [plans, sub] = await Promise.all([listPlans(), getUserSubscription()]);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-10 max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
            sco Premium
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            구독 플랜
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            프리미엄 문제를 풀고 더 많은 기능을 이용하세요
          </p>
        </header>

        <SubscribeClient plans={plans} currentSub={sub} />
      </div>
    </div>
  );
}
