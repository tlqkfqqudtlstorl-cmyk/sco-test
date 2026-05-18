---
title: 디자인 원칙
owner: design
status: final
last_updated: 2026-05-12
source_of_truth: true
related:
  - ./02-color-palette.md
  - ./03-typography-and-spacing.md
---

# 디자인 원칙

## 목적

sco 플랫폼의 디자인 일관성을 유지하고, "도구처럼 보이는 제품"이라는 브랜드 정체성을 구현하기 위한 핵심 원칙을 정의합니다.

## 범위

모든 UI/UX 디자인 결정에 적용됩니다.

## 핵심 결정사항

1. 어두운 흑연 단색 기반 + 한 가지 강조색만 드물게 쓰는 미니멀 온라인 저지
2. 백준의 알고리즘 문제 풀이/채점 구조 + 드림핵의 다크하고 세련된 개발자/해커 플랫폼 분위기
3. 해커톤/보안/CTF 감성은 있지만 과한 네온이나 게임 UI는 금지

## 상세 설계

### 1. 톤 & 메시지

| 속성 | 값 |
|------|-----|
| 서비스명 | sco |
| 영문 슬러그 | banrye |
| 제품 개념 | Counterexample-first judge |
| 슬로건 | sco를 견디는 풀이 |
| 톤 | 단정함, 냉정함, 기술적, 과장 없음 |
| 로고 방향 | 한글 "ㄹ" 또는 "sco"의 모서리를 체크마크/판정 기호처럼 꺾은 단색 심볼 |

### 2. 브랜드 인상

- 문제를 많이 푸는 곳이 아니라, 허술한 풀이가 sco를 견디는지 검증하는 곳
- 단순 정답보다 견고성, 설명력, 검증력, 대회 신뢰도를 중시
- "도구처럼 보이는 제품"이어야 함

### 3. UI 원칙

#### 강조색 사용 규칙

- 한 화면에서 강조색은 하나만 사용
- 일반 서비스는 Azure `#58A6FF` 중심
- 라이브 대회, 이벤트, 실시간 성공 상태만 Lime `#C3FF4D` 사용 가능

#### 상태 표시 규칙

- AC/WA/TLE 등 판정 상태는 색만으로 구분하지 말고 텍스트 배지와 아이콘을 함께 사용
- 색상만으로 상태를 전달하지 말 것 (접근성)

#### 금지 사항

- 그라디언트 금지
- 과한 네온 금지
- 게임 UI 느낌 금지

### 4. 레이아웃 원칙

#### Spacing Scale (4px 기반)

```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
```

#### Border Radius

| 용도 | 값 |
|------|-----|
| 카드 | 10px |
| 인풋 | 8px |
| 버튼 | 8px |
| 뱃지 | 6px |

#### 테두리

- 1px solid `#262D35`
- 그림자는 거의 사용하지 않음

### 5. 반응형 브레이크포인트

| 이름 | 범위 | 특징 |
|------|------|------|
| Mobile | 360~767px | 문제/에디터 완전 스택 |
| Tablet | 768~1279px | 문제/에디터 토글 분할 |
| Desktop | 1280~1599px | 문제/에디터 7:5 분할 |
| Wide | 1600px 이상 | max-width 1480px 중심 |

### 6. 접근성

#### 명도 대비

- 본문 대비 4.5:1 이상
- 큰 글자 대비 3:1 이상

#### 키보드 접근성

- 모든 핵심 액션은 키보드로 가능
- 포커스는 2px outline + 2px offset

#### 모션

- `prefers-reduced-motion` 지원

#### 코드 에디터

- 접근성 모드 또는 plain textarea fallback 제공

## 컴포넌트 패턴

### Card

```css
.card {
  background: #151A20;
  border: 1px solid #262D35;
  border-radius: 10px;
}
```

### Button

| 타입 | 스타일 |
|------|-------|
| Primary | bg: #58A6FF, text: #0F1317 |
| Secondary | bg: #1F272F, text: #C9D1D9, border: #262D35 |
| Ghost | bg: transparent, text: #96A1AC |

### Badge

| 타입 | 배경 | 텍스트 | 테두리 |
|------|------|--------|--------|
| Success | rgba(63, 185, 80, 0.15) | #3FB950 | rgba(63, 185, 80, 0.3) |
| Warning | rgba(210, 153, 34, 0.15) | #D29922 | rgba(210, 153, 34, 0.3) |
| Error | rgba(248, 81, 73, 0.15) | #F85149 | rgba(248, 81, 73, 0.3) |

## TODO

- [ ] [design][1주] 아이콘 시스템 설계 (1.5px outline, 단색)
- [ ] [design][1주] 문제 풀이 화면 와이어프레임 작성
- [ ] [design][2주] 모바일 UI 상세 설계

## 오픈 이슈

1. 폰트: Pretendard vs SUIT 결정 필요
2. 다크 모드 전환 지원 여부 (기본 다크만 지원할지)

## 관련 문서

- [컬러 팔레트](./02-color-palette.md)
- [타이포그래피와 스페이싱](./03-typography-and-spacing.md)
- [컴포넌트와 상태](./04-components-and-states.md)
