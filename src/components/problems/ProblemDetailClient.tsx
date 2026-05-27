'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { ProblemClient } from '@/types';
import CodeEditor from '@/components/CodeEditor';

type Props = {
  problem: ProblemClient;
  categorySlug: string;
  categoryName: string;
  subCategorySlug?: string | null;
  subCategoryName?: string | null;
  isSolved?: boolean;
  isLoggedIn?: boolean;
  prevProblem?: { number: number; title: string };
  nextProblem?: { number: number; title: string };
};

export default function ProblemDetailClient({
  problem,
  categorySlug,
  categoryName,
  subCategorySlug,
  subCategoryName,
  isSolved = false,
  isLoggedIn = false,
  prevProblem,
  nextProblem,
}: Props) {
  const [tab, setTab] = useState<'desc' | 'input' | 'output'>('desc');

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="border-b border-[var(--border-primary)] bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)]">
        <div className="container-app py-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
            <Link href="/problems" className="hover:text-[var(--text-primary)] no-underline">
              문제
            </Link>
            <span className="opacity-50">/</span>
            <Link
              href={`/problems/category/${categorySlug}`}
              className="hover:text-[var(--text-primary)] no-underline"
            >
              {categoryName}
            </Link>
            {subCategorySlug && subCategoryName && (
              <>
                <span className="opacity-50">/</span>
                <Link
                  href={`/problems/category/${categorySlug}/${subCategorySlug}`}
                  className="hover:text-[var(--text-primary)] no-underline"
                >
                  {subCategoryName}
                </Link>
              </>
            )}
            <span className="opacity-50">/</span>
            <span className="text-[var(--text-primary)] font-mono">{problem.number}</span>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                  {problem.title}
                </h1>
                {isSolved && (
                  <span className="badge badge-green">풀이 완료</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {problem.tags.slice(0, 6).map((t) => (
                  <span key={t} className="tag-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 text-xs text-[var(--text-secondary)]">
              <div className="flex flex-wrap justify-end gap-2">
                <span
                  className={clsx(
                    'px-2 py-1 rounded border text-[11px] font-semibold uppercase tracking-wide',
                    problem.difficulty === 'EASY' &&
                      'border-[rgba(63,185,80,0.45)] text-[var(--accent-green)] bg-[rgba(63,185,80,0.12)]',
                    problem.difficulty === 'MEDIUM' &&
                      'border-[rgba(210,153,34,0.45)] text-[var(--accent-orange)] bg-[rgba(210,153,34,0.12)]',
                    problem.difficulty === 'HARD' &&
                      'border-[rgba(248,81,73,0.45)] text-[var(--accent-red)] bg-[rgba(248,81,73,0.12)]',
                  )}
                >
                  {problem.difficulty === 'EASY'
                    ? '쉬움'
                    : problem.difficulty === 'MEDIUM'
                      ? '보통'
                      : '어려움'}
                </span>
                {problem.type === 'VERIFIED' && (
                  <span className="badge badge-blue">검증</span>
                )}
                {problem.type === 'COUNTEREXAMPLE' && (
                  <span className="badge badge-chrome">sco</span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 font-mono text-[11px]">
                <span>{problem.timeLimit}ms</span>
                <span>{problem.memoryLimit}MB</span>
                <span>정답률 {problem.acceptanceRate}%</span>
              </div>
              <div className="flex gap-2 mt-2">
                {prevProblem ? (
                  <Link
                    href={`/problems/${prevProblem.number}`}
                    className="btn btn-ghost text-[11px] py-1 no-underline hover:no-underline"
                  >
                    ← {prevProblem.number}
                  </Link>
                ) : (
                  <span className="btn btn-ghost text-[11px] py-1 opacity-30 cursor-not-allowed">←</span>
                )}
                {nextProblem ? (
                  <Link
                    href={`/problems/${nextProblem.number}`}
                    className="btn btn-ghost text-[11px] py-1 no-underline hover:no-underline"
                  >
                    {nextProblem.number} →
                  </Link>
                ) : (
                  <span className="btn btn-ghost text-[11px] py-1 opacity-30 cursor-not-allowed">→</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-6">
        <div
          className="flex flex-col lg:flex-row gap-4"
          style={{ minHeight: 'calc(100vh - 200px)' }}
        >
          <div className="lg:w-1/2 box overflow-hidden flex flex-col min-h-[320px]">
            <div className="flex border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]">
              {(
                [
                  { id: 'desc' as const, label: '문제' },
                  { id: 'input' as const, label: '입력' },
                  { id: 'output' as const, label: '출력' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={clsx(
                    'px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors',
                    tab === t.id
                      ? 'text-[var(--text-primary)] border-[var(--accent-chrome)]'
                      : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-5 text-sm leading-relaxed text-[var(--text-secondary)]">
              {tab === 'desc' && (
                <>
                  <div className="whitespace-pre-wrap text-[var(--text-primary)]/90">
                    {problem.description}
                  </div>
                  {problem.imageUrl && (
                    <figure className="mt-6 rounded-md border border-[var(--border-primary)] bg-white p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={problem.imageUrl}
                        alt={`${problem.title} 설명 이미지`}
                        className="max-h-[360px] w-full object-contain"
                      />
                    </figure>
                  )}
                  <div className="mt-8 space-y-4">
                    {problem.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)]/60 overflow-hidden"
                      >
                        <div className="px-3 py-2 text-xs text-[var(--text-secondary)] border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                          예제 {i + 1}
                        </div>
                        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-primary)]">
                          <div>
                            <div className="px-3 py-1 text-[11px] text-[var(--text-muted)] uppercase tracking-wide">
                              입력
                            </div>
                            <pre className="px-3 py-2 text-[13px] font-mono text-[var(--text-primary)]">
                              {ex.input}
                            </pre>
                          </div>
                          <div>
                            <div className="px-3 py-1 text-[11px] text-[var(--text-muted)] uppercase tracking-wide">
                              출력
                            </div>
                            <pre className="px-3 py-2 text-[13px] font-mono text-[var(--text-primary)]">
                              {ex.output}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {tab === 'input' && (
                <div className="whitespace-pre-wrap text-[var(--text-primary)]/90">
                  {problem.inputDescription}
                </div>
              )}
              {tab === 'output' && (
                <div className="whitespace-pre-wrap text-[var(--text-primary)]/90">
                  {problem.outputDescription}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/2 box overflow-hidden flex flex-col min-h-[320px]">
            <div className="px-4 py-2.5 text-xs text-[var(--text-secondary)] border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)] flex flex-wrap items-center justify-between gap-2">
              <span>소스 코드</span>
              <span className="text-[var(--text-muted)]">
                서버 테스트케이스 기준 채점
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor problem={problem} isLoggedIn={isLoggedIn} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
