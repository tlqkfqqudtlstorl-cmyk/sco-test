'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Submission = {
  id: string;
  createdAt: Date;
  status: string;
  language: string;
  code: string;
  problem: {
    number: number;
    title: string;
    difficulty: string;
  };
};

type Props = {
  submissions: Submission[];
};

export default function ActivityClient({ submissions }: Props) {
  const [viewing, setViewing] = useState<Submission | null>(null);

  return (
    <>
      <div className="box overflow-hidden">
        <div className="table-container">
          <table className="ranking-table">
            <thead>
              <tr>
                <th className="w-36">시각</th>
                <th>문제</th>
                <th className="w-24 hidden sm:table-cell">난이도</th>
                <th className="w-28">결과</th>
                <th className="w-24 hidden md:table-cell">언어</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--text-muted)]">
                    아직 제출이 없습니다.{' '}
                    <Link href="/problems" className="text-[var(--accent-link)]">
                      문제로 이동
                    </Link>
                  </td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr
                    key={s.id}
                    className="cursor-pointer"
                    onClick={() => setViewing(s)}
                  >
                    <td className="font-mono text-xs text-[var(--text-muted)] whitespace-nowrap">
                      {s.createdAt.toISOString().slice(0, 19).replace('T', ' ')}
                    </td>
                    <td>
                      <Link
                        href={`/problems/${s.problem.number}`}
                        className="font-medium text-[var(--text-primary)] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {s.problem.number}. {s.problem.title}
                      </Link>
                    </td>
                    <td className="hidden sm:table-cell text-xs text-[var(--text-secondary)]">
                      {s.problem.difficulty}
                    </td>
                    <td>
                      <span
                        className={
                          s.status === 'AC'
                            ? 'text-[var(--accent-green)] font-medium'
                            : 'text-[var(--accent-red)]'
                        }
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="hidden md:table-cell font-mono text-xs text-[var(--text-secondary)]">
                      {s.language}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-primary)]">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {viewing.problem.number}. {viewing.problem.title}
                <span className="ml-2 text-xs text-[var(--text-muted)] font-normal">
                  {viewing.language} · {viewing.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <div className="overflow-auto p-4 flex-1">
              <pre className="text-[13px] font-mono text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                {viewing.code}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
