# sco (Banrye) — Design System

**DESIGN_VARIANCE** 8 · **MOTION** 6 · **DENSITY** 4 (baseline)

저지·CTF 인접 제품: 정답만이 아니라 **sco·검증·경계 조건**을 전면에 둔 연습 환경. 시각 언어는 터미널·에디터의 차분한 대비와 정보 위계를 우선한다.

---

## Atmosphere

- **모드**: 다크 전용. 배경은 거의 검정이지만 **순수 `#000000` 금지** — 미세한 블루·그레이 기운의 카본 톤.
- **캐릭터**: 조용한 도구감. 홍보형 일러스트·네온·AI 퍼플 그라데이션 금지.
- **한 줄 톤**: “채점기 앞에서 말을 아끼는 UI” — 여백과 타이포가 설명을 대신한다.

---

## Palette (hex)

| Role | Hex | Note |
|------|-----|------|
| Base canvas | `#0b0d10` | 앱 루트 배경 |
| Surface | `#12151a` | 카드·패널 |
| Elevated | `#181c22` | 호버·테이블 헤더 |
| Border subtle | `#2a313c` | 기본 구분선 |
| Border strong | `#3a4450` | 강조 프레임 |
| Text primary | `#e8eaed` | 본문·제목 |
| Text secondary | `#9aa5b1` | 보조 설명 |
| Text muted | `#6b7785` | 메타·캡션 |
| Link / focus signal | `#89b4d4` | 링크·포커스 링 (채도 낮은 블루, 네온 아님) |
| Positive | `#5cb88a` | AC·성공 (남색 기운 없는 그린) |
| Warning | `#c9a227` | TLE·주의 |
| Danger | `#d4574a` | WA·오류 |
| **단일 탈채도 액센트 (warm chrome)** | `#c4b49a` | 탭 인디케이터·소량 하이라이트 전용 (최대 1종 액센트 규칙 준수) |

**금지**: 순수 블랙 배경, 보라·마젠타·시안 네온 그라데이션, 다중 비채도 네온 액센트 병치.

---

## Typography

- **Sans**: **Outfit** (`next/font/google`) — UI·제목·내비. **Inter 사용 금지.**
- **Mono**: **Geist Mono** (`next/font/google`) — 번호·레이팅·코드 스니펫.
- **스케일**: 본문 14–15px, 페이지 제목 22–28px, `tracking-tight`는 제목에만.
- **한글**: 시스템 폴백은 유지; 라틴 타이틀과의 굵기 대비는 과하지 않게.

---

## Layout

- **그리드 우선**: 목록·랭킹은 `table` + 명확한 열 위계. 레이아웃 목적의 flex 중첩 최소화.
- **히어로**: **`min-h-screen` / `h-screen` 금지** — 뷰포트는 `min-h-[calc(100dvh-3.5rem)]` 등으로 네비를 제외한 잔여 높이 기준.
- **폭**: `.container-app` max-width 1280px, 좌우 패딩 16→32px (md+).

---

## Motion (MOTION 6)

- **기본**: 150–200ms, `ease`, **opacity / border-color / background** 위주.
- **페이지 전환**: CSS `animate-in` 수준만; 의미 없는 연속 모션 금지.
- **`prefers-reduced-motion: reduce`**: 전환·애니메이션 최소화 준수.
- **Framer Motion**: 패키지에 포함되어 있으나 **앱 셸·목록에는 사용하지 않음** — 필요 시 클라이언트 국소 위젯에만 격리.

---

## Surfaces & focus

- 카드(`.box`): `background: var(--bg-secondary)`, `border: 1px solid var(--border-primary)`.
- **포커스 링**: `outline: 2px solid var(--accent-link)` · `outline-offset: 2px`.
- **링크**: 기본 밑줄은 호버에서만; 본문 링크는 `--accent-link`.

---

## Anti-patterns (금지)

- UI 문자열/버튼에 **이모지** (데이터 시드의 이모지는 DB에만 두고, 화면은 **slug→아이콘** 매핑).
- **카드 수프**: 의미 없는 다중 카드 그리드·그림자 스택.
- **영어 플레이스홀더 카피** (“Challenges”, “Leaderboard”) — 자리표시자 대신 **짧은 한국어** 유틸리티 문구.
- **죽은 네비 링크** — 라우트 없으면 노출하지 않음.
- **보라 배지·네온 시안**으로 트랙 구분 (브랜드 팔레트 위반).

---

## Icons

- **lucide-react** (기존 의존성)만 최소 사용 — 카테고리 트랙 마크 등.

---

## Implementation map

- 토큰: `src/app/globals.css` `:root` + `@theme inline`.
- 폰트: `src/app/layout.tsx` (`Outfit` + `Geist_Mono` CSS 변수).
- 카테고리 크롬: `src/components/category/CategoryTrackIcon.tsx`.
