'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import CategoryTrackIcon from '@/components/category/CategoryTrackIcon';
import type { CategoryNav, ProblemListItemClient } from '@/types';

type Props = {
  problems: ProblemListItemClient[];
  categories: CategoryNav[];
  activeCategorySlug?: string | null;
  activeSubSlug?: string | null;
  /** 현재 로그인 사용자 기준 AC 문제 번호(미로그인이면 빈 배열) */
  solvedNumbers?: number[];
};

function difficultyClass(d: string) {
  const x = d.toLowerCase();
  if (x === 'easy') return 'diff-easy';
  if (x === 'medium') return 'diff-medium';
  return 'diff-hard';
}

function difficultyLabel(d: string) {
  const x = d.toUpperCase();
  if (x === 'EASY') return '쉬움';
  if (x === 'MEDIUM') return '보통';
  return '어려움';
}

export default function ProblemsExplorerClient({
  problems,
  categories,
  activeCategorySlug,
  activeSubSlug,
  solvedNumbers = [],
}: Props) {
  const [search, setSearch] = useState('');
  const [diff, setDiff] = useState('all');
  const solvedSet = useMemo(() => new Set(solvedNumbers), [solvedNumbers]);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) || p.number.toString().includes(search);
      const matchDiff =
        diff === 'all' || p.difficulty.toLowerCase() === diff;
      return matchSearch && matchDiff;
    });
  }, [problems, search, diff]);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)] problems-explorer">
      <div className="container-app py-10">
        <header className="mb-8 animate-in">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            문제 목록
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] tracking-tight">
                문제
              </h1>
              <p className="mt-2 max-w-xl text-sm text-[var(--text-secondary)]">
                트랙·난이도로 고릅니다. 로그인 후 제출하면 내 활동·랭킹에 반영됩니다.
              </p>
            </div>
            <Link href="/ranking" className="pill-link self-start">
              랭킹 보기
            </Link>
          </div>
        </header>

        <div className="mb-6 overflow-x-auto pb-1 animate-in">
          <div className="flex gap-2 min-w-max items-center">
            <Link
              href="/problems"
              className={clsx(
                'track-pill no-underline',
                !activeCategorySlug && 'track-pill-active',
              )}
            >
              전체
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/problems/category/${c.slug}`}
                className={clsx(
                  'track-pill inline-flex items-center gap-1.5 no-underline',
                  activeCategorySlug === c.slug && !activeSubSlug && 'track-pill-active',
                )}
              >
                <CategoryTrackIcon slug={c.slug} className="h-3.5 w-3.5 shrink-0 opacity-80" />
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          <aside className="xl:w-64 flex-shrink-0 space-y-4">
            <div className="box overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  카테고리
                </span>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  하위 주제까지 바로 이동
                </p>
              </div>
              <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
                <Link
                  href="/problems"
                  className={clsx(
                    'nav-row no-underline',
                    !activeCategorySlug && 'nav-row-active',
                  )}
                >
                  전체 문제
                </Link>
                {categories.map((c) => (
                  <div key={c.slug} className="rounded-md border border-[var(--border-secondary)] bg-[var(--bg-primary)]/40">
                    <Link
                      href={`/problems/category/${c.slug}`}
                      className={clsx(
                        'nav-row nav-row-parent flex items-center gap-2 no-underline',
                        activeCategorySlug === c.slug && 'nav-row-active-soft',
                      )}
                    >
                      <span className="inline-flex shrink-0" aria-hidden>
                        <CategoryTrackIcon slug={c.slug} className="h-3.5 w-3.5 opacity-80" />
                      </span>
                      {c.name}
                    </Link>
                    <div className="px-2 pb-2 space-y-0.5">
                      {c.subCategories.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/problems/category/${c.slug}/${s.slug}`}
                          className={clsx(
                            'nav-row nav-row-child no-underline',
                            activeCategorySlug === c.slug &&
                              activeSubSlug === s.slug &&
                              'nav-row-active',
                          )}
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="번호 또는 제목 검색…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiff(d)}
                    className={clsx(
                      'filter-chip',
                      diff === d && 'filter-chip-active',
                    )}
                  >
                    {d === 'all'
                      ? '전체'
                      : d === 'easy'
                        ? '쉬움'
                        : d === 'medium'
                          ? '보통'
                          : '어려움'}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const pick = filtered[Math.floor(Math.random() * filtered.length)];
                    if (pick) window.location.href = `/problems/${pick.number}`;
                  }}
                  className="btn btn-ghost text-sm py-1"
                  disabled={filtered.length === 0}
                >
                  랜덤
                </button>
              </div>
            </div>

            <div className="box overflow-hidden animate-in">
              <div className="px-4 py-3 border-b border-[var(--border-primary)] flex flex-wrap items-center justify-between gap-2 bg-[var(--bg-tertiary)]">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  문제 목록
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {filtered.length}개 표시
                </span>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th className="w-16">번호</th>
                      <th>제목</th>
                      <th className="w-36 hidden lg:table-cell">분류</th>
                      <th className="w-28 text-center">난이도</th>
                      <th className="w-24 text-center hidden sm:table-cell">정답률</th>
                      <th className="w-24 text-center hidden md:table-cell">시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const solved = solvedSet.has(p.number);
                      return (
                        <tr key={p.id}>
                          <td className="font-mono text-[var(--text-muted)] align-middle">
                            {p.number}
                          </td>
                          <td className="align-middle">
                            <div className="flex flex-wrap items-center gap-2">
                              <Link
                                href={`/problems/${p.number}`}
                                className="text-[var(--text-primary)] hover:text-[var(--accent-blue)] no-underline font-medium"
                              >
                                {p.title}
                              </Link>
                              {solved && (
                                <span className="badge badge-green text-[10px] px-2 py-0.5">
                                  AC
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {(p.tags.length ? p.tags : []).slice(0, 4).map((t) => (
                                <span key={t} className="tag-chip">
                                  {t}
                                </span>
                              ))}
                              {p.tags.length === 0 && (
                                <span className="text-xs text-[var(--text-muted)]">
                                  {p.categoryName}
                                  {p.subCategoryName ? ` · ${p.subCategoryName}` : ''}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="hidden lg:table-cell text-xs text-[var(--text-secondary)] align-middle">
                            {p.categoryName}
                            {p.subCategoryName ? ` / ${p.subCategoryName}` : ''}
                          </td>
                          <td className="text-center align-middle">
                            <span
                              className={clsx(
                                'text-xs font-semibold uppercase tracking-wide',
                                difficultyClass(p.difficulty),
                              )}
                            >
                              {difficultyLabel(p.difficulty)}
                            </span>
                          </td>
                          <td className="text-center text-sm text-[var(--text-secondary)] align-middle hidden sm:table-cell">
                            {p.acceptanceRate}%
                          </td>
                          <td className="text-center text-sm text-[var(--text-muted)] font-mono align-middle hidden md:table-cell">
                            {p.timeLimit}ms
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-14 text-[var(--text-secondary)] text-sm">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
