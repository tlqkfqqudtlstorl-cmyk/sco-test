'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Check, X } from 'lucide-react';
import { useTheme } from '@/lib/ThemeProvider';
import { subscribeAction, cancelSubscription } from '@/app/actions/subscription';

type Plan = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  features: string;
};

type Sub = {
  id: string;
  status: string;
  endDate: Date | null;
  paymentMethod: string | null;
  plan: Plan;
} | null;

type Props = {
  plans: Plan[];
  currentSub: Sub;
};

const payMethods = [
  { value: 'card', label: '카드' },
  { value: 'account', label: '계좌연결' },
  { value: 'kakao', label: '카카오페이' },
  { value: 'toss', label: '토스페이' },
  { value: 'naver', label: '네이버페이' },
];

export default function SubscribeClient({ plans, currentSub }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [payMethod, setPayMethod] = useState('card');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [payingPlan, setPayingPlan] = useState<Plan | null>(null);

  async function handleSubscribe() {
    if (!payingPlan) return;
    setBusy(true);
    setMsg('');
    const res = await subscribeAction(payingPlan.id, payMethod);
    setBusy(false);
    setPayingPlan(null);
    if (res?.error) setMsg(res.error);
    else {
      setMsg('구독이 완료되었습니다!');
      router.refresh();
    }
  }

  async function handleCancel(subId: string) {
    if (!confirm('정말 구독을 취소하시겠습니까?')) return;
    setBusy(true);
    await cancelSubscription(subId);
    setBusy(false);
    setMsg('구독이 취소되었습니다.');
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {currentSub && (
        <div className="box border border-[var(--accent-warn)]/40">
          <div className="box-body text-center space-y-2">
            <Crown size={24} className="mx-auto text-[var(--accent-warn)]" />
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {currentSub.plan.name} 구독 중
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {currentSub.endDate
                ? `다음 결제일: ${new Date(currentSub.endDate).toLocaleDateString()}`
                : ''}
            </p>
            <button
              type="button"
              onClick={() => handleCancel(currentSub.id)}
              disabled={busy}
              className="btn btn-ghost text-xs py-1 text-[var(--accent-danger)]"
            >
              구독 취소
            </button>
          </div>
        </div>
      )}

      {msg && (
        <p className="text-center text-sm text-[var(--accent-green)]">{msg}</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const features: string[] = JSON.parse(plan.features || '[]');
          const isActive = currentSub?.planId === plan.id;

          return (
            <div
              key={plan.id}
              className={`box overflow-hidden flex flex-col ${
                plan.name === '프로'
                  ? isDark ? 'border-teal-500/50' : 'border-teal-600/40'
                  : isDark ? 'border-lime-600/30' : 'border-lime-500/30'
              } ${isActive ? 'ring-2 ring-[var(--accent-warn)]/50' : ''}`}
            >
              {plan.name === '프로' && !isActive && (
                <div className={`${isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-600/15 text-teal-700'} text-[11px] font-semibold text-center py-1 uppercase tracking-wider`}>
                  추천
                </div>
              )}
              {isActive && (
                <div className="bg-[var(--accent-warn)]/10 text-[var(--accent-warn)] text-[11px] font-semibold text-center py-1 uppercase tracking-wider">
                  현재 구독 중
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {plan.name}
                </h3>
                {plan.description && (
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {plan.description}
                  </p>
                )}
                <p className="mt-4 text-3xl font-bold text-[var(--text-primary)]">
                  {plan.price.toLocaleString()}
                  <span className="text-base font-normal text-[var(--text-muted)]">원/월</span>
                </p>

                {features.length > 0 && (
                  <ul className="mt-6 space-y-2 flex-1">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <Check size={14} className={`mt-0.5 shrink-0 ${plan.name === '프로' ? (isDark ? 'text-teal-400' : 'text-teal-600') : (isDark ? 'text-lime-400' : 'text-lime-600')}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setPayingPlan(plan)}
                    disabled={busy || isActive}
                    className={`btn w-full rounded-md py-2.5 text-sm font-medium disabled:opacity-50 ${
                      plan.name === '프로'
                        ? isDark
                          ? 'bg-teal-600 text-white hover:bg-teal-500'
                          : 'bg-teal-700 text-white hover:bg-teal-600'
                        : isDark
                          ? 'bg-lime-800 text-white hover:bg-lime-700'
                          : 'bg-lime-600 text-white hover:bg-lime-500'
                    }`}
                  >
                    {isActive ? '이미 구독 중' : `${plan.name} 시작하기`}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {payingPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => !busy && setPayingPlan(null)}
        >
          <div
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-primary)]">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {payingPlan.name} 구독
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {payingPlan.price.toLocaleString()}원/월
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPayingPlan(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-[var(--text-muted)]">결제 수단 선택</p>
              <div className="space-y-2">
                {payMethods.map((m) => (
                  <label
                    key={m.value}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md border cursor-pointer transition-colors ${
                      payMethod === m.value
                        ? 'border-[var(--accent-link)] bg-[var(--accent-link)]/5'
                        : 'border-[var(--border-primary)] bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      value={m.value}
                      checked={payMethod === m.value}
                      onChange={(e) => setPayMethod(e.target.value)}
                      className="accent-[var(--accent-link)]"
                    />
                    <span className="text-sm text-[var(--text-primary)]">{m.label}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={busy}
                className={`btn w-full rounded-md py-2.5 text-sm font-medium disabled:opacity-50 ${
                  payingPlan.name === '프로'
                    ? isDark
                      ? 'bg-teal-600 text-white hover:bg-teal-500'
                      : 'bg-teal-700 text-white hover:bg-teal-600'
                    : isDark
                      ? 'bg-lime-800 text-white hover:bg-lime-700'
                      : 'bg-lime-600 text-white hover:bg-lime-500'
                }`}
              >
                {busy ? '처리 중…' : `${payingPlan.price.toLocaleString()}원 결제하기`}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-[var(--text-muted)]">
        결제는 데모 모드입니다. 실제 결제가 이루어지지 않습니다.
      </p>
    </div>
  );
}
