'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X, Crown, User, Settings, LogOut } from 'lucide-react';

import { logoutAction } from '@/app/actions/auth';
import { useTheme } from '@/lib/ThemeProvider';
import type { CurrentUserPublic } from '@/lib/auth/current-user';

type Props = {
  user: CurrentUserPublic | null;
};

export default function Navbar({ user }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const label = user?.displayName?.trim() || user?.username;
  const initial = label?.[0]?.toUpperCase() || '?';

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
      <div className="container-app">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/" className="flex shrink-0 items-center gap-2 hover:no-underline">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-white border-[var(--border-strong)]'
                    : 'bg-black border-[var(--border-strong)]'
                }`}
                aria-hidden
              >
                <span className={`text-base font-extrabold leading-none tracking-tight ${theme === 'dark' ? 'text-black' : 'text-white'}`}>sco</span>
              </span>
            </Link>

            <nav className="hidden md:flex md:items-center md:gap-2">
              <Link href="/problems" className={`nav-link ${isActive('/problems') ? 'active' : ''}`}>문제</Link>
              <Link href="/ranking" className={`nav-link ${isActive('/ranking') ? 'active' : ''}`}>랭킹</Link>
              {user ? <Link href="/activity" className={`nav-link ${isActive('/activity') ? 'active' : ''}`}>활동</Link> : null}
              <Link href="/contests" className={`nav-link ${isActive('/contests') ? 'active' : ''}`}>대회</Link>
              <Link href="/subscribe" className={`nav-link inline-flex items-center gap-1.5 ${isActive('/subscribe') ? 'active' : ''}`}>
                <Crown size={14} className="text-[var(--accent-warn)]" />
                구독
              </Link>
              {user?.role === 'ADMIN' ? <Link href="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>관리</Link> : null}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
              aria-label="테마 전환"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
              aria-label="메뉴"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-xs font-bold text-[var(--text-primary)] hover:ring-2 hover:ring-[var(--border-strong)] transition-all overflow-hidden"
                >
                  {user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-xl z-50 py-2">
                    <div className="px-4 py-3 border-b border-[var(--border-primary)]">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{label}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">@{user.username}</p>
                    </div>
                    <Link
                      href={`/users/${user.username}`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] no-underline transition-colors"
                    >
                      <User size={16} />
                      프로필
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] no-underline transition-colors"
                    >
                      <Settings size={16} />
                      설정
                    </Link>

                    <form action={logoutAction} className="border-t border-[var(--border-primary)] pt-1 mt-1">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <LogOut size={16} />
                        로그아웃
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`hidden sm:inline nav-link ${isActive('/login') ? 'active' : ''}`}
                >
                  로그인
                </Link>
                <Link href="/register" className={`hidden sm:inline nav-link ${isActive('/register') ? 'active' : ''}`}>
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
              className={`nav-link-mobile ${isActive('/problems') ? 'active' : ''}`}
            >
              문제
            </Link>
            <Link
              href="/ranking"
              onClick={() => setMenuOpen(false)}
              className={`nav-link-mobile ${isActive('/ranking') ? 'active' : ''}`}
            >
              랭킹
            </Link>
            {user && (
              <Link
                href="/activity"
                onClick={() => setMenuOpen(false)}
                className={`nav-link-mobile ${isActive('/activity') ? 'active' : ''}`}
              >
                활동
              </Link>
            )}
            <Link
              href="/contests"
              onClick={() => setMenuOpen(false)}
              className={`nav-link-mobile ${isActive('/contests') ? 'active' : ''}`}
            >
              대회
            </Link>
            <Link
              href="/subscribe"
              onClick={() => setMenuOpen(false)}
              className={`nav-link-mobile inline-flex items-center gap-2 ${isActive('/subscribe') ? 'active' : ''}`}
            >
              <Crown size={14} className="text-[var(--accent-warn)]" />
              구독
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className={`nav-link-mobile ${isActive('/admin') ? 'active' : ''}`}
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
                  className={`nav-link-mobile ${isActive(`/users/${user.username}`) ? 'active' : ''}`}
                >
                  {label}
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className={`nav-link-mobile ${isActive('/settings') ? 'active' : ''}`}
                >
                  설정
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full text-left nav-link-mobile text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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
                  className={`nav-link-mobile ${isActive('/login') ? 'active' : ''}`}
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className={`nav-link-mobile ${isActive('/register') ? 'active' : ''}`}
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
