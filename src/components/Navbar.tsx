'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, Menu, X, Crown } from 'lucide-react';

import { logoutAction } from '@/app/actions/auth';
import { useTheme } from '@/lib/ThemeProvider';
import type { CurrentUserPublic } from '@/lib/auth/current-user';

type Props = {
  user: CurrentUserPublic | null;
};

export default function Navbar({ user }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const label = user?.displayName?.trim() || user?.username;

  return (
    <header className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
      <div className="container-app">
        <div className="flex h-24 items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-10">
            <Link href="/" className="flex shrink-0 items-center gap-2 hover:no-underline">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-white border-[var(--border-strong)]'
                    : 'bg-black border-[var(--border-strong)]'
                }`}
                aria-hidden
              >
                <span className={`text-2xl font-extrabold leading-none tracking-tight ${theme === 'dark' ? 'text-black' : 'text-white'}`}>sco</span>
              </span>
            </Link>

            <nav className="hidden md:flex md:items-center md:gap-2">
              <Link
                href="/problems"
                className="px-3 py-2 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:no-underline rounded-md transition-colors"
              >
                문제
              </Link>
              <Link
                href="/ranking"
                className="px-3 py-2 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:no-underline rounded-md transition-colors"
              >
                랭킹
              </Link>
              {user ? (
                <Link
                  href="/activity"
                  className="px-3 py-2 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:no-underline rounded-md transition-colors"
                >
                  활동
                </Link>
              ) : null}
              <Link
                href="/contests"
                className="px-3 py-2 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:no-underline rounded-md transition-colors"
              >
                대회
              </Link>
              <Link
                href="/subscribe"
                className="px-3 py-2 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:no-underline rounded-md transition-colors inline-flex items-center gap-1.5"
              >
                <Crown size={14} className="text-[var(--accent-warn)]" />
                구독
              </Link>
              {user?.role === 'ADMIN' ? (
                <Link
                  href="/admin"
                  className="px-3 py-2 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:no-underline rounded-md transition-colors"
                >
                  관리
                </Link>
              ) : null}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-5">
            <button
              type="button"
              onClick={toggleTheme}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
              aria-label="테마 전환"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
              aria-label="메뉴"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {user ? (
              <>
                <Link
                  href={`/users/${user.username}`}
                  className="hidden sm:inline max-w-[180px] truncate px-2 py-1.5 text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:no-underline rounded-md transition-colors"
                >
                  {label}
                </Link>
                <Link
                  href="/settings"
                  className="hidden sm:inline px-2 py-1.5 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:no-underline rounded-md transition-colors"
                >
                  설정
                </Link>
                <form action={logoutAction} className="hidden sm:block">
                  <button
                    type="submit"
                    className="px-2 py-1.5 text-base text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
                  >
                    로그아웃
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline px-2 py-1.5 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:no-underline rounded-md transition-colors"
                >
                  로그인
                </Link>
                <Link href="/register" className="hidden sm:inline px-2 py-1.5 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:no-underline rounded-md transition-colors">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] animate-in">
          <div className="container-app py-4 space-y-1">
            <Link
              href="/problems"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
            >
              문제
            </Link>
            <Link
              href="/ranking"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
            >
              랭킹
            </Link>
            {user && (
              <Link
                href="/activity"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
              >
                활동
              </Link>
            )}
            <Link
              href="/contests"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
            >
              대회
            </Link>
            <Link
              href="/subscribe"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors inline-flex items-center gap-2"
            >
              <Crown size={14} className="text-[var(--accent-warn)]" />
              구독
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
              >
                관리
              </Link>
            )}
            <hr className="border-[var(--border-primary)] my-2" />
            {user ? (
              <>
                <Link
                  href={`/users/${user.username}`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
                >
                  {label}
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
                >
                  설정
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-3 text-base text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
                  >
                    로그아웃
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
