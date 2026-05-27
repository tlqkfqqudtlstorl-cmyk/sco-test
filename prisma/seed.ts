import { hashPassword } from '../src/lib/auth/password';
import { recalculateUserStats } from '../src/lib/user-stats';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 문제 번호 체계 (전역 유일):
 * 1000–1999 알고리즘 · 2000–2999 Python · 3000–3999 JavaScript · 4000–4999 C++ · 5000–5999 Java
 * 8000–8999 데이터베이스
 */
const categories = [
  {
    slug: 'algorithm',
    name: '알고리즘',
    description: '자료구조, 그래프, DP, 수학, 비트·기하 등',
    icon: '📊',
    order: 1,
    subCategories: [
      { slug: 'data-structure', name: '자료구조', order: 1 },
      { slug: 'sorting', name: '정렬', order: 2 },
      { slug: 'search', name: '탐색', order: 3 },
      { slug: 'dp', name: '동적계획법', order: 4 },
      { slug: 'graph', name: '그래프', order: 5 },
      { slug: 'tree', name: '트리', order: 6 },
      { slug: 'greedy', name: '그리디', order: 7 },
      { slug: 'math', name: '수학', order: 8 },
      { slug: 'string', name: '문자열', order: 9 },
      { slug: 'bitmask', name: '비트마스크', order: 10 },
      { slug: 'geometry', name: '기하', order: 11 },
      { slug: 'two-pointer', name: '투 포인터', order: 12 },
      { slug: 'recursion', name: '재귀·분할정복', order: 13 },
      { slug: 'shortest-path', name: '최단경로', order: 14 },
      { slug: 'mst', name: 'MST', order: 15 },
      { slug: 'max-flow', name: '최대유량', order: 16 },
      { slug: 'number-theory', name: '정수론', order: 17 },
      { slug: 'game-theory', name: '게임이론', order: 18 },
      { slug: 'binary-search', name: '이분탐색', order: 19 },
      { slug: 'segtree', name: '세그먼트 트리', order: 20 },
    ],
  },
  {
    slug: 'python',
    name: 'Python',
    description: 'Python 기초·실무',
    icon: '🐍',
    order: 2,
    subCategories: [
      { slug: 'python-basic', name: '기초', order: 1 },
      { slug: 'python-string', name: '문자열', order: 2 },
      { slug: 'python-list', name: '리스트', order: 3 },
      { slug: 'python-dict', name: '딕셔너리', order: 4 },
      { slug: 'python-function', name: '함수', order: 5 },
      { slug: 'python-class', name: '클래스', order: 6 },
      { slug: 'python-file-io', name: '파일 I/O', order: 7 },
      { slug: 'python-stdlib', name: '표준 라이브러리', order: 8 },
    ],
  },
  {
    slug: 'javascript',
    name: 'JavaScript / TypeScript',
    description: 'JS·TS 기초와 런타임',
    icon: '🟨',
    order: 3,
    subCategories: [
      { slug: 'js-basic', name: '기초 문법', order: 1 },
      { slug: 'js-async', name: '비동기', order: 2 },
      { slug: 'ts-intro', name: 'TypeScript', order: 3 },
      { slug: 'nodejs-io', name: 'Node I/O', order: 4 },
    ],
  },
  {
    slug: 'cpp',
    name: 'C++',
    description: 'C++ 기초·STL·모던 문법',
    icon: '⚡',
    order: 4,
    subCategories: [
      { slug: 'cpp-basic', name: '기초', order: 1 },
      { slug: 'cpp-stl', name: 'STL', order: 2 },
      { slug: 'cpp-pointer', name: '포인터', order: 3 },
      { slug: 'cpp-class', name: '클래스', order: 4 },
      { slug: 'cpp-template', name: '템플릿', order: 5 },
      { slug: 'cpp-move', name: '이동·RAII', order: 6 },
      { slug: 'cpp-lambda', name: '람다·알고리즘', order: 7 },
    ],
  },
  {
    slug: 'java',
    name: 'Java',
    description: 'Java·JVM 생태',
    icon: '☕',
    order: 5,
    subCategories: [
      { slug: 'java-basic', name: '기초', order: 1 },
      { slug: 'java-oop', name: '객체지향', order: 2 },
      { slug: 'java-collection', name: '컬렉션', order: 3 },
      { slug: 'java-stream', name: '스트림', order: 4 },
      { slug: 'java-concurrent', name: '동시성', order: 5 },
      { slug: 'java-nio', name: 'NIO·파일', order: 6 },
    ],
  },
  {
    slug: 'database',
    name: '데이터베이스',
    description: 'SQL·인덱스·트랜잭션',
    icon: '🗄️',
    order: 8,
    subCategories: [
      { slug: 'sql', name: 'SQL', order: 1 },
      { slug: 'mysql', name: 'MySQL', order: 2 },
      { slug: 'postgresql', name: 'PostgreSQL', order: 3 },
      { slug: 'mongodb', name: 'MongoDB', order: 4 },
      { slug: 'redis', name: 'Redis', order: 5 },
      { slug: 'db-transactions', name: '트랜잭션', order: 6 },
      { slug: 'db-indexing', name: '인덱싱 설계', order: 7 },
    ],
  },
];

type SampleProblemRow = {
  number: number;
  title: string;
  category: string;
  subCategory: string;
  difficulty: string;
  timeLimit: number;
  memoryLimit: number;
  description: string;
  inputDesc: string;
  outputDesc: string;
  imageUrl?: string;
  examples: string;
  type?: string;
  status?: string;
  tags?: string;
  hint?: string;
};

type ProblemExampleSeed = {
  input: string;
  output: string;
  explanation?: string;
};

function readSeedJson<T>(name: string): T {
  const filePath = join(process.cwd(), 'prisma', 'seed-data', name);
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

function examplesToCases(json: string) {
  try {
    const rows = JSON.parse(json) as Array<{ input?: unknown; output?: unknown }>;
    return rows.map((row, order) => ({
      input: String(row.input ?? ''),
      output: String(row.output ?? ''),
      sample: true,
      order,
    }));
  } catch {
    return [];
  }
}

function problemTemplate(input: {
  category: string;
  titlePrefix: string;
  index: number;
}) {
  const n = input.index + 1;
  if (['python', 'javascript', 'cpp', 'java'].includes(input.category)) {
    return {
      description: [
        `${input.titlePrefix} 문법을 확인하는 문제입니다.`,
        '',
        '입력 문자열을 읽고, 언어의 기본 문자열 처리와 반복 기능을 사용해 지정된 결과를 만드세요.',
        '복잡한 알고리즘보다 표준 입력, 타입 변환, 반복 출력, 문자열 결합을 정확히 다루는 것이 핵심입니다.',
      ].join('\n'),
      inputDesc: '첫 줄에 공백 없는 문자열 s가 주어집니다.\n1 <= s.length <= 100',
      outputDesc: `s를 ${n}번 이어 붙인 문자열을 출력합니다.`,
      examples: [
        { input: 'ab', output: 'ab'.repeat(n), explanation: `ab를 ${n}번 반복합니다.` },
        { input: 'x', output: 'x'.repeat(n), explanation: '한 글자도 같은 규칙을 적용합니다.' },
      ],
    };
  }
  if (input.category === 'database') {
    return {
      description: [
        `${input.titlePrefix} 실행 계획을 읽기 위한 데이터베이스 계산 문제입니다.`,
        '',
        '조회된 행 수와 행당 비용이 주어질 때 전체 스캔 비용을 계산하세요.',
        'SQL 작성이 아니라 인덱스와 실행 계획을 이해할 때 필요한 기초 수치 감각을 연습합니다.',
      ].join('\n'),
      inputDesc: '첫 줄에 행 수 rows와 행당 비용 cost가 공백으로 주어집니다.\n0 <= rows <= 1000000, 0 <= cost <= 1000000',
      outputDesc: 'rows * cost 값을 출력합니다.',
      examples: [
        { input: '5 12', output: '60', explanation: '5개 행에 비용 12를 곱합니다.' },
        { input: '0 99', output: '0', explanation: '조회 행이 없으면 비용 합계는 0입니다.' },
      ],
    };
  }
  return {
    description: [
      `${input.titlePrefix} 트랙의 ${n}번째 알고리즘 문제입니다.`,
      '',
      '정수 n이 주어졌을 때 문제별 계수를 곱한 값을 구하세요.',
      `이 문제의 계수는 ${n}입니다.`,
      '정수 파싱, 표준 입력 처리, 출력 형식을 정확히 맞추세요.',
    ].join('\n'),
    inputDesc: '첫 줄에 정수 n이 주어집니다.\n-1,000,000 <= n <= 1,000,000',
    outputDesc: `n * ${n} 값을 한 줄에 출력합니다.`,
    examples: [
      { input: '3', output: String(n * 3), explanation: `3에 ${n}을 곱합니다.` },
      { input: '-2', output: String(n * -2), explanation: '음수도 같은 규칙을 적용합니다.' },
    ],
  };
}

function genRange(
  start: number,
  count: number,
  category: string,
  subCategory: string,
  titlePrefix: string,
  diffCycle: readonly string[],
  tagJson?: string,
): SampleProblemRow[] {
  const rows: SampleProblemRow[] = [];
  for (let i = 0; i < count; i++) {
    const difficulty = diffCycle[i % diffCycle.length]!;
    const content = problemTemplate({ category, titlePrefix, index: i });
    rows.push({
      number: start + i,
      title: `${titlePrefix} #${i + 1}`,
      category,
      subCategory,
      difficulty,
      timeLimit: difficulty === 'HARD' ? 2000 : 1000,
      memoryLimit: difficulty === 'HARD' ? 512 : 256,
      description: content.description,
      inputDesc: content.inputDesc,
      outputDesc: content.outputDesc,
      imageUrl: `/problem-images/generated/${start + i}.svg`,
      examples: JSON.stringify(content.examples),
      tags: tagJson,
    });
  }
  return rows;
}

type ProblemBatchFile = {
  ranges: Array<{
    start: number;
    count: number;
    category: string;
    subCategory: string;
    titlePrefix: string;
    difficulties: string[];
    tags?: string[];
  }>;
  singles: Array<{
    number: number;
    title: string;
    category: string;
    subCategory: string;
    difficulty: string;
    timeLimit: number;
    memoryLimit: number;
    description: string;
    inputDesc: string;
    outputDesc: string;
    type?: string;
    status?: string;
    hint?: string;
    imageUrl?: string;
    examples: ProblemExampleSeed[];
    tags?: string[];
  }>;
};

function buildProblemRows(data: ProblemBatchFile): SampleProblemRow[] {
  const rows: SampleProblemRow[] = [];
  for (const item of data.ranges) {
    rows.push(
      ...genRange(
        item.start,
        item.count,
        item.category,
        item.subCategory,
        item.titlePrefix,
        item.difficulties,
        JSON.stringify(item.tags ?? []),
      ),
    );
  }
  for (const item of data.singles) {
    rows.push({
      ...item,
      examples: JSON.stringify(item.examples),
      tags: JSON.stringify(item.tags ?? []),
    });
  }
  return rows;
}

const sampleProblems = buildProblemRows(
  readSeedJson<ProblemBatchFile>('problem-batches.json'),
);

/** 시드 사용자 공통 비밀번호 (개발 전용): DemoSeed#2026 */
const seedUsers: Array<{
  username: string;
  email: string;
  bio: string | null;
}> = [
  {
    username: 'guest_demo',
    email: 'guest@demo.local',
    bio: '레거시 데모 계정(선택). 로그인 사용자 제출과 분리되었습니다.',
  },
  {
    username: 'silverfox',
    email: 'silverfox@demo.local',
    bio: '그래프·트리 위주, 주말에만 풀이.',
  },
  {
    username: 'sql_sage',
    email: 'sql@demo.local',
    bio: '쿼리 플랜·인덱스 튜닝.',
  },
  {
    username: 'js_neon',
    email: 'js@demo.local',
    bio: 'TS·Node, 타입 안전 지향.',
  },
  {
    username: 'algo_mint',
    email: 'algo@demo.local',
    bio: 'DP·그리디, 대회 준비 중.',
  },
  {
    username: 'net_pulse',
    email: 'net@demo.local',
    bio: 'HTTP/3·QUIC 관심.',
  },
  {
    username: 'reverser_nyx',
    email: 'rev@demo.local',
    bio: '리버싱·윈도우 내부.',
  },
  {
    username: 'forensics_lime',
    email: 'for@demo.local',
    bio: '디스크·메모리 포렌식.',
  },
  {
    username: 'bronze_turtle',
    email: 'turtle@demo.local',
    bio: '입문자, Python 위주.',
  },
];

async function main() {
  console.log('Seeding...');

  await prisma.userSubscription.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.reviewDecision.deleteMany();
  await prisma.integritySignal.deleteMany();
  await prisma.reviewCase.deleteMany();
  await prisma.understandingAnswer.deleteMany();
  await prisma.understandingQuestion.deleteMany();
  await prisma.codePatchMission.deleteMany();
  await prisma.submissionExplanation.deleteMany();
  await prisma.contestParticipation.deleteMany();
  await prisma.contestProblem.deleteMany();
  await prisma.contest.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        order: cat.order,
      },
    });

    for (const sub of cat.subCategories) {
      await prisma.subCategory.create({
        data: {
          categoryId: category.id,
          slug: sub.slug,
          name: sub.name,
          order: sub.order,
        },
      });
    }
  }

  for (const prob of sampleProblems) {
    const category = await prisma.category.findUnique({
      where: { slug: prob.category },
    });
    const subCategory = await prisma.subCategory.findUnique({
      where: { slug: prob.subCategory },
    });

    if (category && subCategory) {
      await prisma.problem.create({
        data: {
          number: prob.number,
          title: prob.title,
          categoryId: category.id,
          subCategoryId: subCategory.id,
          difficulty: prob.difficulty,
          timeLimit: prob.timeLimit,
          memoryLimit: prob.memoryLimit,
          description: prob.description,
          inputDesc: prob.inputDesc,
          outputDesc: prob.outputDesc,
          imageUrl: prob.imageUrl ?? `/problem-images/generated/${prob.number}.svg`,
          examples: prob.examples,
          type: prob.type ?? 'STANDARD',
          status: prob.status ?? 'PUBLISHED',
          tags: prob.tags ?? '[]',
          hint: prob.hint,
          testCases: {
            create: examplesToCases(prob.examples),
          },
          ...(prob.type === 'VERIFIED'
            ? {
                understandingQuestions: {
                  create: [{
                    question: '핵심 시간복잡도를 입력하세요.',
                    type: 'SHORT_ANSWER',
                    correctAnswer: 'O(n)',
                  }],
                },
              }
            : {}),
        },
      });
    } else {
      console.warn('Skip problem (missing cat/sub):', prob.number, prob.category, prob.subCategory);
    }
  }

  const passwordHash = await hashPassword('DemoSeed#2026');

  for (const u of seedUsers) {
    await prisma.user.create({
      data: {
        username: u.username,
        email: u.email,
        password: passwordHash,
        bio: u.bio,
      },
    });
  }

  await prisma.user.update({
    where: { username: 'silverfox' },
    data: { role: 'ADMIN' },
  });

  const users = await prisma.user.findMany({ orderBy: { username: 'asc' } });
  const problems = await prisma.problem.findMany({
    orderBy: { number: 'asc' },
    select: { id: true, number: true },
  });

  const pairs = new Set<string>();
  let i = 0;
  for (const u of users) {
    if (u.username === 'guest_demo') continue;
    const solves = 8 + (i % 7);
    let added = 0;
    let p = 0;
    while (added < solves && problems.length > 0) {
      const prob = problems[p % problems.length]!;
      p++;
      const key = `${u.id}:${prob.id}`;
      if (pairs.has(key)) continue;
      pairs.add(key);
      await prisma.submission.create({
        data: {
          userId: u.id,
          problemId: prob.id,
          language: 'python',
          code: '# AC seed',
          codeLength: '# AC seed'.length,
          status: 'AC',
          judgedAt: new Date(),
          execTime: 20 + (added % 50),
          memory: 4096,
        },
      });
      added++;
    }
    i++;
  }

  await prisma.subscriptionPlan.createMany({
    data: [
      {
        name: '베이직',
        price: 4990,
        description: '프리미엄 문제 일부 이용',
        features: JSON.stringify(['프리미엄 문제 30% 이용', '일반 문제 광고 제거', '랭킹 아이콘']),
      },
      {
        name: '프로',
        price: 7990,
        description: '모든 프리미엄 문제 + 추가 기능',
        features: JSON.stringify(['모든 프리미엄 문제 이용', '일반 문제 광고 제거', '랭킹 아이콘', '정답 코드 열람', '우선 채점']),
      },
    ],
  });

  const admin = await prisma.user.findUnique({ where: { username: 'silverfox' } });
  const contestProblems = await prisma.problem.findMany({
    where: { number: { in: [1001, 1002, 1061, 1101, 2001] } },
    orderBy: { number: 'asc' },
    select: { id: true },
  });
  const now = new Date();
  const contest = await prisma.contest.create({
    data: {
      slug: 'sco-weekly-1',
      title: 'sco Weekly #1',
      description: '입문자를 위한 5문제 연습 대회입니다.',
      format: 'ICPC',
      status: 'REGISTERING',
      startTime: new Date(now.getTime() + 1000 * 60 * 60 * 24),
      endTime: new Date(now.getTime() + 1000 * 60 * 60 * 27),
      freezeTime: new Date(now.getTime() + 1000 * 60 * 60 * 26),
      isPublic: true,
      isRated: false,
      maxParticipants: 200,
      createdById: admin?.id,
      problems: {
        create: contestProblems.map((p, idx) => ({
          problemId: p.id,
          label: String.fromCharCode(65 + idx),
          points: 1,
          order: idx,
        })),
      },
    },
  });

  const initialParticipants = users.slice(0, 5);
  await prisma.contestParticipation.createMany({
    data: initialParticipants.map((u) => ({
      contestId: contest.id,
      userId: u.id,
    })),
  });

  const allUsers = await prisma.user.findMany({ select: { id: true } });
  for (const u of allUsers) {
    await recalculateUserStats(u.id);
  }

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
