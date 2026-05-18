'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { loginAction } from '@/app/actions/auth';

type Props = {
  nextPath?: string;
};

export default function LoginForm({ nextPath }: Props) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setPending(true);
    const fd = new FormData(e.currentTarget);
    if (nextPath) fd.set('next', nextPath);
    try {
      const res = await loginAction(null, fd);
      if (res?.error) {
        setError(res.error);
        setPending(false);
        return;
      }
      if (res?.ok) {
        router.refresh();
        router.push(res.next ?? '/');
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md">
      <input type="hidden" name="next" value={nextPath ?? ''} />
      <div>
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
          이메일
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="input w-full"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
          비밀번호
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input w-full"
        />
      </div>
      {error ? (
        <p className="text-sm text-[var(--accent-red)]" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? '처리 중…' : '로그인'}
      </button>
      <p className="text-sm text-[var(--text-muted)]">
        계정이 없으신가요?{' '}
        <Link href="/register" className="text-[var(--accent-link)]">
          회원가입
        </Link>
      </p>
    </form>
  );
}
