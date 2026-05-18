---
title: 컬러 팔레트
owner: design
status: final
last_updated: 2026-05-12
source_of_truth: true
related:
  - ./01-design-principles.md
---

# 컬러 팔레트

## 목적

sco 플랫폼의 모든 UI 요소에 사용될 표준 색상을 정의합니다.

## 범위

모든 UI 컴포넌트, 텍스트, 배경, 상태 표시에 적용됩니다.

## 핵심 결정사항

1. 어두운 흑연 단색 기반
2. Azure `#58A6FF` 단일 강조색 (일반 서비스)
3. Lime `#C3FF4D` 라이브 대회/이벤트용 (특수 상황만)

## Base Colors

### Background

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--bg-950` | `#0F1317` | 전체 배경 |
| `--bg-900` | `#151A20` | 카드/패널 |
| `--bg-850` | `#1A2027` | 호버/보조 패널 |
| `--bg-800` | `#1F272F` | 버튼/인풋 배경 |

### Line/Border

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--line-700` | `#262D35` | 구분선/테두리 |
| `--line-600` | `#2D3640` | 호버 테두리 |
| `--line-500` | `#3A4550` | 활성 테두리 |

### Text

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--text-100` | `#EDF2F7` | 제목/주요 본문 |
| `--text-200` | `#D8E0E8` | 강조 본문 |
| `--text-300` | `#C9D1D9` | 보조 본문 |
| `--text-400` | `#A8B5C2` | 설명/링크 |
| `--text-500` | `#96A1AC` | 메타/시간 |
| `--text-600` | `#7A8590` | 비활성/플레이스홀더 |

### Code Editor

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--code-980` | `#0B0D10` | 코드 에디터 배경 |
| `--code-960` | `#111418` | 코드 에디터 헤더 |

## Accent Colors

### Azure (기본 강조색)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--accent-azure` | `#58A6FF` | 링크, 버튼, 포커스 |
| `--accent-azure-hover` | `#79B8FF` | 호버 상태 |

### Lime (라이브/이벤트용)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--accent-lime` | `#C3FF4D` | 라이브 대회, 실시간 성공 |
| `--accent-lime-hover` | `#D4FF7A` | 호버 상태 |

**사용 규칙:**
- 라이브 대회, 이벤트, 실시간 성공 상태에만 사용
- 일반 서비스에서는 Azure 사용

## Status Colors

**중요:** 색상만으로 상태를 전달하지 말고 텍스트 배지와 아이콘을 함께 사용

| 상태 | 색상 | 용도 |
|------|------|------|
| Success | `#3FB950` | AC, Verified |
| Warning | `#D29922` | TLE, 보류 |
| Error | `#F85149` | WA, RE, CE |
| Info | `#58A6FF` | 정보, 안내 |

### Badge 스타일

```css
/* Success Badge */
.badge-success {
  background: rgba(63, 185, 80, 0.15);
  color: #3FB950;
  border: 1px solid rgba(63, 185, 80, 0.3);
}

/* Warning Badge */
.badge-warning {
  background: rgba(210, 153, 34, 0.15);
  color: #D29922;
  border: 1px solid rgba(210, 153, 34, 0.3);
}

/* Error Badge */
.badge-error {
  background: rgba(248, 81, 73, 0.15);
  color: #F85149;
  border: 1px solid rgba(248, 81, 73, 0.3);
}
```

## Difficulty Colors

| 난이도 | 텍스트 | 배경 | 테두리 |
|--------|--------|------|--------|
| 쉬움 | `#4ADE80` | `rgba(63, 185, 80, 0.1)` | `rgba(63, 185, 80, 0.2)` |
| 보통 | `#FBBF24` | `rgba(210, 153, 34, 0.1)` | `rgba(210, 153, 34, 0.2)` |
| 어려움 | `#F87171` | `rgba(248, 81, 73, 0.1)` | `rgba(248, 81, 73, 0.2)` |

## CSS 변수 사용 예시

```css
:root {
  /* Background */
  --bg-950: #0F1317;
  --bg-900: #151A20;
  --bg-850: #1A2027;
  --bg-800: #1F272F;
  
  /* Line */
  --line-700: #262D35;
  --line-600: #2D3640;
  --line-500: #3A4550;
  
  /* Text */
  --text-100: #EDF2F7;
  --text-200: #D8E0E8;
  --text-300: #C9D1D9;
  --text-400: #A8B5C2;
  --text-500: #96A1AC;
  --text-600: #7A8590;
  
  /* Code */
  --code-980: #0B0D10;
  --code-960: #111418;
  
  /* Accent */
  --accent-azure: #58A6FF;
  --accent-azure-hover: #79B8FF;
  --accent-lime: #C3FF4D;
  --accent-lime-hover: #D4FF7A;
  
  /* Status */
  --status-success: #3FB950;
  --status-warning: #D29922;
  --status-error: #F85149;
  --status-info: #58A6FF;
}
```

## 접근성 검증

| 조합 | 대비율 | 기준 | 결과 |
|------|--------|------|------|
| text-100 on bg-950 | 13.4:1 | 4.5:1 | ✓ |
| text-300 on bg-900 | 9.8:1 | 4.5:1 | ✓ |
| text-500 on bg-900 | 6.2:1 | 4.5:1 | ✓ |
| accent-azure on bg-950 | 4.8:1 | 4.5:1 | ✓ |

## TODO

- [ ] [design][1주] 다크 모드 외 라이트 모드 필요성 검토
- [ ] [design][1주] 고대비 모드 지원 검토

## 오픈 이슈

1. 색맹 사용자를 위한 대체 표시 방식 상세화 필요

## 관련 문서

- [디자인 원칙](./01-design-principles.md)
- [타이포그래피와 스페이싱](./03-typography-and-spacing.md)
