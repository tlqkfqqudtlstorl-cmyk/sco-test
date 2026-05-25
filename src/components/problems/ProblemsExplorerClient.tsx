'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Search, CheckCircle, ChevronDown } from 'lucide-react';
import CategoryTrackIcon from '@/components/category/CategoryTrackIcon';
import type { CategoryNav, ProblemListItemClient } from '@/types';

const CATEGORY_GROUPS = [
  { label: '프로그래밍 언어', slugs: new Set(['python', 'javascript', 'cpp', 'java']) },
  { label: '보안/CTF', slugs: new Set(['security', 'ctf']) },
] as const;
const GROUPED_SLUGS = new Set(CATEGORY_GROUPS.flatMap((g) => [...g.slugs]));

type Props = {
  problems: ProblemListItemClient[];
  categories: CategoryNav[];
  activeCategorySlug?: string | null;
  activeSubSlug?: string | null;
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
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const solvedSet = useMemo(() => new Set(solvedNumbers), [solvedNumbers]);

  const groupedCats = useMemo(() => {
    const map: Record<string, CategoryNav[]> = {};
    CATEGORY_GROUPS.forEach((g) => { map[g.label] = []; });
    categories.forEach((c) => {
      const group = CATEGORY_GROUPS.find((g) => g.slugs.has(c.slug));
      if (group) map[group.label].push(c);
    });
    return map;
  }, [categories]);

  const loneCats = useMemo(
    () => categories.filter((c) => !GROUPED_SLUGS.has(c.slug)),
    [categories],
  );

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const q = search.trim().toLowerCase();
      if (q) {
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchNum = p.number.toString().includes(q);
        if (!matchTitle && !matchNum) return false;
      }
      if (diff !== 'all' && p.difficulty.toLowerCase() !== diff) return false;
      return true;
    });
  }, [problems, search, diff]);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-8 md:py-10">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
            문제
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            카테고리와 난이도로 문제를 골라보세요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <Link
            href="/problems"
            className={clsx(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium no-underline transition-colors border',
              !activeCategorySlug
                ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)]'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--border-strong)]',
            )}
          >
            <CheckCircle size={13} />
            전체
          </Link>
          {loneCats.map((c) => {
            const active = activeCategorySlug === c.slug && !activeSubSlug;
            return (
              <Link
                key={c.slug}
                href={`/problems/category/${c.slug}`}
                className={clsx(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium no-underline transition-colors border',
                  active
                    ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--border-strong)]',
                )}
              >
                <CategoryTrackIcon slug={c.slug} className="h-3.5 w-3.5 shrink-0" />
                {c.name}
              </Link>
            );
          })}
          {CATEGORY_GROUPS.map((group) => {
            const cats = groupedCats[group.label];
            const isOpen = openGroup === group.label;
            const anyActive = cats.some((c) => activeCategorySlug === c.slug && !activeSubSlug);
            return (
              <div key={group.label} ref={(el) => { groupRefs.current[group.label] = el; }} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : group.label)}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border no-underline cursor-pointer',
                    anyActive
                      ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)]'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--border-strong)]',
                  )}
                >
                  <ChevronDown size={13} />
                  {group.label}
                </button>
                {isOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenGroup(null)} />
                    <div className="absolute left-0 top-full mt-1.5 z-20 min-w-[170px] rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-1.5 shadow-lg space-y-0.5">
                      {cats.map((c) => {
                        const active = activeCategorySlug === c.slug && !activeSubSlug;
                        return (
                          <Link
                            key={c.slug}
                            href={`/problems/category/${c.slug}`}
                            onClick={() => setOpenGroup(null)}
                            className={clsx(
                              'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium no-underline transition-colors',
                              active
                                ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
                            )}
                          >
                            <CategoryTrackIcon slug={c.slug} className="h-3.5 w-3.5 shrink-0" />
                            {c.name}
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="문제 번호 또는 이름 검색…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full text-sm"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDiff(d)}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border no-underline',
                  diff === d
                    ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--border-strong)]',
                )}
              >
                {d === 'all' ? '전체' : d === 'easy' ? '쉬움' : d === 'medium' ? '보통' : '어려움'}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                const pick = filtered[Math.floor(Math.random() * filtered.length)];
                if (pick) window.location.href = `/problems/${pick.number}`;
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border no-underline bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--border-strong)]"
              disabled={filtered.length === 0}
            >
              랜덤
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[var(--border-primary)] flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {filtered.length}개 문제
            </span>
            <Link
              href="/ranking"
              className="text-xs text-[var(--accent-blue)] hover:underline no-underline"
            >
              랭킹 보기 &rarr;
            </Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="w-16">번호</th>
                  <th>제목</th>
                  <th className="w-28 text-center">난이도</th>
                  <th className="w-24 text-center hidden sm:table-cell">정답률</th>
                  <th className="w-24 text-center hidden md:table-cell">완료</th>
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
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/problems/${p.number}`}
                            className="text-[var(--text-primary)] hover:text-[var(--accent-blue)] no-underline font-medium"
                          >
                            {p.title}
                          </Link>
                          {solved && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[var(--accent-positive)]">
                              <CheckCircle size={11} />
                              완료
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex flex-wrap gap-1.5">
                          <span className="text-[11px] text-[var(--text-muted)]">
                            {p.categoryName}
                            {p.subCategoryName ? ` · ${p.subCategoryName}` : ''}
                          </span>
                          {p.tags.slice(0, 3).map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="text-center align-middle">
                        <span
                          className={clsx(
                            'text-xs font-semibold',
                            difficultyClass(p.difficulty),
                          )}
                        >
                          {difficultyLabel(p.difficulty)}
                        </span>
                      </td>
                      <td className="text-center text-sm text-[var(--text-secondary)] align-middle hidden sm:table-cell">
                        {p.acceptanceRate}%
                      </td>
                      <td className="text-center align-middle hidden md:table-cell">
                        {solved ? (
                          <span className="text-xs font-medium text-[var(--accent-positive)]">✓</span>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)]">—</span>
                        )}
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
  );
}