'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { registerAction } from '@/app/actions/auth';

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setPending(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await registerAction(null, fd);
      if (res?.error) {
        setError(res.error);
        setPending(false);
        return;
      }
      if (res?.ok) {
        router.refresh();
        router.push('/');
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
          아이디
        </label>
        <input
          name="username"
          type="text"
          required
          minLength={3}
          maxLength={24}
          pattern="[a-zA-Z0-9_-]+"
          className="input w-full"
          placeholder="alphabet123"
        />
        <p className="mt-1 text-[11px] text-[var(--text-muted)]">
          3–24자, 영문·숫자·_- 만 가능
        </p>
      </div>
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
          minLength={8}
          autoComplete="new-password"
          className="input w-full"
        />
      </div>
      {error ? (
        <p className="text-sm text-[var(--accent-red)]" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? '처리 중…' : '가입하기'}
      </button>
      <p className="text-sm text-[var(--text-muted)]">
        이미 계정이 있나요?{' '}
        <Link href="/login" className="text-[var(--accent-link)]">
          로그인
        </Link>
      </p>
    </form>
  );
}
