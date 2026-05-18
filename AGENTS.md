<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# sco — OJ Platform

## Stack
- **Next.js 16** (Turbopack dev), **React 19**, **Tailwind CSS v4** (PostCSS), **TypeScript**
- **Prisma 5** + SQLite (`file:./dev.db`)
- **iron-session** encrypted cookie auth, **bcryptjs** password hashing
- **Monaco Editor** for code editing, **lucide-react** for icons

## Commands
| Command | What |
|---------|------|
| `npm run dev` | Dev server (auto-runs `prisma generate` via `predev`) |
| `npm run build` | Production build (needs `prisma generate` first) |
| `npm run lint` | ESLint (flat config, `eslint.config.mjs`) |
| `npx prisma db push` | Push schema changes to SQLite |
| `npx prisma generate` | Generate Prisma client (auto-run on postinstall) |
| `npx prisma db seed` | Seed DB (uses `tsx prisma/seed.ts`) |

No typecheck command exists.

## Architecture
- **Path alias**: `@/*` → `./src/*`
- **Auth flow**: `iron-session` cookie (`banye_session`, 14-day TTL). `getCurrentUserOptional()` in server components. `SESSION_SECRET` env var (hardcoded dev fallback — set for production).
- **Theme**: `localStorage` (`banye-theme` key), `data-theme` attribute on `<html>`. Dark/light via `useTheme()` hook from `ThemeProvider`.
- **Code auto-save**: `localStorage` keyed as `banye-code-{problemId}-{lang}`. Language per problem saved as `banye-lang-{problemId}`.
- **Judge**: DEMO ONLY — checks for `__DEMO_AC__` string in code. Always WA unless marker present.

## Key Pages
| Route | Component |
|-------|-----------|
| `/` | Homepage (centered sco branding + category pills) |
| `/problems` | `ProblemsExplorerClient` (search, filter, category tree) |
| `/problems/[id]` | `ProblemDetailClient` + `CodeEditor` (Monaco) |
| `/subscribe` | Subscription plans (베이직 4,990원 / 프로 7,990원) |
| `/activity` | Submission history (login required) |
| `/ranking` | Leaderboard (top 80 by rating) |
| `/settings` | Profile edit, password change (login required) |
| `/users/[username]` | Public profile |
| `/contests` | Placeholder ("준비 중") |

## DB Models
`User`, `Problem`, `Category`, `SubCategory`, `Submission`, `SubscriptionPlan`, `UserSubscription`
- Problem types: `STANDARD`, `VERIFIED`, `COUNTEREXAMPLE` (badge shows "sco")
- Tags/examples stored as JSON strings
- `Problem.premium` boolean for subscription-gated problems

## Seed
- Demo password: `DemoSeed#2026` (all seed users)
- Admin user: `silverfox`
- `guest_demo` has no submissions
- Category numbering: 1000s (algorithm), 2000s (Python), 3000s (JS), 4000s (C++), 5000s (Java), 6000s (cloud), 7000s (network), 8000s (DB)

## Conventions
- Server actions in `src/app/actions/`, named `*Action`
- DB queries in `src/lib/*-db.ts`
- Client components use `'use client'` directive
- CSS variables for theming: `--bg-base`, `--text-primary`, `--accent-green`, etc. Defined in `globals.css`
- Utility classes: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.box`, `.input`, `.badge-*`, `.pill-link`, `.track-pill`, `.filter-chip`
- Prisma model names are PascalCase; table names are snake_case via `@@map`
- No security/CTF categories — project focuses on algorithms, languages, cloud, network, DB
