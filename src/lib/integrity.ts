export type IntegrityAssessment = {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flags: string[];
  signals: { type: string; value: number; weight: number; description: string }[];
};

export function assessSubmissionIntegrity(input: {
  code: string;
  language: string;
  status: string;
}): IntegrityAssessment {
  const signals: IntegrityAssessment['signals'] = [];
  const flags: string[] = [];
  const compact = input.code.replace(/\s+/g, '');

  if (input.status === 'AC' && compact.length < 20) {
    flags.push('VERY_SHORT_AC_CODE');
    signals.push({ type: 'SHORT_CODE', value: 35, weight: 1, description: 'AC 코드가 비정상적으로 짧습니다.' });
  }
  if (/eval\s*\(|Function\s*\(/.test(input.code)) {
    flags.push('DYNAMIC_EXECUTION');
    signals.push({ type: 'DYNAMIC_EXECUTION', value: 25, weight: 1, description: '동적 코드 실행 패턴이 포함되어 있습니다.' });
  }
  if (/__DEMO_AC__|hardcode|cheat/i.test(input.code)) {
    flags.push('SUSPICIOUS_MARKER');
    signals.push({ type: 'SUSPICIOUS_MARKER', value: 30, weight: 1, description: '의심스러운 마커 문자열이 포함되어 있습니다.' });
  }

  const score = Math.min(100, signals.reduce((sum, s) => sum + s.value * s.weight, 0));
  const level = score >= 80 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'LOW';
  return { score, level, flags, signals };
}
