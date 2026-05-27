'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import { submitCode } from '@/app/actions/submission';
import { useTheme } from '@/lib/ThemeProvider';
import { ProblemClient } from '@/types';

interface Props {
  problem: ProblemClient;
  isLoggedIn?: boolean;
}

const templates: Record<string, string> = {
  python: `import sys

def solve():
    pass

if __name__ == "__main__":
    solve()
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    return 0;
}
`,
  java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        
    }
}
`,
  c: `#include <stdio.h>

int main() {
    
    return 0;
}
`,
  nodejs: `const fs = require('fs');
const input = fs.readFileSync('/dev/stdin').toString().trim();

function solve() {
    
}

solve();
`,
};

const langs = [
  { id: 'python', name: 'Python 3' },
  { id: 'cpp', name: 'C++17' },
  { id: 'java', name: 'Java 17' },
  { id: 'c', name: 'C11' },
  { id: 'nodejs', name: 'Node.js' },
];

function storageKey(problemId: string, lang: string) {
  return `banye-code-${problemId}-${lang}`;
}

function langKey(problemId: string) {
  return `banye-lang-${problemId}`;
}

export default function CodeEditor({
  problem,
  isLoggedIn = false,
}: Props) {
  const { theme } = useTheme();
  const [saved, setSaved] = useState(false);

  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(langKey(problem.id));
      if (saved && langs.some((l) => l.id === saved)) return saved;
    }
    return 'python';
  });

  const [code, setCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey(problem.id, lang));
      if (saved) return saved;
    }
    return templates[lang];
  });

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    time?: number;
    memory?: number;
    message?: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey(problem.id, lang), code);
    const showTimer = setTimeout(() => setSaved(true), 0);
    const hideTimer = setTimeout(() => setSaved(false), 2000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [code, lang, problem.id]);

  const switchLang = (newLang: string) => {
    const currentCode = localStorage.getItem(storageKey(problem.id, newLang));
    setLang(newLang);
    localStorage.setItem(langKey(problem.id), newLang);
    if (currentCode) {
      setCode(currentCode);
    } else {
      setCode(templates[newLang]);
    }
  };

  const handleRun = () => {
    handleSubmit();
  };

  const handleSubmit = useCallback(async () => {
    if (!isLoggedIn) {
      setResult({
        status: '로그인 필요',
        message: '제출은 로그인 후 이용할 수 있습니다.',
      });
      return;
    }
    setRunning(true);
    setResult(null);
    const res = await submitCode({
      problemId: problem.id,
      language: lang,
      code,
    });
    setRunning(false);
    if (!res.ok) {
      setResult({ status: res.message ?? '제출 실패' });
      return;
    }
    setResult({
      status: res.status ?? '완료',
      time: res.execTime,
      memory: res.memory,
      message: res.message,
    });
  }, [isLoggedIn, problem.id, lang, code]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]" onKeyDown={handleKeyDown}>
      {!isLoggedIn ? (
        <div className="px-3 py-2 text-xs bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)] text-[var(--text-secondary)]">
          제출하려면{' '}
          <Link
            href={`/login?next=/problems/${problem.number}`}
            className="text-[var(--accent-link)] underline-offset-2 hover:underline"
          >
            로그인
          </Link>
          이 필요합니다.
        </div>
      ) : null}
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-2">
          <select
            value={lang}
            onChange={(e) => switchLang(e.target.value)}
            className="px-2 py-1 text-sm bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded"
          >
            {langs.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          {saved && (
            <span className="text-[11px] text-[var(--text-muted)]">저장됨</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="btn btn-secondary text-sm py-1"
          >
            실행
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={running || !isLoggedIn}
            className="btn btn-primary text-sm py-1 disabled:opacity-50"
          >
            제출 (Ctrl+Enter)
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={lang === 'nodejs' ? 'javascript' : lang}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          value={code}
          onChange={(v) => setCode(v || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            tabSize: 4,
            wordWrap: 'on',
            scrollbar: { vertical: 'auto', horizontal: 'auto' },
          }}
        />
      </div>

      {result && (
        <div className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <div className="px-3 py-2 text-xs text-[var(--text-secondary)] border-b border-[var(--border-primary)]">
            결과
          </div>
          <div
            className={`px-3 py-2 text-sm ${
              result.status === '맞았습니다'
                ? 'text-[var(--accent-green)]'
                : result.status === '틀렸습니다'
                  ? 'text-[var(--accent-red)]'
                  : result.status.includes('실행')
                    ? 'text-[var(--accent-orange)]'
                    : 'text-[var(--text-secondary)]'
            }`}
          >
            {result.status}
            {result.time != null && result.memory != null && (
              <span className="text-[var(--text-muted)] ml-4 font-mono text-xs">
                {result.time}ms · {result.memory}KB
              </span>
            )}
            {result.message && (
              <div className="mt-2 text-xs text-[var(--text-muted)] leading-snug">
                {result.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
