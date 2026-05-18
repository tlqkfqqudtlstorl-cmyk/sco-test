'use client';

import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Braces,
  Cloud,
  Coffee,
  Cpu,
  Database,
  FileCode2,
  Flag,
  Network,
  Shield,
} from 'lucide-react';

const bySlug: Record<string, LucideIcon> = {
  algorithm: BarChart3,
  python: Braces,
  javascript: FileCode2,
  cpp: Cpu,
  java: Coffee,
  cloud: Cloud,
  network: Network,
  database: Database,
  security: Shield,
  ctf: Flag,
};

type Props = {
  slug: string;
  className?: string;
};

export default function CategoryTrackIcon({ slug, className }: Props) {
  const Icon = bySlug[slug] ?? FileCode2;
  return <Icon className={className} aria-hidden />;
}
