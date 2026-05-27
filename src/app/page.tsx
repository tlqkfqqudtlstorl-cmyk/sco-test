'use client';

import React from 'react';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-[var(--bg-primary)]">
      <section className="grid flex-1 place-items-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="mb-6 text-7xl font-bold tracking-tight text-[var(--text-primary)] md:text-8xl">
            sco
          </h1>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">
            System · Coding · Operations
          </p>
          <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
            코드를 넘어, 풀이를 검증하는 습관
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--border-primary)]">
        <div className="container-app py-8">
          <div className="flex flex-wrap justify-center gap-3">
            {['Python', 'C++', 'Java', 'JavaScript', '알고리즘', '자료구조', 'SQL', 'DB'].map((name) => (
              <span key={name} className="track-pill text-sm px-4 py-2">{name}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
