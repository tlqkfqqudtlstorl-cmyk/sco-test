/** 각 티어에 딱 맞는 구분되는 SVG 아이콘 */

const ICONS: Record<string, (className?: string) => React.ReactNode> = {
  자갈: (cn) => (
    <svg viewBox="0 0 24 24" fill="none" className={cn}>
      <defs>
        <radialGradient id="g1" cx="35%" cy="30%"><stop offset="0%" stopColor="#d4d4d8" /><stop offset="100%" stopColor="#78716c" /></radialGradient>
        <radialGradient id="g2" cx="35%" cy="30%"><stop offset="0%" stopColor="#e5e5e5" /><stop offset="100%" stopColor="#6b7280" /></radialGradient>
        <radialGradient id="g3" cx="35%" cy="30%"><stop offset="0%" stopColor="#d6d3d1" /><stop offset="100%" stopColor="#57534e" /></radialGradient>
      </defs>
      <circle cx="8" cy="16" r="5" fill="url(#g1)" stroke="#57534e" strokeWidth="0.7" />
      <ellipse cx="8.5" cy="14.5" rx="1.8" ry="1" fill="#e5e7eb" opacity="0.3" />
      <circle cx="17.5" cy="17" r="4" fill="url(#g2)" stroke="#4b5563" strokeWidth="0.7" />
      <ellipse cx="18" cy="15.5" rx="1.5" ry="0.8" fill="#e5e7eb" opacity="0.25" />
      <circle cx="11.5" cy="9.5" r="3.8" fill="url(#g3)" stroke="#44403c" strokeWidth="0.7" />
      <ellipse cx="12" cy="8.2" rx="1.3" ry="0.7" fill="#e5e7eb" opacity="0.25" />
    </svg>
  ),
  돌멩이: (cn) => (
    <svg viewBox="0 0 24 24" fill="none" className={cn}>
      <defs>
        <radialGradient id="p1" cx="30%" cy="25%"><stop offset="0%" stopColor="#e5e7eb" /><stop offset="100%" stopColor="#78716c" /></radialGradient>
      </defs>
      <ellipse cx="12" cy="13" rx="7.5" ry="6" fill="url(#p1)" stroke="#57534e" strokeWidth="0.7" />
      <ellipse cx="10" cy="10.5" rx="3.5" ry="2" fill="#e5e7eb" opacity="0.3" />
      <ellipse cx="15.5" cy="15.5" rx="1.8" ry="1" fill="#57534e" opacity="0.12" />
      <path d="M8 14q2-1 4 0" stroke="#57534e" strokeWidth="0.5" strokeLinecap="round" opacity="0.25" />
    </svg>
  ),
  암석: (cn) => (
    <svg viewBox="0 0 24 24" fill="none" className={cn}>
      <defs>
        <linearGradient id="r1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a8a29e" /><stop offset="100%" stopColor="#44403c" /></linearGradient>
      </defs>
      <path d="M4 19L6 4l7 2 5 4 2 9-5 2-9-2z" fill="url(#r1)" stroke="#292524" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M10 7l-3 6 4 4" stroke="#78716c" strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
      <path d="M15 7l2 5-1 4" stroke="#78716c" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
      <path d="M7 14l4 1 3-2" stroke="#a8a29e" strokeWidth="0.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  ),
  광석: (cn) => (
    <svg viewBox="0 0 24 24" fill="none" className={cn}>
      <defs>
        <radialGradient id="o1" cx="35%" cy="30%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#b45309" /></radialGradient>
      </defs>
      <path d="M6 18L3 8l6-4 7 1 4 5-2 9-8 1z" fill="url(#o1)" stroke="#92400e" strokeWidth="0.7" strokeLinejoin="round" />
      <path d="M12 6l-4 4 2 6" stroke="#fef3c7" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
      <path d="M8 10l3 1 2-1" stroke="#fde68a" strokeWidth="0.5" strokeLinecap="round" opacity="0.3" />
      <circle cx="15" cy="11" r="1.2" fill="#fef3c7" opacity="0.35" />
      <circle cx="9.5" cy="14" r="1" fill="#fef3c7" opacity="0.3" />
    </svg>
  ),
  수정: (cn) => (
    <svg viewBox="0 0 24 24" fill="none" className={cn}>
      <defs>
        <linearGradient id="cr1" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#f1f5f9" /><stop offset="100%" stopColor="#cbd5e1" /></linearGradient>
      </defs>
      <path d="M10 3L4 11l3 10h10l3-10-6-8z" fill="url(#cr1)" stroke="#94a3b8" strokeWidth="0.7" strokeLinejoin="round" />
      <path d="M10 3v18M5 11l7 2 7-2" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.4" />
      <path d="M9 16l3 2 3-2" stroke="#94a3b8" strokeWidth="0.5" strokeLinecap="round" opacity="0.3" />
      <path d="M8.5 8l3-1 3 1" stroke="#e2e8f0" strokeWidth="0.4" strokeLinecap="round" opacity="0.3" />
      <path d="M7 13l5 1 5-1" stroke="#e2e8f0" strokeWidth="0.3" strokeLinecap="round" opacity="0.25" />
    </svg>
  ),
  자수정: (cn) => (
    <svg viewBox="0 0 24 24" fill="none" className={cn}>
      <defs>
        <linearGradient id="am1" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#f3e8ff" /><stop offset="100%" stopColor="#9333ea" /></linearGradient>
      </defs>
      <path d="M8 3l-4 9 3 10h6l3-10-6-9z" fill="url(#am1)" stroke="#7e22ce" strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M16 4l-3 8 2 9" fill="url(#am1)" stroke="#7e22ce" strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M12 6l-2 6 1 7" fill="url(#am1)" stroke="#7e22ce" strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M4 13l6 1 4-1" stroke="#d8b4fe" strokeWidth="0.4" opacity="0.35" />
    </svg>
  ),
  사파이어: (cn) => (
    <svg viewBox="0 0 24 24" fill="none" className={cn}>
      <defs>
        <radialGradient id="s1" cx="35%" cy="30%"><stop offset="0%" stopColor="#93c5fd" /><stop offset="100%" stopColor="#1d4ed8" /></radialGradient>
      </defs>
      <ellipse cx="12" cy="13" rx="8" ry="7" fill="url(#s1)" stroke="#1e40af" strokeWidth="0.7" />
      <path d="M8 13l4-4 4 4-3 6H11l-3-6z" fill="#bfdbfe" opacity="0.3" />
      <path d="M12 6v14M5.5 12L12 14l6.5-2" stroke="#bfdbfe" strokeWidth="0.5" opacity="0.35" />
    </svg>
  ),
  다이아몬드: (cn) => (
    <svg viewBox="0 0 24 24" fill="none" className={cn}>
      <defs>
        <linearGradient id="di1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ffffff" /><stop offset="40%" stopColor="#e2e8f0" /><stop offset="100%" stopColor="#94a3b8" /></linearGradient>
        <linearGradient id="di2" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#cbd5e1" /></linearGradient>
      </defs>
      <path d="M12 2L2 9l10 13L22 9 12 2z" fill="url(#di1)" stroke="#64748b" strokeWidth="0.7" strokeLinejoin="round" />
      <path d="M4.5 9L12 12l7.5-3" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.5" />
      <path d="M8 13l4 7 4-7" stroke="#94a3b8" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
      <path d="M9 10l3-5 3 5" stroke="#e2e8f0" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
      <path d="M6 11l6 3 6-3" stroke="#cbd5e1" strokeWidth="0.4" strokeLinecap="round" opacity="0.35" />
      <path d="M12 2v20" stroke="#e2e8f0" strokeWidth="0.4" opacity="0.3" />
    </svg>
  ),
};

export function TierIcon({
  name,
  className = 'h-4 w-4 shrink-0',
}: {
  name: string;
  className?: string;
}) {
  const render = ICONS[name];
  if (!render) return null;
  return <>{render(className)}</>;
}
