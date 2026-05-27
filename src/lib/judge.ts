import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

import type { SubmissionStatus } from '@/types';

type Testcase = {
  id: string;
  input: string;
  output: string;
};

type Runner = {
  file: string;
  run: string[];
  compile?: string[];
};

export type JudgeInput = {
  language: string;
  code: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  testcases: Testcase[];
};

export type JudgeResult = {
  status: SubmissionStatus;
  execTime?: number;
  memory?: number;
  message?: string;
  results: {
    testcaseId: string;
    status: SubmissionStatus;
    time: number;
    memory: number;
  }[];
};

const OUTPUT_LIMIT = 1_000_000;

const COMMANDS: Record<string, Runner> = {
  nodejs: { file: 'main.js', run: [process.execPath, 'main.js'] },
  javascript: { file: 'main.js', run: [process.execPath, 'main.js'] },
  python: { file: 'main.py', run: ['python3', 'main.py'] },
  c: { file: 'main.c', compile: ['gcc', 'main.c', '-O2', '-std=c11', '-o', 'main'], run: ['./main'] },
  cpp: { file: 'main.cpp', compile: ['g++', 'main.cpp', '-O2', '-std=c++17', '-o', 'main'], run: ['./main'] },
  java: { file: 'Main.java', compile: ['javac', 'Main.java'], run: ['java', 'Main'] },
};

function normalizeOutput(value: string) {
  return value.replace(/\r\n/g, '\n').trimEnd();
}

async function runCase(
  command: string[],
  cwd: string,
  tc: Testcase,
  timeLimitMs: number,
): Promise<{ status: SubmissionStatus; stdout: string; stderr: string; time: number }> {
  return new Promise((resolve) => {
    const started = performance.now();
    const child = spawn(command[0]!, command.slice(1), {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let outputExceeded = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, Math.max(100, timeLimitMs));

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
      if (stdout.length > OUTPUT_LIMIT) {
        outputExceeded = true;
        child.kill('SIGKILL');
      }
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        status: 'JE',
        stdout,
        stderr: err.message,
        time: Math.round(performance.now() - started),
      });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      const time = Math.round(performance.now() - started);
      if (timedOut) {
        resolve({ status: 'TLE', stdout, stderr, time });
        return;
      }
      if (outputExceeded) {
        resolve({ status: 'OLE', stdout, stderr, time });
        return;
      }
      if (code !== 0) {
        resolve({ status: 'RE', stdout, stderr, time });
        return;
      }
      resolve({
        status: normalizeOutput(stdout) === normalizeOutput(tc.output) ? 'AC' : 'WA',
        stdout,
        stderr,
        time,
      });
    });
    child.stdin.end(tc.input);
  });
}

async function runCommand(
  command: string[],
  cwd: string,
  timeoutMs: number,
): Promise<{ ok: boolean; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(command[0]!, command.slice(1), {
      cwd,
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let stderr = '';
    const timer = setTimeout(() => child.kill('SIGKILL'), timeoutMs);
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ ok: false, stderr: err.message });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0, stderr });
    });
  });
}

export async function judgeSubmission(input: JudgeInput): Promise<JudgeResult> {
  const runner = COMMANDS[input.language];
  if (!runner) {
    return {
      status: 'CE',
      message: '현재 서버 채점은 Python과 Node.js만 지원합니다.',
      results: [],
    };
  }
  if (input.testcases.length === 0) {
    return { status: 'JE', message: '등록된 테스트케이스가 없습니다.', results: [] };
  }

  const dir = await mkdtemp(`${tmpdir()}/sco-judge-`);
  try {
    await writeFile(`${dir}/${runner.file}`, input.code, 'utf8');
    if (runner.compile) {
      const compiled = await runCommand(runner.compile, dir, 10_000);
      if (!compiled.ok) {
        return {
          status: 'CE',
          message: compiled.stderr.slice(0, 800) || '컴파일에 실패했습니다.',
          results: [],
        };
      }
    }
    const results: JudgeResult['results'] = [];
    let maxTime = 0;
    for (const tc of input.testcases) {
      const r = await runCase(runner.run, dir, tc, input.timeLimitMs);
      maxTime = Math.max(maxTime, r.time);
      results.push({
        testcaseId: tc.id,
        status: r.status,
        time: r.time,
        memory: input.memoryLimitMb,
      });
      if (r.status !== 'AC') {
        return {
          status: r.status,
          execTime: maxTime,
          memory: input.memoryLimitMb,
          message: r.stderr ? r.stderr.slice(0, 500) : undefined,
          results,
        };
      }
    }
    return { status: 'AC', execTime: maxTime, memory: input.memoryLimitMb, results };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export function statusLabel(status: SubmissionStatus) {
  return (
    {
      AC: '맞았습니다',
      WA: '틀렸습니다',
      TLE: '시간 초과',
      MLE: '메모리 초과',
      RE: '런타임 에러',
      CE: '컴파일 에러',
      JE: '채점 오류',
      PE: '출력 형식 오류',
      OLE: '출력 초과',
      PENDING: '대기 중',
      RUNNING: '채점 중',
    } satisfies Record<SubmissionStatus, string>
  )[status];
}
