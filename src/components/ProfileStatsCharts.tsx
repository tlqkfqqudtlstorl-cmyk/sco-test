'use client';

import { useMemo } from 'react';

type SubmissionStats = {
  difficultyBreakdown: { easy: number; medium: number; hard: number };
  statusBreakdown: Record<string, number>;
  languageBreakdown: Record<string, number>;
  dailyActivity: { date: string; count: number }[];
  totalSubmissions: number;
  acCount: number;
};

const LANG_LABELS: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  rust: 'Rust',
  go: 'Go',
  kotlin: 'Kotlin',
  swift: 'Swift',
};

const STATUS_COLORS: Record<string, string> = {
  AC: '#22c55e',
  WA: '#ef4444',
  TLE: '#eab308',
  MLE: '#f97316',
  CE: '#6b7280',
  RE: '#ec4899',
  PENDING: '#3b82f6',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#22c55e',
  medium: '#eab308',
  hard: '#ef4444',
};

function Bar({
  value,
  max,
  color,
  label,
  count,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
  count: number;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--text-secondary)] w-16 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono text-[var(--text-muted)] w-8 shrink-0 text-right">{count}</span>
    </div>
  );
}

function Donut({
  segments,
  size = 100,
  strokeWidth = 18,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;

  const paths = segments.reduce<{ paths: React.ReactNode[]; angle: number }>((acc, seg) => {
    if (seg.value === 0 || total === 0) return acc;
    const pct = seg.value / total;
    const angle = pct * 360;
    const startAngle = acc.angle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((startAngle + angle - 90) * Math.PI) / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      angle: acc.angle + angle,
      paths: [
        ...acc.paths,
      <path
        key={seg.label}
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
        fill="none"
        stroke={seg.color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      ],
    };
  }, { paths: [], angle: 0 }).paths;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-tertiary)" strokeWidth={strokeWidth} />
      {paths}
    </svg>
  );
}

export default function ProfileStatsCharts({ stats }: { stats: SubmissionStats }) {
  const maxDifficulty = useMemo(
    () => Math.max(stats.difficultyBreakdown.easy, stats.difficultyBreakdown.medium, stats.difficultyBreakdown.hard, 1),
    [stats.difficultyBreakdown],
  );

  const statusEntries = useMemo(() => {
    const entries = Object.entries(stats.statusBreakdown).filter(([, v]) => v > 0);
    entries.sort((a, b) => b[1] - a[1]);
    return entries;
  }, [stats.statusBreakdown]);

  const maxStatus = useMemo(() => Math.max(...statusEntries.map(([, v]) => v), 1), [statusEntries]);

  const langEntries = useMemo(() => {
    const entries = Object.entries(stats.languageBreakdown).filter(([, v]) => v > 0);
    entries.sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 6);
  }, [stats.languageBreakdown]);

  const maxLang = useMemo(() => Math.max(...langEntries.map(([, v]) => v), 1), [langEntries]);

  const maxDaily = useMemo(
    () => Math.max(...stats.dailyActivity.map((d) => d.count), 1),
    [stats.dailyActivity],
  );

  const acRate = stats.totalSubmissions > 0
    ? Math.round((stats.acCount / stats.totalSubmissions) * 100)
    : 0;

  const difficultySegments = [
    { value: stats.difficultyBreakdown.easy, color: DIFFICULTY_COLORS.easy, label: '쉬움' },
    { value: stats.difficultyBreakdown.medium, color: DIFFICULTY_COLORS.medium, label: '보통' },
    { value: stats.difficultyBreakdown.hard, color: DIFFICULTY_COLORS.hard, label: '어려움' },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 shadow-sm">
      <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-5 flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
        </svg>
        활동 통계
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3 text-center">
          <p className="text-lg font-bold font-mono text-[var(--accent-positive)]">{stats.acCount}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">맞은 제출</p>
        </div>
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3 text-center">
          <p className="text-lg font-bold font-mono text-[var(--accent-link)]">{acRate}%</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">정답률</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wide">난이도별 해결</p>
          <div className="flex items-center gap-4">
            <Donut segments={difficultySegments} size={88} strokeWidth={16} />
            <div className="flex-1 space-y-1.5">
              <Bar value={stats.difficultyBreakdown.easy} max={maxDifficulty} color={DIFFICULTY_COLORS.easy} label="쉬움" count={stats.difficultyBreakdown.easy} />
              <Bar value={stats.difficultyBreakdown.medium} max={maxDifficulty} color={DIFFICULTY_COLORS.medium} label="보통" count={stats.difficultyBreakdown.medium} />
              <Bar value={stats.difficultyBreakdown.hard} max={maxDifficulty} color={DIFFICULTY_COLORS.hard} label="어려움" count={stats.difficultyBreakdown.hard} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wide">제출 현황</p>
          <div className="space-y-1.5">
            {statusEntries.slice(0, 5).map(([status, count]) => (
              <Bar
                key={status}
                value={count}
                max={maxStatus}
                color={STATUS_COLORS[status] || '#6b7280'}
                label={status}
                count={count}
              />
            ))}
          </div>
        </div>

        {langEntries.length > 0 && (
          <div className="space-y-3">
            <p className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wide">사용 언어</p>
            <div className="space-y-1.5">
              {langEntries.map(([lang, count]) => (
                <Bar
                  key={lang}
                  value={count}
                  max={maxLang}
                  color="var(--accent-blue)"
                  label={LANG_LABELS[lang] || lang}
                  count={count}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wide">최근 활동</p>
          <div className="flex items-end gap-[3px] h-16">
            {stats.dailyActivity.map((d) => {
              const h = maxDaily > 0 ? (d.count / maxDaily) * 100 : 0;
              return (
                <div
                  key={d.date}
                  className="flex-1 rounded-sm transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${Math.max(h, d.count > 0 ? 8 : 0)}%`,
                    backgroundColor: d.count > 0 ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                    opacity: d.count > 0 ? 0.6 + (h / 100) * 0.4 : 0.4,
                  }}
                  title={`${d.date}: ${d.count}회`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-[9px] text-[var(--text-muted)]">
            <span>{stats.dailyActivity[0]?.date?.slice(5) || ''}</span>
            <span>{stats.dailyActivity[stats.dailyActivity.length - 1]?.date?.slice(5) || ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
