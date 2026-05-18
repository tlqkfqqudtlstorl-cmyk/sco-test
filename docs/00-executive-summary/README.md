---
title: sco 제품 요약
owner: product
status: final
last_updated: 2026-05-12
source_of_truth: true
related: []
---

# sco (Banrye) 제품 요약

## 목적

sco는 알고리즘 문제 풀이와 실력 검증을 위한 온라인 저지 플랫폼입니다. AI 시대에 맞게 "정답을 맞히는 사이트"가 아니라 "sco를 견디는 풀이를 검증하는 사이트"로 설계되었습니다.

## 핵심 목표

1. 알고리즘 문제를 풀고 코드를 제출하는 온라인 저지 플랫폼
2. 일반 AC와 Verified AC를 분리하는 실력 검증 플랫폼
3. 풀이자 / 검수자 / 어드민 3개 역할 중심의 운영 구조
4. AI 코드 복붙을 100% 막는 것이 아니라, 이해하지 못한 AI 복붙 사용자가 공식 랭킹과 대회 성과를 쉽게 얻지 못하게 하는 구조
5. 한국 시장에 맞는 입문자 온보딩, 상위권 경쟁, 학교/학원/기업 시험 확장 가능성

## 제품 한 줄 정의

**sco를 견디는 풀이 — Counterexample-first judge**

## 핵심 차별화

### 1. 정답 판정과 무결성 판정의 분리

- AC: 코드가 테스트케이스를 통과한 상태
- Verified AC: 코드 통과 + 풀이 설명 + 이해도 질문 + 무결성 점수 기준 이하

### 2. 다양한 문제 유형

| 유형 | 설명 |
|------|------|
| STANDARD | 일반 풀이형 |
| VERIFIED | 검증 풀이형 |
| CODE_PATCH | 코드 수정형 |
| DEBUGGING | 디버깅형 |
| COUNTEREXAMPLE | sco 찾기형 |
| INTERACTIVE | 인터랙티브형 |
| OPTIMIZATION | 최적화형 |

### 3. 3가지 역할

- **풀이자**: 문제를 풀고 제출하는 일반 사용자
- **검수자**: 문제 품질과 제출 신뢰도를 검토
- **어드민**: 서비스 전체 운영자

## 디자인 원칙

### 톤 & 메시지

- 단정함, 냉정함, 기술적, 과장 없음
- "도구처럼 보이는 제품"

### 컬러

- Base: 어두운 흑연 단색 (`#0F1317`, `#151A20`, `#1A2027`)
- Accent: Azure `#58A6FF` (기본 강조색)
- Special: Lime `#C3FF4D` (라이브 대회/이벤트용)

### UI 원칙

- 한 화면에서 강조색은 하나만 사용
- 그라디언트, 과한 네온, 게임 UI 느낌 금지
- 색상만으로 상태를 전달하지 말고 텍스트 배지와 아이콘 함께 사용

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS 4 |
| Backend | NestJS |
| Database | PostgreSQL |
| Cache/Queue | Redis, BullMQ |
| Judge | Docker Sandbox |
| Storage | S3 호환 객체 스토리지 |

## 개발 로드맵

### MVP
- 회원가입/로그인
- 문제 목록/상세
- 코드 에디터
- 코드 제출/채점
- 기본 랭킹
- 풀이 설명 제출
- Verified AC 기본 구조

### v1
- 대회 기능
- 스코어보드
- 문제별 질문/풀이 공유
- 제출 검수
- 위험 점수

### v2
- 코드 수정 미션
- sco 찾기형 문제
- 시즌 랭킹
- 학습 로드맵
- 조직/학교 기능

### v3
- 감독형 시험 모드
- 기업 평가 모드
- 인증시험
- 고급 무결성 분석

## TODO

- [ ] [backend][2주] NestJS 기본 구조 설정
- [ ] [backend][2주] PostgreSQL 스키마 설계 및 Prisma 설정
- [ ] [judge][3주] Docker 기반 샌드박스 채점 시스템
- [ ] [frontend][1주] Verified AC 진행 화면

## 오픈 이슈

1. 판정 결과에 대한 사용자 항소 절차 상세화
2. 대회 중 실시간 무결성 검사 수준 결정
3. 기업 시험 모드의 프록터링 범위

## 관련 문서

- [디자인 시스템](../02-design-system/01-design-principles.md)
- [무결성 및 채점](../03-integrity-and-judging/01-ai-threat-model.md)
- [아키텍처](../04-architecture/02-recommended-architecture.md)
