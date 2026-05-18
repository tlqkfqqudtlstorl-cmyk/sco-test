import { hashPassword } from '../src/lib/auth/password';
import { recalculateUserStats } from '../src/lib/user-stats';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 문제 번호 체계 (전역 유일):
 * 1000–1999 알고리즘 · 2000–2999 Python · 3000–3999 JavaScript · 4000–4999 C++ · 5000–5999 Java
 * 6000–6999 클라우드 · 7000–7999 네트워크 · 8000–8999 DB · 9000–9499 보안 · 9500–9999 CTF
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
    slug: 'cloud',
    name: '클라우드',
    description: 'AWS·GCP·컨테이너·IaC',
    icon: '☁️',
    order: 6,
    subCategories: [
      { slug: 'aws', name: 'AWS', order: 1 },
      { slug: 'gcp', name: 'GCP', order: 2 },
      { slug: 'azure', name: 'Azure', order: 3 },
      { slug: 'docker', name: 'Docker', order: 4 },
      { slug: 'kubernetes', name: 'Kubernetes', order: 5 },
      { slug: 'terraform', name: 'Terraform', order: 6 },
      { slug: 'cicd', name: 'CI/CD', order: 7 },
    ],
  },
  {
    slug: 'network',
    name: '네트워크',
    description: 'TCP/IP·HTTP·DNS·성능',
    icon: '🌐',
    order: 7,
    subCategories: [
      { slug: 'tcp', name: 'TCP/IP', order: 1 },
      { slug: 'http', name: 'HTTP', order: 2 },
      { slug: 'dns', name: 'DNS', order: 3 },
      { slug: 'security', name: '네트워크 보안', order: 4 },
      { slug: 'tls-quic', name: 'TLS·QUIC', order: 5 },
      { slug: 'load-balancing', name: '로드밸런싱', order: 6 },
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
  {
    slug: 'security',
    name: '보안',
    description: '웹·인증·취약점',
    icon: '🔐',
    order: 9,
    subCategories: [
      { slug: 'web-hacking', name: '웹 해킹', order: 1 },
      { slug: 'cryptography', name: '암호학', order: 2 },
      { slug: 'forensics', name: '포렌식', order: 3 },
      { slug: 'owasp-top10', name: 'OWASP Top 10', order: 4 },
      { slug: 'jwt-auth', name: 'JWT·OAuth', order: 5 },
      { slug: 'xss-sqli', name: 'XSS·SQLi', order: 6 },
    ],
  },
  {
    slug: 'ctf',
    name: 'CTF',
    description: 'Dreamhack 스타일 트랙(웹·pwn·crypto 등)',
    icon: '🎯',
    order: 10,
    subCategories: [
      { slug: 'ctf-web', name: 'Web', order: 1 },
      { slug: 'ctf-pwn', name: 'Pwn', order: 2 },
      { slug: 'ctf-crypto', name: 'Crypto', order: 3 },
      { slug: 'ctf-reversing', name: 'Reversing', order: 4 },
      { slug: 'ctf-forensics', name: 'Forensics', order: 5 },
      { slug: 'ctf-misc', name: 'Misc', order: 6 },
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
  examples: string;
  type?: string;
  status?: string;
  tags?: string;
  hint?: string;
};

function ex(input: string, output: string) {
  return JSON.stringify([{ input, output }]);
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
    rows.push({
      number: start + i,
      title: `${titlePrefix} #${i + 1}`,
      category,
      subCategory,
      difficulty,
      timeLimit: difficulty === 'HARD' ? 2000 : 1000,
      memoryLimit: difficulty === 'HARD' ? 512 : 256,
      description: `${titlePrefix} 연습 문제입니다. 입력 형식에 맞춰 출력하세요.`,
      inputDesc: '첫 줄에 정수 n이 주어집니다.',
      outputDesc: '요구되는 값을 출력합니다.',
      examples: ex('3', String((i + 1) * 3)),
      tags: tagJson,
    });
  }
  return rows;
}

const sampleProblems: SampleProblemRow[] = [
  ...genRange(1001, 60, 'algorithm', 'data-structure', '자료구조 스택·큐', ['EASY', 'MEDIUM', 'HARD'], '["자료구조"]'),
  ...genRange(1061, 40, 'algorithm', 'graph', '그래프 탐색', ['EASY', 'MEDIUM', 'HARD'], '["BFS","DFS"]'),
  ...genRange(1101, 36, 'algorithm', 'dp', 'DP 카드', ['EASY', 'MEDIUM', 'HARD'], '["DP"]'),
  ...genRange(1137, 30, 'algorithm', 'greedy', '그리디', ['EASY', 'MEDIUM'], '["그리디"]'),
  ...genRange(1167, 28, 'algorithm', 'binary-search', '이분탐색', ['EASY', 'MEDIUM', 'HARD'], '["이분탐색"]'),
  ...genRange(1195, 24, 'algorithm', 'bitmask', '비트 연산', ['MEDIUM', 'HARD'], '["비트"]'),
  ...genRange(1219, 22, 'algorithm', 'geometry', '좌표·CCW', ['MEDIUM', 'HARD'], '["기하"]'),
  ...genRange(1241, 22, 'algorithm', 'two-pointer', '투 포인터', ['EASY', 'MEDIUM'], '["투포인터"]'),
  ...genRange(1263, 20, 'algorithm', 'shortest-path', '최단경로', ['MEDIUM', 'HARD'], '["다익스트라"]'),
  ...genRange(1283, 18, 'algorithm', 'mst', '신장트리', ['MEDIUM', 'HARD'], '["크루스칼"]'),
  ...genRange(1301, 16, 'algorithm', 'max-flow', '유량', ['HARD'], '["디닉"]'),
  ...genRange(1317, 20, 'algorithm', 'string', '문자열', ['EASY', 'MEDIUM'], '["KMP","해시"]'),
  ...genRange(1337, 18, 'algorithm', 'number-theory', '정수론', ['MEDIUM', 'HARD'], '["소수"]'),
  ...genRange(1355, 16, 'algorithm', 'game-theory', '게임', ['MEDIUM', 'HARD'], '["님"]'),
  ...genRange(1371, 14, 'algorithm', 'segtree', '세그먼트', ['HARD'], '["lazy"]'),

  ...genRange(2001, 24, 'python', 'python-basic', 'Python 기초', ['EASY', 'MEDIUM'], '["python"]'),
  ...genRange(2025, 16, 'python', 'python-string', 'Python 문자열', ['EASY', 'MEDIUM'], '["python"]'),
  ...genRange(2041, 14, 'python', 'python-list', '리스트 처리', ['EASY', 'MEDIUM'], '["list"]'),
  ...genRange(2055, 12, 'python', 'python-dict', '딕셔너리', ['EASY', 'MEDIUM'], '["dict"]'),
  ...genRange(2067, 10, 'python', 'python-class', '클래스', ['MEDIUM', 'HARD'], '["OOP"]'),

  ...genRange(3001, 18, 'javascript', 'js-basic', 'JS 기초', ['EASY', 'MEDIUM'], '["js"]'),
  ...genRange(3019, 14, 'javascript', 'js-async', 'Promise·async', ['MEDIUM', 'HARD'], '["async"]'),
  ...genRange(3033, 12, 'javascript', 'ts-intro', 'TS 타입', ['MEDIUM'], '["typescript"]'),
  ...genRange(3045, 10, 'javascript', 'nodejs-io', 'Node 스트림', ['MEDIUM'], '["node"]'),

  ...genRange(4001, 20, 'cpp', 'cpp-basic', 'C++ 입출력', ['EASY', 'MEDIUM'], '["cpp"]'),
  ...genRange(4021, 18, 'cpp', 'cpp-stl', 'STL 조합', ['EASY', 'MEDIUM', 'HARD'], '["STL"]'),
  ...genRange(4039, 12, 'cpp', 'cpp-template', '템플릿 메타', ['HARD'], '["TMP"]'),

  ...genRange(5001, 16, 'java', 'java-basic', 'Java 기초', ['EASY', 'MEDIUM'], '["java"]'),
  ...genRange(5017, 14, 'java', 'java-collection', '컬렉션', ['EASY', 'MEDIUM'], '["java"]'),
  ...genRange(5031, 12, 'java', 'java-stream', '스트림 API', ['MEDIUM'], '["stream"]'),

  ...genRange(6001, 14, 'cloud', 'aws', 'AWS 실습', ['MEDIUM', 'HARD'], '["aws","s3"]'),
  ...genRange(6015, 12, 'cloud', 'docker', '컨테이너', ['EASY', 'MEDIUM'], '["docker"]'),
  ...genRange(6027, 10, 'cloud', 'kubernetes', 'K8s', ['MEDIUM', 'HARD'], '["k8s"]'),
  ...genRange(6037, 8, 'cloud', 'terraform', 'IaC', ['MEDIUM'], '["tf"]'),

  ...genRange(7001, 12, 'network', 'http', 'HTTP 시나리오', ['EASY', 'MEDIUM'], '["http"]'),
  ...genRange(7013, 10, 'network', 'tcp', 'TCP', ['MEDIUM'], '["tcp"]'),
  ...genRange(7023, 8, 'network', 'tls-quic', 'TLS·QUIC', ['MEDIUM', 'HARD'], '["tls"]'),

  ...genRange(8001, 12, 'database', 'sql', 'SQL 쿼리', ['EASY', 'MEDIUM'], '["sql"]'),
  ...genRange(8013, 10, 'database', 'postgresql', 'Postgres', ['MEDIUM'], '["pg"]'),
  ...genRange(8023, 8, 'database', 'redis', 'Redis', ['EASY', 'MEDIUM'], '["redis"]'),

  ...genRange(9001, 10, 'security', 'web-hacking', '웹 취약점', ['MEDIUM', 'HARD'], '["web"]'),
  ...genRange(9011, 8, 'security', 'jwt-auth', '토큰', ['MEDIUM'], '["jwt"]'),
  ...genRange(9019, 8, 'security', 'cryptography', '암호', ['HARD'], '["crypto"]'),

  {
    number: 9501,
    title: 'XSS 필터 우회 시나리오',
    category: 'ctf',
    subCategory: 'ctf-web',
    difficulty: 'HARD',
    timeLimit: 2000,
    memoryLimit: 512,
    description: '주어진 HTML 필터 규칙을 분석하고 페이로드 형태로 출력하세요.',
    inputDesc: '필터 규칙 한 줄',
    outputDesc: '페이로드 한 줄',
    examples: ex('<script>', 'svg/onload=alert(1)'),
    tags: '["web","xss","ctf"]',
  },
  {
    number: 9502,
    title: '스택 오버플로우 트리거',
    category: 'ctf',
    subCategory: 'ctf-pwn',
    difficulty: 'HARD',
    timeLimit: 2000,
    memoryLimit: 512,
    description: '취약한 바이너리의 오프셋을 계산해 익스플로잇 문자열을 출력합니다.',
    inputDesc: '버퍼 크기 n',
    outputDesc: '패딩+Ret 주소(hex)',
    examples: ex('64', '41414141deadbeef'),
    tags: '["pwn","stack"]',
  },
  {
    number: 9503,
    title: 'RSA 작은 지수 공격',
    category: 'ctf',
    subCategory: 'ctf-crypto',
    difficulty: 'HARD',
    timeLimit: 2000,
    memoryLimit: 512,
    description: '주어진 N,e,c에서 평문 m을 복원합니다.',
    inputDesc: 'N e c',
    outputDesc: 'm',
    examples: ex('33 3 26', '5'),
    tags: '["rsa","crypto"]',
  },
  {
    number: 9504,
    title: '패킷 속 플래그',
    category: 'ctf',
    subCategory: 'ctf-forensics',
    difficulty: 'MEDIUM',
    timeLimit: 2000,
    memoryLimit: 512,
    description: 'PCAP에서 HTTP 응답 본문을 추출해 플래그를 찾습니다.',
    inputDesc: 'hex 인코딩된 바이트열',
    outputDesc: '플래그 문자열',
    examples: ex('666c6167', 'flag'),
    tags: '["pcap","forensics"]',
  },
  {
    number: 9505,
    title: '난독화된 문자열 복원',
    category: 'ctf',
    subCategory: 'ctf-reversing',
    difficulty: 'HARD',
    timeLimit: 2000,
    memoryLimit: 512,
    description: '아래 난독화 루틴과 동일한 결과를 출력하세요.',
    inputDesc: '시드 정수',
    outputDesc: '복호화 문자열',
    examples: ex('7', 'rev_ok'),
    tags: '["reversing"]',
  },
  {
    number: 9506,
    title: 'Misc: 인코딩 체인',
    category: 'ctf',
    subCategory: 'ctf-misc',
    difficulty: 'MEDIUM',
    timeLimit: 1500,
    memoryLimit: 256,
    description: 'Base64 → URL decode → ROT13 순서로 디코딩합니다.',
    inputDesc: '인코딩된 문자열',
    outputDesc: '최종 평문',
    examples: ex('ZmxhZw==', 'flag'),
    tags: '["misc","encoding"]',
  },
  ...genRange(9507, 10, 'ctf', 'ctf-web', 'Web 미니', ['EASY', 'MEDIUM'], '["web","ctf"]'),
  ...genRange(9517, 8, 'ctf', 'ctf-crypto', 'Crypto 미니', ['MEDIUM', 'HARD'], '["crypto"]'),
];

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
    username: 'pwn_duck',
    email: 'pwn@demo.local',
    bio: 'CTF Pwn/Web, 리눅스 익스.',
  },
  {
    username: 'crypto_cat',
    email: 'crypto@demo.local',
    bio: 'RSA·블록암호, 수학 좋아함.',
  },
  {
    username: 'cloud_runner',
    email: 'cloud@demo.local',
    bio: 'EKS·Terraform 실무.',
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
  await prisma.subscriptionPlan.deleteMany();
  await prisma.submission.deleteMany();
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
          examples: prob.examples,
          type: prob.type ?? 'STANDARD',
          status: prob.status ?? 'PUBLISHED',
          tags: prob.tags ?? '[]',
          hint: prob.hint,
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
          status: 'AC',
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
