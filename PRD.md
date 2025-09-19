# 세로움 수액센터 관리 프로그램 PRD (Product Requirements Document)
# 세로움 수액센터 관리 프로그램 PRD (Product Requirements Document)
# 세로움 수액센터 관리 프로그램 PRD (Product Requirements Document)

## 1. 프로젝트 개요

### 1.1 프로젝트명
- **프로젝트명**: 세움 수액센터 관리 시스템 (Seroum IV Center Management System)
- **버전**: 1.0.0
- **개발 시작일**: 2024년 12월
- **개발 목표**: 수액센터 운영 효율성 향상 및 디지털 전환

### 1.2 프로젝트 목적
- 수액센터의 일별/주별/월별 서비스 이용 현황을 디지털화하여 관리
- 매출 데이터를 실시간으로 추적하고 분석하여 의사결정 지원
- 마케팅 효과 측정 및 고객 유입 경로 최적화
- 쿠폰 시스템을 통한 고객 관리 및 리텐션 향상
- 수기 작업을 자동화하여 운영 효율성 80% 향상

## 2. 기술 스택

### 2.1 프론트엔드
- **프레임워크**: Next.js 15.5.3 (App Router)
- **언어**: TypeScript 5
- **UI 라이브러리**: React 19.1.0
- **스타일링**: Tailwind CSS 4
- **차트 라이브러리**: Chart.js 또는 Recharts
- **폰트**: Geist (Vercel 폰트)

### 2.2 백엔드 & 데이터베이스
- **BaaS**: Supabase 2.57.4
- **인증**: Supabase Auth (직원별 권한 관리)
- **데이터베이스**: PostgreSQL (Supabase)
- **실시간 기능**: Supabase Realtime
- **파일 저장**: Supabase Storage

### 2.3 개발 도구
- **린터**: ESLint 9
- **패키지 매니저**: npm
- **빌드 도구**: Turbopack (Next.js)
- **데이터 검증**: Zod

## 3. 기능 요구사항

### 3.1 핵심 기능 (MVP)

#### 🏥 수액 서비스 관리 시스템 (listup.md 기반)

##### 관리자 페이지 - 수액 서비스 CRUD 관리
- [ ] **수액 서비스 등록**: 
  - 서비스명, 카테고리, 시간, 기본가격, 효과설명 입력
  - 10개 카테고리 분류: 피로회복&면역력, 감기&숙취, 뇌건강&인지능력, 장건강&소화기, 미용&항노화, 혈관&순환, 태반&호르몬, 항암&면역치료, 영양보충&에너지, 특수주사&해독
  - 패키지 가격 설정: 4회 코스(10% 할인), 8회 코스(20% 할인)
  - 추가 구성 옵션: 백옥(3만원), 백옥더블(5만원), 가슴샘(7만원), 강력주사(5만원)

- [ ] **수액 서비스 수정**:
  - 기존 서비스 정보 수정 (이름, 가격, 효과, 카테고리 등)
  - 실시간 가격 업데이트 및 패키지 할인율 조정
  - 서비스 활성화/비활성화 상태 관리

- [ ] **수액 서비스 삭제**:
  - 서비스 삭제 (사용 중인 서비스는 비활성화 처리)
  - 삭제 전 사용 현황 확인 및 경고 메시지

- [ ] **수액 서비스 목록 관리**:
  - 30개 서비스 전체 목록 관리 (listup.md 기준)
  - 카테고리별 필터링 및 검색 기능
  - 가격대별 정렬 (저가/중가/고가/프리미엄)
  - 서비스별 상세 정보 모달

##### 사용자 페이지 - 수액 서비스 선택 및 예약
- [ ] **수액 서비스 선택 인터페이스**:
  - 카테고리별 탭으로 서비스 분류 표시
  - 서비스 카드 형태로 시각적 표시 (이름, 가격, 시간, 효과 요약)
  - 실시간 가격 표시 (기본가격, 4회/8회 패키지 가격)
  - 추가 구성 옵션 선택 UI

- [ ] **빠른 예약 처리**:
  - 원클릭 서비스 선택
  - 패키지 코스 자동 계산 (할인율 적용)
  - 추가 옵션 선택 시 실시간 가격 업데이트
  - 환자 정보와 연동한 예약 생성

- [ ] **가격 계산 시스템**:
  - 기본 서비스 가격 + 추가 옵션 가격 자동 계산
  - 패키지 할인율 자동 적용 (4회 10%, 8회 20%)
  - 쿠폰 할인 적용 (무료쿠폰, 생일쿠폰 50% 등)
  - 최종 결제 금액 실시간 표시

#### 📊 서비스 이용 현황 관리 (엑셀 기반 데이터 디지털 전환)

##### 일별 서비스 이용 현황 입력 시스템
- [ ] **일별 데이터 입력 인터페이스**: 
  - 달력 형태로 날짜 선택 → 38개 서비스별 이용 건수 입력
  - 자주 사용되는 서비스는 원클릭으로 +1/-1 조정 가능
  - 전날 데이터 복사 기능으로 빠른 입력 지원
  - 입력 즉시 자동 저장 및 검증

- [ ] **서비스별 이용 현황 관리**:
  - **피로회복 & 면역력**: 파워비타민, 피로회복(2), 프리미엄회복, 필수면역(2), 프리미엄면역(2)
  - **혈관 & 순환**: 혈관청소, VIP혈관청소
  - **감기 & 숙취**: 감기야가라, 숙취야가라, 쾌속면역
  - **뇌건강 & 인지능력**: 오메가3, 뇌젊음다시, 프리미엄뇌젊음주사, 총명주사
  - **장건강 & 소화기**: 장건강회복(수액), 장건강회복(내시경), 장기능(병동), 종검장기능(free), 프리미엄장건강회복
  - **미용 & 항노화**: 백옥, 백옥더블, VIP백옥더블
  - **태반 & 호르몬**: 태반, 태반더블, 태반트리플
  - **영양보충 & 에너지**: 가슴샘, 가슴샘더블, 가슴샘쿼드러플, 단백에센셜, 단백파워업, 멀티미네랄, 프리미엄멀티미네랄
  - **특수주사 & 해독**: 킬레이션, 프리미엄킬레이션, 강력주사, 감초주사
  - **에너지**: 에너지풀파워, 에너지파워

- [ ] **자동 집계 시스템**:
  - 일별 총 이용 건수 자동 계산
  - 주차별(1주차~5주차) 자동 집계
  - 월별 총합 및 평균 자동 계산
  - 서비스별 인기 순위 자동 산출

- [ ] **데이터 내보내기 및 인쇄 기능**:
  - **엑셀 내보내기**: 일별/주별/월별 서비스 이용 현황을 엑셀 파일로 다운로드
  - **PDF 인쇄**: 서비스별 이용 통계를 PDF 형태로 인쇄 가능
  - **CSV 내보내기**: 데이터 분석을 위한 CSV 파일 다운로드
  - **인쇄 미리보기**: 인쇄 전 레이아웃 확인 및 페이지 설정
  - **일괄 내보내기**: 여러 기간의 데이터를 한 번에 내보내기

- [ ] **데이터 검증 및 오류 방지**:
  - 입력값 범위 체크 (0 이상의 정수)
  - 중복 입력 방지
  - 필수 입력 항목 검증
  - 데이터 일관성 검사

#### 💰 매출 관리 시스템 (엑셀 기반 매출 데이터 디지털 전환)

##### 일별 매출 입력 및 관리
- [ ] **일별 매출 입력 인터페이스**:
  - 수액센터 월별 매출 입력 (예: 9월 1,240,000원)
  - 내시경 월별 매출 입력 (예: 9월 1,575,000원)
  - 수액+내시경 월별매출 자동 계산 (총 2,815,000원)
  - 일별 매출 입력 시 실시간 총합 표시

- [ ] **월별 매출 관리**:
  - 1월~12월 월별 매출 입력 및 수정
  - 월별 목표 설정 및 달성률 표시
  - 전년 동월 대비 성장률 자동 계산
  - 월별 평균 매출 자동 산출

- [ ] **연간 매출 분석**:
  - 연간 총 매출 자동 집계 (예: 2024년 154,617,000원)
  - 월평균 매출 계산 (예: 12,884,750원)
  - 계절성 패턴 분석 (월별 매출 변동 추이)
  - 목표 대비 실적 분석

- [ ] **매출 트렌드 분석**:
  - 월별 매출 비교 차트 (막대 그래프)
  - 성장률 분석 (전월 대비, 전년 동월 대비)
  - 수액센터 vs 내시경 매출 비율 분석
  - 계절성 패턴 시각화

- [ ] **수익성 분석**:
  - 서비스별 매출 기여도 분석
  - 인기 서비스와 매출 상관관계 분석
  - 수익성 높은 서비스 식별
  - 서비스별 평균 단가 분석

- [ ] **매출 데이터 내보내기 및 인쇄 기능**:
  - **엑셀 내보내기**: 일별/월별/연간 매출 데이터를 엑셀 파일로 다운로드
  - **PDF 보고서**: 매출 분석 보고서를 PDF 형태로 생성 및 인쇄
  - **차트 내보내기**: 매출 트렌드 차트를 이미지 파일로 저장
  - **요약 보고서**: 월별/연간 매출 요약 보고서 자동 생성
  - **비교 분석**: 전년 대비, 전월 대비 매출 비교표 내보내기

#### 🎯 마케팅/유입 경로 분석 (엑셀 기반 방문 경로 데이터 디지털 전환)

##### 방문 경로별 고객 유입 관리
- [ ] **방문 경로 분류 관리**:
  - **검색**: 온라인 검색을 통한 유입
  - **직원소개**: 직원을 통한 소개 유입
  - **현내광고**: 원내 광고를 통한 유입
  - **이벤트메세지**: 이벤트 메시지를 통한 유입
  - **내시장실**: 내시경실을 통한 유입
  - **진료**: 진료를 통한 유입
  - **지인소개**: 지인 소개를 통한 유입

- [ ] **일별 방문 경로 입력**:
  - 각 방문 경로별 일일 고객 수 입력
  - 방문 경로별 일일 매출 기여도 입력
  - 자동 총합 계산 (예: 9월 총 8명 유입)
  - 방문 경로별 색상 구분 표시

- [ ] **방문 경로별 통계 분석**:
  - **현내광고**: 2명 유입 (25% 기여도)
  - **진료**: 1명 유입 (12.5% 기여도)
  - **지인소개**: 5명 유입 (62.5% 기여도)
  - 각 경로별 월별/연간 트렌드 분석

- [ ] **ROI 분석 및 마케팅 효과 측정**:
  - 방문 경로별 고객당 평균 매출 계산
  - 마케팅 채널별 투자 대비 수익 분석
  - 가장 효과적인 유입 경로 식별
  - 마케팅 예산 배분 최적화 제안

- [ ] **고객 유입 패턴 분석**:
  - 시간대별 유입 패턴 (오전/오후/저녁)
  - 요일별 유입 패턴 (평일/주말)
  - 계절별 유입 패턴 분석
  - 유입 경로별 고객 특성 분석

- [ ] **방문 경로 데이터 내보내기 및 인쇄 기능**:
  - **엑셀 내보내기**: 방문 경로별 일별/월별 통계를 엑셀 파일로 다운로드
  - **PDF 분석 보고서**: 유입 경로 분석 보고서를 PDF 형태로 생성
  - **차트 내보내기**: 방문 경로별 기여도 차트를 이미지로 저장
  - **ROI 분석표**: 마케팅 채널별 ROI 분석표 내보내기
  - **트렌드 분석**: 유입 경로별 트렌드 분석 보고서 생성

#### 🎫 쿠폰 관리 시스템 (엑셀 기반 쿠폰 데이터 디지털 전환)

##### VIP 쿠폰 및 생일자 쿠폰 관리
- [ ] **VIP 쿠폰 관리**:
  - VIP 쿠폰 발급자별 할당량 관리 (예: 권창모 6개, 김주석 6개, 곽봉용 46개)
  - 관련 인물 매핑 (예: 김주석 → 이정옥(526898), 박동현(133990))
  - 실제 사용량 추적 (예: 김주석 2개 사용, 곽봉용 10개 사용)
  - 월별 총 발급량 및 사용량 집계 (예: 9월 총 158개 발급, 28개 사용)

- [ ] **생일자 쿠폰 관리**:
  - 생일자 쿠폰 사용 이력 관리 (날짜, 환자명, ID, 서비스, 횟수)
  - 생일자 쿠폰 50% 할인 자동 적용
  - 월별 생일자 쿠폰 사용 통계 (예: 9월 총 8회 사용)
  - 생일자별 쿠폰 사용 한도 관리

- [ ] **무료 쿠폰 관리**:
  - 무료 쿠폰 발급 및 사용 추적
  - 무료 쿠폰 사용 시 100% 할인 적용
  - 무료 쿠폰 사용자 통계 및 분석

- [ ] **쿠폰 정책 관리**:
  - "해당 월에만 유효하며 다음 달로 이월되지 않음" 정책 적용
  - "개인 할당량 초과 시 2만원 지불 후 사용 가능" 정책 적용
  - "초과 사용 개수에는 제한이 없음" 정책 적용
  - 쿠폰 유효기간 자동 관리

- [ ] **쿠폰 사용 내역 추적**:
  - 쿠폰 사용 시 자동 할인 금액 계산
  - 환자별 쿠폰 사용 이력 조회
  - 서비스별 쿠폰 사용 통계
  - 쿠폰 사용이 매출에 미치는 영향 분석

- [ ] **쿠폰 효과 분석**:
  - 쿠폰 사용률 분석 (발급 대비 사용률)
  - 쿠폰별 매출 기여도 분석
  - VIP 고객 유지율 분석
  - 생일자 쿠폰 재방문율 분석

- [ ] **쿠폰 데이터 내보내기 및 인쇄 기능**:
  - **엑셀 내보내기**: VIP쿠폰/생일자쿠폰 사용 현황을 엑셀 파일로 다운로드
  - **PDF 쿠폰 보고서**: 쿠폰 사용 통계 및 효과 분석 보고서 생성
  - **쿠폰 발급 명단**: 발급자별 쿠폰 할당량 및 사용 현황 명단 인쇄
  - **할인 효과 분석**: 쿠폰별 할인 금액 및 매출 기여도 분석표
  - **월별 쿠폰 요약**: 월별 쿠폰 발급/사용 요약 보고서 자동 생성

### 3.2 추가 기능 (Future)

#### 🔔 실시간 알림 및 알림센터
- [ ] **실시간 알림 시스템**:
  - 데이터 입력 후 자동 업데이트 알림
  - 예약 완료/취소 실시간 알림
  - 쿠폰 사용 및 발급 알림
  - 매출 목표 달성/미달성 알림
  - 시스템 오류 및 경고 알림
  - 브라우저 푸시 알림 지원

- [ ] **알림센터**:
  - 모든 알림을 한 곳에서 관리
  - 알림 읽음/안읽음 상태 관리
  - 알림 카테고리별 분류
  - 알림 설정 개인화
  - 알림 히스토리 보관

#### 🔍 고급 검색 및 필터링 시스템
- [ ] **다중 조건 검색**:
  - 날짜 + 서비스 + 환자 + 금액 범위 조합 검색
  - AND/OR 조건 설정
  - 검색 결과 실시간 미리보기
  - 검색 조건 저장 및 즐겨찾기

- [ ] **스마트 검색**:
  - 자동완성 검색 (환자명, 서비스명, 전화번호)
  - 검색 히스토리 관리
  - 음성 검색 (모바일 환경)
  - 오타 자동 수정 제안
  - 유사 검색 결과 제공

#### 📊 실시간 대시보드 위젯
- [ ] **개인화된 대시보드**:
  - 드래그 앤 드롭으로 위젯 배치
  - 위젯 크기 조정 (1x1, 2x1, 2x2)
  - 실시간 업데이트되는 차트 위젯
  - 개인별 대시보드 설정 저장
  - 위젯별 새로고침 주기 설정

- [ ] **위젯 종류**:
  - 실시간 매출 현황
  - 오늘의 예약 현황
  - 인기 서비스 순위
  - 쿠폰 사용 현황
  - 직원별 실적
  - 시스템 상태 모니터

#### 📅 캘린더 통합 관리
- [ ] **통합 일정 관리**:
  - 예약 + 직원 근무 + 휴무 통합 관리
  - 월간/주간/일간 뷰 전환
  - 색상 코딩 (서비스별, 상태별, 직원별)
  - 일정 충돌 방지 및 알림
  - 반복 일정 설정 (정기 예약)

- [ ] **캘린더 기능**:
  - 일정 드래그 앤 드롭으로 이동
  - 일정 더블클릭으로 상세 정보 수정
  - 휴무일 및 공휴일 자동 표시
  - 직원별 개인 캘린더
  - 캘린더 공유 및 권한 설정

#### 💾 데이터 백업 및 복구
- [ ] **자동 백업 시스템**:
  - 일일/주간/월간 자동 백업
  - 증분 백업 (변경된 데이터만)
  - 클라우드 백업 지원
  - 백업 파일 암호화
  - 백업 완료 알림

- [ ] **데이터 복구**:
  - 특정 시점으로 데이터 복구
  - 백업 파일 다운로드
  - 백업 히스토리 관리
  - 복구 전 미리보기
  - 복구 작업 로그

#### 🔐 세분화된 권한 관리
- [ ] **권한 그룹 관리**:
  - 관리자, 매니저, 직원, 견습생 등 역할별 권한
  - 페이지별 접근 권한 설정
  - 기능별 권한 (읽기/쓰기/삭제)
  - 데이터 범위 권한 (전체/본인 담당만)
  - 권한 변경 이력 추적

- [ ] **보안 기능**:
  - 2단계 인증 (2FA)
  - 세션 타임아웃 설정
  - IP 주소 기반 접근 제한
  - 비밀번호 정책 강화
  - 로그인 시도 제한

#### 📱 모바일 앱 (PWA)
- [ ] **오프라인 기능**:
  - 오프라인 데이터 입력
  - 동기화 시 자동 업로드
  - 오프라인 모드 표시
  - 네트워크 상태 감지

- [ ] **모바일 전용 기능**:
  - 푸시 알림 지원
  - 바이오메트릭 인증 (지문, 얼굴)
  - 카메라를 통한 환자 정보 스캔
  - GPS 기반 출근/퇴근 체크
  - 음성 메모 기능

#### 🤖 자동화 및 스마트 기능
- [ ] **자동 알림 시스템**:
  - 예약 리마인더 (SMS/이메일)
  - 생일자 자동 쿠폰 발급
  - 매출 목표 달성 시 자동 알림
  - 정기 보고서 자동 생성 및 발송
  - 이상 패턴 감지 및 알림

- [ ] **스마트 추천**:
  - 환자별 맞춤 서비스 추천
  - 최적 예약 시간 제안
  - 쿠폰 사용 최적화 제안
  - 매출 증대 방안 제안

#### 🧠 AI 기반 고급 분석
- [ ] **예측 분석**:
  - AI 기반 수요 예측
  - 계절성 및 트렌드 분석
  - 고객 생애 가치(LTV) 분석
  - 서비스 추천 시스템
  - 수익성 최적화 제안

- [ ] **패턴 분석**:
  - 고객 행동 패턴 분석
  - 서비스 이용 패턴 분석
  - 매출 패턴 분석
  - 이상 거래 감지
  - 리스크 예측

#### 🔗 외부 시스템 연동
- [ ] **결제 시스템**:
  - 카드 결제 시스템 연동
  - 간편결제 (카카오페이, 네이버페이)
  - 현금영수증 자동 발행
  - 결제 내역 자동 기록

- [ ] **통신 시스템**:
  - SMS 발송 시스템 연동
  - 이메일 발송 시스템 연동
  - 카카오톡 알림톡 연동
  - 전화 자동 발신

- [ ] **외부 서비스 연동**:
  - 회계 시스템 연동
  - 의료진 관리 시스템 연동
  - CRM 시스템 연동
  - 클라우드 스토리지 연동

#### 📋 작업 흐름 관리
- [ ] **워크플로우 설계**:
  - 예약 → 접수 → 치료 → 결제 → 후속관리
  - 단계별 체크리스트
  - 작업 완료율 추적
  - 병목 구간 식별
  - 프로세스 개선 제안

- [ ] **작업 관리**:
  - 할 일 목록 관리
  - 작업 우선순위 설정
  - 작업 배정 및 위임
  - 작업 완료 알림
  - 작업 성과 분석

#### 💬 고객 소통 관리
- [ ] **고객 기록 관리**:
  - 고객별 메모 및 특이사항 기록
  - 상담 이력 관리
  - 고객 만족도 조사
  - 불만 사항 처리 추적
  - 고객 피드백 분석

- [ ] **소통 도구**:
  - 내부 메모 시스템
  - 고객별 대화 히스토리
  - 알림 및 리마인더
  - 고객 그룹 관리
  - 소통 템플릿 관리

#### 📈 실시간 모니터링
- [ ] **현황 모니터링**:
  - 현재 대기 중인 환자 수
  - 실시간 매출 현황
  - 직원별 작업 현황
  - 시스템 성능 모니터링
  - 이상 상황 자동 감지

- [ ] **모니터링 대시보드**:
  - 실시간 상태 표시
  - 경고 및 알림 표시
  - 성능 지표 시각화
  - 트렌드 모니터링
  - 자동 보고서 생성

#### 🎯 목표 관리 및 KPI 추적
- [ ] **목표 설정**:
  - 월별/연간 매출 목표 설정
  - 직원별 실적 목표 설정
  - 서비스별 목표 설정
  - 개인별 목표 설정
  - 목표 달성률 추적

- [ ] **KPI 대시보드**:
  - 목표 대비 실적 시각화
  - 달성률 게이지 표시
  - 목표 미달성 시 알림
  - 성과 분석 보고서
  - 개선 방안 제안

#### ⚙️ 시스템 설정 및 커스터마이징
- [ ] **시스템 설정**:
  - 테마 및 색상 커스터마이징
  - 언어 설정 (한국어/영어)
  - 시간대 설정
  - 통화 단위 설정
  - 사용자 정의 필드 추가

- [ ] **개인화 설정**:
  - 개인별 화면 레이아웃
  - 즐겨찾기 메뉴 설정
  - 알림 설정 개인화
  - 단축키 커스터마이징
  - 테마 및 폰트 설정

#### 🚀 추가 혁신 기능

#### 🎨 디지털 전환 고도화
- [ ] **스마트 태블릿 대시보드**:
  - 대형 터치스크린 전용 인터페이스
  - 직원별 개인화된 대시보드
  - 실시간 업데이트되는 위젯
  - 제스처 기반 조작 (스와이프, 핀치)
  - 음성 명령 지원

- [ ] **AR/VR 통합**:
  - AR을 활용한 환자 정보 오버레이
  - VR 기반 가상 상담 시스템
  - 3D 서비스 시각화
  - 몰입형 교육 시스템

#### 🧠 고급 AI 기능
- [ ] **자연어 처리**:
  - 음성으로 데이터 입력
  - 자연어 검색 ("지난주 VIP 고객들")
  - 자동 메모 생성
  - 감정 분석 (고객 만족도)

- [ ] **머신러닝 최적화**:
  - 예약 패턴 학습 및 최적화
  - 가격 자동 조정 제안
  - 직원 스케줄 자동 최적화
  - 재고 예측 및 자동 주문

#### 🔄 워크플로우 자동화
- [ ] **RPA (로봇 프로세스 자동화)**:
  - 반복 작업 자동화
  - 데이터 입력 자동화
  - 보고서 자동 생성
  - 이메일 자동 발송

- [ ] **스마트 워크플로우**:
  - 조건부 자동 실행
  - 예외 상황 자동 처리
  - 워크플로우 성능 분석
  - 자동 개선 제안

#### 📊 고급 분석 도구
- [ ] **비즈니스 인텔리전스**:
  - OLAP 큐브 분석
  - 다차원 데이터 분석
  - 드릴다운/드릴업 기능
  - 임시 분석 도구

- [ ] **예측 모델링**:
  - 시계열 예측
  - 회귀 분석
  - 분류 모델
  - 앙상블 모델

#### 🌐 클라우드 및 하이브리드
- [ ] **멀티 클라우드 지원**:
  - AWS, Azure, GCP 지원
  - 클라우드 간 데이터 동기화
  - 재해 복구 자동화
  - 비용 최적화

- [ ] **엣지 컴퓨팅**:
  - 로컬 데이터 처리
  - 실시간 분석
  - 오프라인 기능 강화
  - 지연 시간 최소화

#### 🔒 고급 보안
- [ ] **제로 트러스트 보안**:
  - 모든 접근 검증
  - 최소 권한 원칙
  - 지속적 모니터링
  - 위협 탐지

- [ ] **데이터 거버넌스**:
  - 데이터 분류 및 라벨링
  - 개인정보 보호 강화
  - 데이터 유통 추적
  - 규정 준수 자동화

#### 🎯 고객 경험 혁신
- [ ] **개인화된 고객 포털**:
  - 고객 전용 웹사이트
  - 예약 및 결제 자체 서비스
  - 개인 건강 기록 관리
  - 맞춤형 서비스 추천

- [ ] **스마트 대기 시스템**:
  - 실시간 대기 시간 안내
  - 위치 기반 알림
  - 대기 중 서비스 제공
  - 가상 대기실

#### 📱 차세대 모바일
- [ ] **웨어러블 기기 연동**:
  - 스마트워치 알림
  - 생체 데이터 수집
  - 위치 추적
  - 응급 상황 감지

- [ ] **IoT 통합**:
  - 스마트 장비 연동
  - 환경 센서 데이터
  - 자동 데이터 수집
  - 원격 모니터링

#### 🌍 글로벌화
- [ ] **다국어 지원**:
  - 10개 언어 지원
  - 자동 번역
  - 현지화된 UI
  - 문화별 맞춤화

- [ ] **국제 표준 준수**:
  - HL7 FHIR 의료 표준
  - ISO 27001 보안 표준
  - GDPR 개인정보 보호
  - SOC 2 컴플라이언스

#### 🚀 미래 기술 준비
- [ ] **블록체인 통합**:
  - 의료 기록 무결성
  - 스마트 계약
  - 투명한 거래 기록
  - 분산 신원 관리

- [ ] **양자 컴퓨팅 준비**:
  - 복잡한 최적화 문제 해결
  - 암호화 강화
  - 대용량 데이터 처리
  - 미래 기술 대응

- [ ] **예약 시스템**: 온라인 예약 및 스케줄 관리
- [ ] **모바일 앱**: 직원용 모바일 앱 개발

## 4. 사용자 스토리

### 4.1 수액센터 직원 (사용자 페이지) - 엑셀 기반 업무 디지털 전환

#### 📱 일일 업무 대시보드 (엑셀 대체)
- **직원으로서** 엑셀 스프레드시트 대신 직관적인 대시보드에서 일일 업무를 처리하고 싶다
- **직원으로서** 오늘의 서비스 이용 현황을 원클릭으로 입력하고 싶다 (엑셀의 38개 서비스 × 30일 표 대체)
- **직원으로서** 일일 매출을 빠르게 입력하고 실시간 총합을 확인하고 싶다 (엑셀의 수액+내시경 월별매출 대체)
- **직원으로서** 쿠폰 사용 현황을 실시간으로 추적하고 싶다 (엑셀의 VIP쿠폰, 생일자쿠폰 표 대체)
- **직원으로서** 방문 경로를 쉽게 선택하고 입력하고 싶다 (엑셀의 방문 경로 표 대체)

#### 🏥 수액 서비스 관리 (listup.md 기반)
- **직원으로서** listup.md의 30개 수액 서비스를 카테고리별로 쉽게 선택하고 싶다
- **직원으로서** 서비스 선택 시 실시간으로 가격이 계산되는 것을 보고 싶다
- **직원으로서** 패키지 코스(4회/8회)와 추가 옵션을 선택하여 최종 금액을 확인하고 싶다
- **직원으로서** 환자 정보와 연동하여 빠르게 예약을 생성하고 싶다
- **직원으로서** 쿠폰 할인을 적용하여 최종 결제 금액을 계산하고 싶다

#### 📊 데이터 입력 및 관리 (엑셀 기능 대체)
- **직원으로서** 엑셀의 복잡한 수식 없이 자동으로 주차별/월별 집계가 되기를 원한다
- **직원으로서** 전날 데이터를 복사해서 수정하는 방식으로 빠르게 입력하고 싶다
- **직원으로서** 입력 실수를 방지하는 자동 검증 기능이 있기를 원한다
- **직원으로서** 모바일에서도 편리하게 데이터를 입력하고 싶다

#### 📈 통계 및 분석 (엑셀 차트 대체)
- **직원으로서** 엑셀의 수동 차트 대신 자동으로 생성되는 시각화 차트를 보고 싶다
- **직원으로서** 실시간으로 매출 현황과 서비스 이용 현황을 확인하고 싶다
- **직원으로서** 인기 서비스 순위와 매출 기여도를 한눈에 보고 싶다
- **직원으로서** 마케팅 채널별 효과를 확인하여 고객 유입을 늘리고 싶다

#### 🔔 실시간 알림 및 스마트 기능
- **직원으로서** 예약 완료나 취소 시 실시간으로 알림을 받고 싶다
- **직원으로서** 쿠폰 사용이나 매출 목표 달성 시 자동으로 알림을 받고 싶다
- **직원으로서** 음성으로 데이터를 입력하고 검색하고 싶다
- **직원으로서** 환자별 맞춤 서비스 추천을 받고 싶다

#### 📱 모바일 및 오프라인 기능
- **직원으로서** 모바일에서도 모든 기능을 사용하고 싶다
- **직원으로서** 인터넷이 없어도 데이터를 입력하고 나중에 동기화하고 싶다
- **직원으로서** 카메라로 환자 정보를 스캔하고 싶다
- **직원으로서** GPS로 출근/퇴근을 자동으로 체크하고 싶다

#### 🎯 목표 관리 및 성과 추적
- **직원으로서** 개인 목표를 설정하고 실시간으로 달성률을 확인하고 싶다
- **직원으로서** 목표 미달성 시 자동으로 알림을 받고 싶다
- **직원으로서** 성과 분석 보고서를 자동으로 받고 싶다
- **직원으로서** 개선 방안을 AI가 제안해주기를 원한다

### 4.2 관리자 (관리자 페이지)

#### 🏥 서비스 및 시스템 관리
- **관리자로서** listup.md의 30개 수액 서비스를 등록, 수정, 삭제하고 싶다
- **관리자로서** 각 서비스의 가격을 실시간으로 조정하고 패키지 할인율을 설정하고 싶다
- **관리자로서** 10개 카테고리별로 서비스를 체계적으로 관리하고 싶다
- **관리자로서** 추가 구성 옵션(백옥, 가슴샘 등)의 가격을 관리하고 싶다

#### 📊 고급 분석 및 예측
- **관리자로서** AI 기반 수요 예측과 트렌드 분석을 보고 싶다
- **관리자로서** 고객 생애 가치(LTV) 분석을 통해 마케팅 전략을 수립하고 싶다
- **관리자로서** 실시간 모니터링 대시보드로 전체 현황을 파악하고 싶다
- **관리자로서** 자동화된 보고서를 받아 의사결정을 하고 싶다

#### 🔐 보안 및 데이터 관리
- **관리자로서** 시스템 전체의 성능과 보안을 모니터링하고 싶다
- **관리자로서** 데이터 백업과 복구를 자동화하고 싶다
- **관리자로서** 2단계 인증과 고급 보안 기능을 설정하고 싶다
- **관리자로서** 개인정보 보호 규정을 자동으로 준수하고 싶다

#### 🔗 시스템 연동 및 자동화
- **관리자로서** 외부 시스템과의 연동을 설정하고 관리하고 싶다
- **관리자로서** RPA를 활용해 반복 작업을 자동화하고 싶다
- **관리자로서** 워크플로우를 설계하고 최적화하고 싶다
- **관리자로서** 자동 알림 시스템을 설정하고 관리하고 싶다

#### 🎯 비즈니스 전략 및 목표 관리
- **관리자로서** AI 기반 분석 결과를 바탕으로 비즈니스 전략을 수립하고 싶다
- **관리자로서** 조직 전체의 목표를 설정하고 KPI를 추적하고 싶다
- **관리자로서** 직원별 성과를 분석하고 개선 방안을 제시하고 싶다
- **관리자로서** 수익성 최적화 방안을 AI가 제안해주기를 원한다

#### 🌐 글로벌 및 미래 준비
- **관리자로서** 다국어 지원으로 글로벌 확장을 준비하고 싶다
- **관리자로서** 국제 표준을 준수하는 시스템을 구축하고 싶다
- **관리자로서** 블록체인과 같은 미래 기술을 도입하고 싶다
- **관리자로서** 클라우드와 하이브리드 환경을 유연하게 관리하고 싶다

## 5. 기술적 요구사항

### 5.1 성능
- **로딩 시간**: 초기 로딩 2초 이내
- **데이터 입력**: 실시간 저장 및 자동 계산
- **동시 사용자**: 최대 10명 동시 접속 지원
- **데이터 처리**: 10만 건 이상의 데이터 처리 가능

### 5.2 보안
- **인증**: 직원별 권한 관리 (읽기/쓰기/관리자)
- **데이터 보호**: HTTPS 필수, 데이터 암호화
- **입력 검증**: 클라이언트/서버 양쪽 데이터 검증
- **백업**: 일일 자동 백업

### 5.3 호환성
- **브라우저**: Chrome, Firefox, Safari, Edge (최신 2개 버전)
- **모바일**: iOS 14+, Android 8+
- **반응형**: 320px ~ 1920px
- **오프라인**: 기본 데이터 조회 가능 (PWA)

### 5.4 개발 및 테스트 전략 (MSW + Playwright + Supabase)

#### 🧪 MSW (Mock Service Worker) 통합
- **목업 API 서버**: 
  - Supabase 연동 전 개발 단계에서 실제 API와 동일한 인터페이스 제공
  - 네트워크 레벨에서 HTTP 요청을 가로채서 목업 데이터 반환
  - 브라우저와 Node.js 환경 모두에서 동일한 목업 데이터 사용

- **목업 데이터 관리**:
  - `src/mocks/` 디렉토리에 API 핸들러 정의
  - 실제 Supabase API 스키마와 동일한 데이터 구조 사용
  - 개발/테스트/프로덕션 환경별 다른 목업 데이터 설정

- **API 핸들러 예시**:
  ```typescript
  // src/mocks/handlers/services.ts
  export const servicesHandlers = [
    rest.get('/api/services', (req, res, ctx) => {
      return res(ctx.json(mockServicesData))
    }),
    rest.post('/api/services', (req, res, ctx) => {
      return res(ctx.json({ id: 'new-service-id', ...req.body }))
    })
  ]
  ```

#### 🎭 Playwright 통합 테스트
- **E2E 테스트 자동화**:
  - 사용자 시나리오 기반 종단간 테스트
  - 실제 브라우저에서 사용자 행동 시뮬레이션
  - MSW와 연동하여 안정적인 테스트 환경 구축

- **테스트 시나리오**:
  - 로그인/로그아웃 플로우
  - 서비스 등록/수정/삭제 플로우
  - 예약 생성/수정/취소 플로우
  - 환자 정보 관리 플로우
  - 매출 데이터 입력 및 분석 플로우
  - 쿠폰 발급 및 사용 플로우

- **테스트 환경 설정**:
  ```typescript
  // playwright.config.ts
  export default defineConfig({
    testDir: './tests/e2e',
    use: {
      baseURL: 'http://localhost:3000',
      // MSW와 연동된 테스트 환경
    },
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    ]
  })
  ```

#### 🗄️ Supabase 연동 전략
- **단계적 마이그레이션**:
  1. **Phase 1**: MSW로 완전한 기능 개발 및 테스트
  2. **Phase 2**: Playwright로 E2E 테스트 완료
  3. **Phase 3**: Supabase 스키마 생성 및 데이터 마이그레이션
  4. **Phase 4**: MSW에서 Supabase로 API 엔드포인트 교체

- **환경별 설정**:
  ```typescript
  // src/lib/api-client.ts
  const isDevelopment = process.env.NODE_ENV === 'development'
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK === 'true'
  
  export const apiClient = {
    baseURL: useMockData ? '/api/mock' : '/api/supabase',
    // MSW 또는 Supabase API 선택
  }
  ```

#### 🔄 개발 워크플로우
- **개발 단계**:
  1. MSW로 API 목업 설정
  2. 프론트엔드 기능 개발
  3. Playwright로 E2E 테스트 작성
  4. 테스트 통과 확인

- **테스트 단계**:
  1. MSW 환경에서 Playwright 테스트 실행
  2. 다양한 브라우저/디바이스에서 테스트
  3. 성능 및 접근성 테스트
  4. 테스트 결과 리포트 생성

- **배포 단계**:
  1. Supabase 스키마 생성
  2. 목업 데이터를 Supabase로 마이그레이션
  3. API 엔드포인트를 Supabase로 교체
  4. 프로덕션 환경에서 최종 테스트

#### 📊 테스트 커버리지 및 품질 관리
- **코드 커버리지**: 90% 이상 목표
- **E2E 테스트 커버리지**: 주요 사용자 시나리오 100%
- **성능 테스트**: Lighthouse 점수 90점 이상
- **접근성 테스트**: WCAG 2.1 AA 준수

#### 🛠️ 개발 도구 및 설정
- **MSW 설정**:
  ```typescript
  // src/mocks/browser.ts
  import { setupWorker } from 'msw'
  import { handlers } from './handlers'
  
  export const worker = setupWorker(...handlers)
  ```

- **Playwright 설정**:
  ```typescript
  // tests/setup.ts
  import { test as base } from '@playwright/test'
  import { setupMockServer } from './utils/mock-server'
  
  export const test = base.extend({
    page: async ({ page }, use) => {
      await setupMockServer(page)
      await use(page)
    }
  })
  ```

- **환경 변수**:
  ```bash
  # .env.local
  NEXT_PUBLIC_USE_MOCK=true
  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
  ```

#### 📈 성능 및 모니터링
- **MSW 성능**:
  - 목업 API 응답 시간 < 100ms
  - 메모리 사용량 최적화
  - 핸들러 등록/해제 자동화

- **Playwright 성능**:
  - 테스트 실행 시간 < 10분
  - 병렬 테스트 실행
  - 실패한 테스트 자동 재실행

- **Supabase 마이그레이션**:
  - 데이터 무결성 검증
  - 마이그레이션 롤백 계획
  - 성능 벤치마크 비교

## 6. 데이터베이스 스키마

### 6.1 직원 테이블 (staff)
```sql
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  role VARCHAR NOT NULL, -- 'admin', 'manager', 'staff'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.2 서비스 테이블 (services) - listup.md 기반 확장
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL, -- '피로회복&면역력', '감기&숙취', '뇌건강&인지능력', '장건강&소화기', '미용&항노화', '혈관&순환', '태반&호르몬', '항암&면역치료', '영양보충&에너지', '특수주사&해독'
  description TEXT, -- 서비스 효과 설명
  duration INTEGER NOT NULL, -- 소요 시간 (분)
  base_price DECIMAL(10,2) NOT NULL, -- 기본 가격
  package_4_price DECIMAL(10,2), -- 4회 코스 가격 (10% 할인)
  package_8_price DECIMAL(10,2), -- 8회 코스 가격 (20% 할인)
  price_tier VARCHAR NOT NULL, -- '저가', '중가', '고가', '프리미엄'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.2.1 추가 구성 옵션 테이블 (service_addons)
```sql
CREATE TABLE service_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL, -- '백옥', '백옥더블', '가슴샘', '강력주사'
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.2.2 서비스-추가옵션 연결 테이블 (service_addon_relations)
```sql
CREATE TABLE service_addon_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  addon_id UUID REFERENCES service_addons(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(service_id, addon_id)
);
```

### 6.3 일별 서비스 이용 현황 테이블 (daily_service_usage) - 엑셀 데이터 디지털 전환
```sql
CREATE TABLE daily_service_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  service_id UUID REFERENCES services(id),
  count INTEGER NOT NULL DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0, -- 해당 서비스의 일일 매출
  week_number INTEGER, -- 1주차~5주차
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, service_id)
);
```

### 6.3.1 일별 매출 테이블 (daily_revenue) - 엑셀 매출 데이터 디지털 전환
```sql
CREATE TABLE daily_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  iv_center_revenue DECIMAL(10,2) DEFAULT 0, -- 수액센터 매출
  endoscopy_revenue DECIMAL(10,2) DEFAULT 0, -- 내시경 매출
  total_revenue DECIMAL(10,2) GENERATED ALWAYS AS (iv_center_revenue + endoscopy_revenue) STORED,
  week_number INTEGER, -- 1주차~5주차
  month_number INTEGER, -- 1월~12월
  year_number INTEGER, -- 2024년
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date)
);
```

### 6.4 매출 테이블 (revenue)
```sql
CREATE TABLE revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  iv_center_revenue DECIMAL(10,2) DEFAULT 0,
  endoscopy_revenue DECIMAL(10,2) DEFAULT 0,
  total_revenue DECIMAL(10,2) GENERATED ALWAYS AS (iv_center_revenue + endoscopy_revenue) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.5 쿠폰 테이블 (coupons) - 엑셀 쿠폰 데이터 디지털 전환
```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL, -- 'VIP', '생일', '무료'
  discount_type VARCHAR NOT NULL, -- 'percentage', 'fixed'
  discount_value DECIMAL(10,2),
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.5.1 VIP 쿠폰 발급자 테이블 (vip_coupon_issuers) - 엑셀 VIP쿠폰 데이터 반영
```sql
CREATE TABLE vip_coupon_issuers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issuer_name VARCHAR NOT NULL, -- 권창모, 김주석, 곽봉용 등
  total_allocated INTEGER NOT NULL DEFAULT 0, -- 총 발급량
  used_count INTEGER NOT NULL DEFAULT 0, -- 실제 사용량
  remaining_count INTEGER GENERATED ALWAYS AS (total_allocated - used_count) STORED,
  month_year VARCHAR NOT NULL, -- '2024-09'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.5.2 VIP 쿠폰 관련 인물 테이블 (vip_coupon_relations)
```sql
CREATE TABLE vip_coupon_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issuer_id UUID REFERENCES vip_coupon_issuers(id),
  related_person_name VARCHAR NOT NULL,
  related_person_id VARCHAR, -- 괄호 안의 ID (예: 526898)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.6 쿠폰 사용 내역 테이블 (coupon_usage)
```sql
CREATE TABLE coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id),
  customer_name VARCHAR,
  customer_phone VARCHAR,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  staff_id UUID REFERENCES staff(id)
);
```

### 6.7 방문 경로 테이블 (visit_sources) - 엑셀 방문 경로 데이터 디지털 전환
```sql
CREATE TABLE visit_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name VARCHAR NOT NULL, -- '검색', '직원소개', '현내광고', '이벤트메세지', '내시장실', '진료', '지인소개'
  source_type VARCHAR NOT NULL, -- '온라인', '오프라인', '소개', '진료'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.7.1 일별 방문 경로 통계 테이블 (daily_visit_source_stats)
```sql
CREATE TABLE daily_visit_source_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  source_id UUID REFERENCES visit_sources(id),
  visitor_count INTEGER NOT NULL DEFAULT 0, -- 해당 경로로 유입된 고객 수
  revenue_contribution DECIMAL(10,2) DEFAULT 0, -- 해당 경로의 매출 기여도
  week_number INTEGER, -- 1주차~5주차
  month_number INTEGER, -- 1월~12월
  year_number INTEGER, -- 2024년
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, source_id)
);
```

### 6.8 고객 유입 테이블 (customer_acquisition)
```sql
CREATE TABLE customer_acquisition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  channel_id UUID REFERENCES marketing_channels(id),
  customer_count INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.9 예약 테이블 (reservations) - 수액 서비스 예약 관리
```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  service_id UUID REFERENCES services(id),
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  status VARCHAR NOT NULL DEFAULT '예약', -- '예약', '완료', '취소', '노쇼'
  package_type VARCHAR, -- 'single', 'package_4', 'package_8'
  package_count INTEGER DEFAULT 1, -- 패키지 내 진행 횟수
  base_price DECIMAL(10,2) NOT NULL,
  addon_price DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0, -- 쿠폰 할인 금액
  final_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.10 예약-추가옵션 테이블 (reservation_addons)
```sql
CREATE TABLE reservation_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  addon_id UUID REFERENCES service_addons(id),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.11 환자 테이블 (patients) - 환자 정보 관리
```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  birth_date DATE,
  gender VARCHAR, -- 'M', 'F'
  address TEXT,
  emergency_contact VARCHAR,
  emergency_phone VARCHAR,
  medical_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.12 가격 계산 로그 테이블 (price_calculations)
```sql
CREATE TABLE price_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id),
  base_price DECIMAL(10,2) NOT NULL,
  addon_total DECIMAL(10,2) DEFAULT 0,
  package_discount DECIMAL(10,2) DEFAULT 0,
  coupon_discount DECIMAL(10,2) DEFAULT 0,
  final_price DECIMAL(10,2) NOT NULL,
  calculation_details JSONB, -- 계산 과정 상세 정보
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 7. API 명세

### 7.1 인증 API
- `POST /api/auth/login` - 직원 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 직원 정보

### 7.2 서비스 관리 API (listup.md 기반)
- `GET /api/services` - 서비스 목록 조회 (카테고리별, 가격대별 필터링)
- `GET /api/services/:id` - 특정 서비스 상세 정보 조회
- `POST /api/services` - 서비스 추가 (관리자만)
- `PUT /api/services/:id` - 서비스 수정 (관리자만)
- `DELETE /api/services/:id` - 서비스 삭제/비활성화 (관리자만)
- `GET /api/services/categories` - 카테고리 목록 조회
- `GET /api/services/addons` - 추가 구성 옵션 목록 조회
- `POST /api/services/addons` - 추가 구성 옵션 추가 (관리자만)
- `PUT /api/services/addons/:id` - 추가 구성 옵션 수정 (관리자만)
- `GET /api/services/export/excel` - 서비스 목록 엑셀 내보내기
- `GET /api/services/export/pdf` - 서비스 카탈로그 PDF 생성
- `GET /api/services/statistics` - 서비스 이용 통계 조회
- `GET /api/services/statistics/export` - 서비스 통계 보고서 내보내기

### 7.3 이용 현황 API
- `GET /api/usage/daily` - 일별 이용 현황 조회
- `POST /api/usage/daily` - 일별 이용 현황 입력
- `PUT /api/usage/daily/:id` - 이용 현황 수정
- `GET /api/usage/weekly` - 주별 이용 현황 조회
- `GET /api/usage/monthly` - 월별 이용 현황 조회
- `GET /api/usage/export/excel` - 이용 현황 엑셀 내보내기
- `GET /api/usage/export/pdf` - 이용 현황 보고서 PDF 생성
- `GET /api/usage/statistics` - 이용 통계 데이터 조회
- `GET /api/usage/statistics/export` - 이용 통계 보고서 내보내기

### 7.4 매출 관리 API
- `GET /api/revenue/daily` - 일별 매출 조회
- `POST /api/revenue/daily` - 일별 매출 입력
- `GET /api/revenue/analytics` - 매출 분석 데이터
- `GET /api/revenue/trends` - 매출 트렌드 분석
- `GET /api/revenue/export/excel` - 매출 데이터 엑셀 내보내기
- `GET /api/revenue/export/pdf` - 매출 분석 보고서 PDF 생성
- `GET /api/revenue/export/charts` - 매출 차트 이미지 내보내기
- `GET /api/revenue/comparison/export` - 매출 비교 분석표 내보내기

### 7.5 쿠폰 관리 API
- `GET /api/coupons` - 쿠폰 목록 조회
- `POST /api/coupons` - 쿠폰 생성
- `POST /api/coupons/use` - 쿠폰 사용
- `GET /api/coupons/usage` - 쿠폰 사용 내역
- `GET /api/coupons/export/excel` - 쿠폰 사용 현황 엑셀 내보내기
- `GET /api/coupons/export/pdf` - 쿠폰 보고서 PDF 생성
- `GET /api/coupons/vip/export` - VIP 쿠폰 발급 명단 내보내기
- `GET /api/coupons/birthday/export` - 생일자 쿠폰 사용 현황 내보내기

### 7.6 마케팅 API
- `GET /api/marketing/channels` - 마케팅 채널 목록
- `POST /api/marketing/acquisition` - 고객 유입 데이터 입력
- `GET /api/marketing/analytics` - 마케팅 효과 분석
- `GET /api/marketing/export/excel` - 방문 경로 통계 엑셀 내보내기
- `GET /api/marketing/export/pdf` - 마케팅 분석 보고서 PDF 생성
- `GET /api/marketing/roi/export` - ROI 분석표 내보내기
- `GET /api/marketing/trends/export` - 유입 경로 트렌드 분석 내보내기

### 7.7 예약 관리 API (수액 서비스 예약)
- `GET /api/reservations` - 예약 목록 조회 (날짜별, 상태별 필터링)
- `GET /api/reservations/:id` - 특정 예약 상세 정보 조회
- `POST /api/reservations` - 예약 생성
- `PUT /api/reservations/:id` - 예약 수정
- `DELETE /api/reservations/:id` - 예약 취소
- `PUT /api/reservations/:id/status` - 예약 상태 변경 (완료, 노쇼 등)
- `GET /api/reservations/calendar` - 달력용 예약 데이터 조회
- `GET /api/reservations/export/excel` - 예약 목록 엑셀 내보내기
- `GET /api/reservations/export/pdf` - 예약 현황 보고서 PDF 생성
- `GET /api/reservations/schedule/export` - 일정표 내보내기

### 7.8 환자 관리 API
- `GET /api/patients` - 환자 목록 조회 (검색, 필터링)
- `GET /api/patients/:id` - 특정 환자 상세 정보 조회
- `POST /api/patients` - 환자 등록
- `PUT /api/patients/:id` - 환자 정보 수정
- `DELETE /api/patients/:id` - 환자 정보 삭제/비활성화
- `GET /api/patients/search` - 환자 검색 (이름, 연락처)
- `GET /api/patients/export/excel` - 환자 목록 엑셀 내보내기
- `GET /api/patients/export/pdf` - 환자 명단 PDF 생성
- `GET /api/patients/statistics` - 환자 통계 데이터 조회
- `GET /api/patients/statistics/export` - 환자 통계 보고서 내보내기

### 7.9 가격 계산 API
- `POST /api/pricing/calculate` - 가격 계산 (서비스 + 추가옵션 + 할인)
- `GET /api/pricing/package/:serviceId` - 패키지 가격 조회
- `POST /api/pricing/validate` - 가격 계산 검증
- `GET /api/pricing/history/:reservationId` - 가격 계산 이력 조회

## 8. UI/UX 가이드라인

### 8.1 디자인 시스템
- **컬러 팔레트**: 
  - Primary: #3B82F6 (Blue)
  - Secondary: #10B981 (Green)
  - Success: #059669
  - Warning: #F59E0B
  - Error: #EF4444
- **타이포그래피**: Geist 폰트 패밀리
- **간격**: 4px 단위 시스템
- **컴포넌트**: 재사용 가능한 컴포넌트 설계

### 8.2 페이지 구성
- **대시보드**: 주요 지표 카드, 차트, 최근 활동
- **데이터 입력**: 직관적인 폼, 실시간 검증
- **분석 페이지**: 차트와 그래프를 통한 시각화
- **설정 페이지**: 서비스, 쿠폰, 직원 관리

### 8.3 인쇄 및 내보내기 UI/UX 가이드라인
- **인쇄 버튼 위치**: 모든 통계/리스트 페이지 상단 우측에 고정 배치
- **내보내기 옵션**: 
  - 엑셀 내보내기 (Excel)
  - PDF 생성 (PDF)
  - CSV 다운로드 (CSV)
  - 차트 이미지 저장 (PNG/JPG)
- **인쇄 미리보기**: 
  - 인쇄 전 레이아웃 확인 가능
  - 페이지 설정 (A4, A3, 가로/세로)
  - 여백 및 폰트 크기 조정
- **일괄 내보내기**: 
  - 여러 기간 데이터 선택 가능
  - 필터링된 결과만 내보내기
  - 사용자 정의 컬럼 선택
- **파일명 규칙**: 
  - `{페이지명}_{날짜범위}_{생성일시}.{확장자}`
  - 예: `서비스이용현황_2024-09-01~2024-09-30_2024-09-17-143022.xlsx`
- **진행 상태 표시**: 
  - 대용량 데이터 내보내기 시 진행률 표시
  - 백그라운드 처리 완료 알림
- **에러 처리**: 
  - 내보내기 실패 시 명확한 오류 메시지
  - 재시도 옵션 제공

### 8.4 반응형 브레이크포인트
- **모바일**: 320px - 768px
- **태블릿**: 768px - 1024px
- **데스크톱**: 1024px+

## 9. 개발 일정

### 9.1 Phase 1 (3주) - MSW 기반 개발 환경 구축
- [ ] **프로젝트 설정 및 기본 구조**:
  - Next.js 프로젝트 초기 설정
  - TypeScript, Tailwind CSS 설정
  - ESLint, Prettier 설정
  - 폴더 구조 및 아키텍처 설계

- [ ] **MSW (Mock Service Worker) 설정**:
  - MSW 설치 및 설정
  - API 핸들러 구조 설계
  - 목업 데이터 생성 (listup.md 기반)
  - 브라우저/Node.js 환경 설정

- [ ] **Playwright 테스트 환경 구축**:
  - Playwright 설치 및 설정
  - 테스트 디렉토리 구조 설계
  - MSW와 Playwright 연동 설정
  - CI/CD 파이프라인 설정

- [ ] **기본 레이아웃 및 네비게이션**:
  - 반응형 레이아웃 구현
  - 상단 네비게이션 바 구현
  - 사이드바 (모바일용) 구현
  - 라우팅 설정

### 9.2 Phase 2 (4주) - MSW 기반 핵심 기능 개발
- [ ] **직원 인증 시스템 (MSW)**:
  - 로그인/로그아웃 기능
  - 권한 관리 시스템
  - 세션 관리
  - MSW 기반 인증 API 구현

- [ ] **수액 서비스 관리 (MSW)**:
  - 서비스 CRUD 기능
  - 30개 서비스 목업 데이터 생성
  - 10개 카테고리 분류 시스템
  - 가격 관리 시스템

- [ ] **환자 관리 시스템 (MSW)**:
  - 환자 등록/수정/삭제
  - 환자 검색 및 필터링
  - 환자 상세 정보 관리
  - MSW 기반 환자 API 구현

- [ ] **예약 관리 시스템 (MSW)**:
  - 예약 생성/수정/취소
  - 캘린더 뷰 구현
  - 예약 상태 관리
  - MSW 기반 예약 API 구현

- [ ] **Playwright E2E 테스트 작성**:
  - 로그인/로그아웃 테스트
  - 서비스 관리 테스트
  - 환자 관리 테스트
  - 예약 관리 테스트

### 9.3 Phase 3 (3주) - 고급 기능 및 분석 (MSW)
- [ ] **실시간 가격 계산 시스템**:
  - 서비스 + 추가옵션 + 할인 계산
  - 패키지 할인 적용
  - 쿠폰 할인 시스템
  - 실시간 가격 업데이트

- [ ] **일별 이용 현황 관리**:
  - 38개 서비스별 일일 입력
  - 자동 집계 시스템
  - 주차별/월별 통계
  - MSW 기반 이용 현황 API

- [ ] **매출 관리 시스템**:
  - 일별/월별/연간 매출 입력
  - 자동 계산 및 집계
  - 매출 트렌드 분석
  - MSW 기반 매출 API

- [ ] **쿠폰 관리 시스템**:
  - VIP 쿠폰 관리
  - 생일자 쿠폰 관리
  - 쿠폰 사용 추적
  - MSW 기반 쿠폰 API

- [ ] **Playwright 고급 테스트**:
  - 가격 계산 테스트
  - 이용 현황 입력 테스트
  - 매출 관리 테스트
  - 쿠폰 시스템 테스트

### 9.4 Phase 4 (2주) - Supabase 마이그레이션 준비
- [ ] **Supabase 스키마 설계**:
  - MSW 데이터 구조를 Supabase 스키마로 변환
  - 데이터베이스 테이블 생성
  - 관계 설정 및 인덱스 생성
  - RLS (Row Level Security) 정책 설정

- [ ] **데이터 마이그레이션 준비**:
  - MSW 목업 데이터를 Supabase 형식으로 변환
  - 마이그레이션 스크립트 작성
  - 데이터 무결성 검증
  - 롤백 계획 수립

- [ ] **API 엔드포인트 교체 준비**:
  - MSW 핸들러를 Supabase API로 교체
  - 환경 변수 설정
  - API 클라이언트 수정
  - 에러 처리 개선

### 9.5 Phase 5 (2주) - Supabase 연동 및 최종 테스트
- [ ] **Supabase 연동**:
  - Supabase 클라이언트 설정
  - 인증 시스템 Supabase 연동
  - 모든 API 엔드포인트 Supabase로 교체
  - 실시간 구독 기능 구현

- [ ] **최종 Playwright 테스트**:
  - Supabase 환경에서 E2E 테스트 실행
  - 성능 테스트
  - 접근성 테스트
  - 크로스 브라우저 테스트

- [ ] **성능 최적화**:
  - 코드 스플리팅
  - 이미지 최적화
  - 캐싱 전략 구현
  - 번들 크기 최적화

### 9.6 Phase 6 (1주) - 배포 및 모니터링
- [ ] **배포 준비**:
  - Vercel 배포 설정
  - 환경 변수 설정
  - 도메인 설정
  - SSL 인증서 설정

- [ ] **모니터링 설정**:
  - Vercel Analytics 설정
  - Supabase 모니터링 설정
  - 에러 추적 설정
  - 성능 모니터링 설정

- [ ] **사용자 교육 및 문서화**:
  - 사용자 매뉴얼 작성
  - 관리자 가이드 작성
  - API 문서 작성
  - 직원 교육 자료 준비

## 10. 배포 및 운영

### 10.1 배포 환경
- **프론트엔드**: Vercel
- **데이터베이스**: Supabase Cloud
- **도메인**: seroum-center.vercel.app (예시)
- **SSL**: 자동 HTTPS 인증서

### 10.2 모니터링
- **에러 추적**: Vercel Analytics
- **성능 모니터링**: Web Vitals
- **사용자 분석**: Google Analytics
- **데이터베이스**: Supabase Dashboard

### 10.3 백업 및 복구
- **데이터베이스**: 일일 자동 백업
- **파일 저장소**: Supabase Storage 백업
- **복구 계획**: 24시간 이내 복구 가능

## 11. 위험 요소 및 대응 방안

### 11.1 기술적 위험
- **Supabase 제한사항**: 대안 솔루션 검토 (PlanetScale, Neon)
- **성능 이슈**: 코드 스플리팅, 이미지 최적화, 캐싱 전략
- **데이터 손실**: 정기 백업, 트랜잭션 처리

### 11.2 비즈니스 위험
- **사용자 적응**: 충분한 교육 및 지원 제공
- **데이터 마이그레이션**: 기존 스프레드시트 데이터 이관 계획
- **기능 변경 요청**: 유연한 아키텍처 설계

### 11.3 일정 위험
- **기능 추가 요청**: 우선순위 재조정
- **버그 발생**: 충분한 테스트 시간 확보
- **직원 교육**: 병렬 진행으로 일정 단축

## 12. 성공 지표

### 12.1 기술적 지표
- **페이지 로딩 속도**: 2초 이내
- **데이터 입력 속도**: 50% 향상
- **에러율**: 1% 이하
- **가용성**: 99.9% 이상

### 12.2 비즈니스 지표
- **데이터 입력 시간**: 80% 단축
- **보고서 생성 시간**: 90% 단축
- **직원 만족도**: 4.5/5.0 이상
- **데이터 정확성**: 99% 이상

### 12.3 사용성 지표
- **학습 시간**: 2시간 이내
- **일일 사용률**: 90% 이상
- **모바일 사용률**: 60% 이상
- **사용자 만족도**: 4.0/5.0 이상

## 13. 유지보수 및 확장 계획

### 13.1 정기 유지보수
- **주간**: 성능 모니터링 및 버그 수정
- **월간**: 데이터 백업 확인 및 보안 업데이트
- **분기**: 기능 개선 및 사용자 피드백 반영

### 13.2 확장 계획
- **1년 후**: 모바일 앱 개발
- **2년 후**: AI 기반 예측 분석 기능
- **3년 후**: 다중 지점 관리 시스템

---

**문서 작성일**: 2024년 12월
**최종 수정일**: 2024년 12월
**작성자**: 개발팀
**승인자**: [승인자명]
**프로젝트 매니저**: [PM명]


## 🔄 수정사항 요약 2번

### 1. **대시보드 개선** (달력 기반 예약 관리)
- **달력 폼 적용**: 월별 달력에서 예약자 정보 확인 및 관리
- **예약자 관리**: 고객명, 연락처, 예약 시간, 서비스 종류 등록
- **오늘자 시간별 리스트**: 당일 예약자들의 시간대별 스케줄 표시
- **예약 상태 관리**: 예약, 완료, 취소, 노쇼 상태 관리

### 2. **관리자 페이지 추가**
- **주사 리스트 관리**: 새로운 주사/서비스 추가, 수정, 삭제
- **금액 조정**: 각 주사/서비스의 가격 설정 및 조정
- **아이디 관리**: 직원 계정 생성, 수정, 삭제 및 권한 관리

### 3. **주사/서비스 리스트 확장**
첨부파일 참조하여 다음 주사들을 추가:
- 파워비타민, 피로회복, 프리미엄회복, 필수면역, 프리미엄면역
- VIP혈관청소, 감기야가라, 숙취야가라, 쾌속면역, 오메가3
- 뇌건강다시, 프리미엄뇌건강주사, 장건강회복(수액), 장건강회복(내시경)
- 종검병동, 장기능(free), 프리미엄장건강회복
- 백옥, 백옥더블, VIP백옥, 태반, 태반더블, 태반트리플
- 가슴샘, 가슴샘더블, 가슴샘쿼드러플
- 단백에센셜, 단백파워업, 멀티미네랄, 프리미엄멀티미네랄
- 킬레이션, 프리미엄킬레이션, 강력주사, 감초주사
- 에너지풀파워, 에너지파워

### 4. **주차별 매출 관리**
- **주차별 매출 표시**: 첨부파일 참조하여 주차별 매출 금액 자동 계산
- **매출 관리 통합**: 기존 매출 관리 페이지와 통합

### 5. **방문 유형 관리**
첨부파일 참조하여 다음 방문 유형 추가:
- 직원소개, 원내광고, 이벤트메세지, 내시경실, 진료, 지인소개

### 6. **년간 매출 및 그래프**
- **년간 매출 표시**: 연간 매출 현황 및 분석
- **그래프 기능**: 월별/연간 매출 그래프 표시

### 7. **쿠폰 관리 개선**
- **월별 쿠폰 사용자 관리**: 무료쿠폰 사용자와 생일쿠폰 사용자 등록
- **쿠폰 사용 내역**: 상세한 쿠폰 사용 내역 추적

### 8. **수액 관리 메뉴**
- **일자별 수액 관리**: 수액별 갯수로 일자별 이용 현황 표시
- **수액별 통계**: 각 수액의 이용 현황 및 통계

## 🛠️ 구현 방법

이러한 수정사항들을 구현하려면 다음 파일들을 수정해야 합니다:




각 페이지에 대해 구체적인 코드를 작성해드릴까요?

---

## 🔄 수정사항 요약 3번 (listup.md 기반 수액 서비스 관리 시스템)

### 1. **수액 서비스 관리 시스템 구축** (listup.md 기반)
- **30개 서비스 전체 관리**: listup.md의 모든 수액 서비스를 시스템에 통합
- **10개 카테고리 분류**: 피로회복&면역력, 감기&숙취, 뇌건강&인지능력, 장건강&소화기, 미용&항노화, 혈관&순환, 태반&호르몬, 항암&면역치료, 영양보충&에너지, 특수주사&해독
- **가격대별 분류**: 저가(3-5만원), 중가(6-8만원), 고가(9-13만원), 프리미엄(20만원)

### 2. **관리자 페이지 - 수액 서비스 CRUD 관리**
- **서비스 등록**: 서비스명, 카테고리, 시간, 기본가격, 효과설명, 패키지 가격 설정
- **서비스 수정**: 기존 서비스 정보 수정, 실시간 가격 업데이트, 활성화/비활성화 관리
- **서비스 삭제**: 사용 중인 서비스는 비활성화 처리, 삭제 전 사용 현황 확인
- **서비스 목록 관리**: 카테고리별 필터링, 검색 기능, 가격대별 정렬, 상세 정보 모달

### 3. **사용자 페이지 - 수액 서비스 선택 및 예약**
- **서비스 선택 인터페이스**: 카테고리별 탭, 서비스 카드 형태 표시, 실시간 가격 표시
- **빠른 예약 처리**: 원클릭 서비스 선택, 패키지 코스 자동 계산, 환자 정보 연동
- **가격 계산 시스템**: 기본가격 + 추가옵션 + 패키지할인 + 쿠폰할인 = 최종금액

### 4. **추가 구성 옵션 관리**
- **4가지 추가 옵션**: 백옥(3만원), 백옥더블(5만원), 가슴샘(7만원), 강력주사(5만원)
- **서비스별 옵션 연결**: 각 서비스에 사용 가능한 추가 옵션 설정
- **가격 자동 계산**: 추가 옵션 선택 시 실시간 가격 업데이트

### 5. **패키지 코스 관리 시스템**
- **4회 코스**: 10% 할인 자동 적용
- **8회 코스**: 20% 할인 자동 적용
- **패키지 진행 관리**: 패키지 내 진행 횟수 추적
- **할인 정책 관리**: 킬레이션 시리즈 25% 할인 등 특별 할인 정책

### 6. **실시간 가격 계산 엔진**
- **다단계 계산**: 기본가격 → 추가옵션 → 패키지할인 → 쿠폰할인 → 최종금액
- **계산 로그 저장**: 모든 가격 계산 과정을 JSONB로 저장
- **가격 검증**: 계산 결과 검증 및 오류 처리
- **API 제공**: 프론트엔드에서 실시간 가격 계산 요청

### 7. **환자-예약 연동 시스템**
- **환자 정보 관리**: 이름, 연락처, 생년월일, 성별, 주소, 응급연락처
- **예약 생성**: 환자 선택 → 서비스 선택 → 가격 계산 → 예약 생성
- **예약 상태 관리**: 예약, 완료, 취소, 노쇼 상태 추적
- **예약 수정/삭제**: 예약 정보 수정 및 취소 기능

### 8. **데이터베이스 스키마 확장**
- **services 테이블 확장**: 카테고리, 시간, 가격대, 패키지 가격 등 추가 필드
- **service_addons 테이블**: 추가 구성 옵션 관리
- **reservations 테이블**: 예약 정보 및 가격 계산 결과 저장
- **price_calculations 테이블**: 가격 계산 이력 추적

### 9. **API 확장**
- **서비스 관리 API**: CRUD, 카테고리별 조회, 가격대별 필터링
- **예약 관리 API**: 예약 생성/수정/삭제, 상태 변경, 달력 데이터
- **가격 계산 API**: 실시간 가격 계산, 패키지 가격 조회, 계산 검증
- **환자 관리 API**: 환자 CRUD, 검색, 예약 이력

### 10. **사용자 경험 개선**
- **직관적 UI**: 카테고리별 탭, 서비스 카드, 실시간 가격 표시
- **빠른 업무 처리**: 원클릭 선택, 자동 계산, 환자 연동
- **오류 방지**: 입력 검증, 가격 계산 검증, 중복 예약 방지
- **반응형 디자인**: 모바일/태블릿/데스크톱 최적화

## 🛠️ 구현 우선순위

### Phase 1: 기본 시스템 구축
1. 데이터베이스 스키마 확장 (listup.md 기반)
2. 30개 서비스 초기 데이터 입력
3. 관리자 페이지 서비스 CRUD 기능
4. 기본 가격 계산 시스템

### Phase 2: 사용자 인터페이스 구현
1. 사용자 페이지 서비스 선택 인터페이스
2. 실시간 가격 계산 시스템
3. 환자 관리 시스템
4. 예약 생성 및 관리 시스템

### Phase 3: 고급 기능 및 최적화
1. 패키지 코스 관리
2. 추가 구성 옵션 관리
3. 쿠폰 할인 시스템 연동
4. 성능 최적화 및 사용자 경험 개선

이러한 수정사항들을 통해 listup.md의 30개 수액 서비스를 체계적으로 관리하고, 사용자가 빠르고 쉽게 업무를 처리할 수 있는 시스템을 구축할 수 있습니다.

---

## 🔄 수정사항 요약 4번 (엑셀 기반 데이터 디지털 전환)

### 1. **📊 일별 서비스 이용 현황 관리 (엑셀 38개 서비스 × 30일 표 대체)**
- **38개 서비스 분류**: 피로회복&면역력, 혈관&순환, 감기&숙취, 뇌건강&인지능력, 장건강&소화기, 미용&항노화, 태반&호르몬, 영양보충&에너지, 특수주사&해독, 에너지
- **일별 입력 인터페이스**: 달력 형태로 날짜 선택 → 서비스별 이용 건수 입력
- **원클릭 입력**: 자주 사용되는 서비스는 +1/-1 버튼으로 빠른 입력
- **자동 집계**: 일별/주차별(1주차~5주차)/월별 총합 자동 계산
- **데이터 검증**: 입력값 범위 체크, 중복 입력 방지, 일관성 검사

### 2. **💰 매출 관리 시스템 (엑셀 수액+내시경 월별매출 대체)**
- **일별 매출 입력**: 수액센터 매출 + 내시경 매출 = 총 매출 자동 계산
- **월별 매출 관리**: 1월~12월 월별 매출 입력 및 수정
- **연간 매출 분석**: 2024년 총 154,617,000원, 월평균 12,884,750원
- **트렌드 분석**: 월별 매출 비교 차트, 성장률 분석, 계절성 패턴
- **수익성 분석**: 서비스별 매출 기여도, 인기 서비스와 매출 상관관계

### 3. **🎫 쿠폰 관리 시스템 (엑셀 VIP쿠폰, 생일자쿠폰 표 대체)**
- **VIP 쿠폰 관리**: 발급자별 할당량 관리 (권창모 6개, 김주석 6개, 곽봉용 46개)
- **관련 인물 매핑**: 김주석 → 이정옥(526898), 박동현(133990) 등
- **생일자 쿠폰**: 50% 할인 자동 적용, 사용 이력 추적
- **쿠폰 정책**: 이월 불가, 초과 사용 시 2만원 지불, 초과 갯수 제한 없음
- **사용 통계**: 9월 VIP쿠폰 28개 사용, 생일자쿠폰 8회 사용

### 4. **🎯 방문 경로 분석 (엑셀 방문 경로 표 대체)**
- **7가지 방문 경로**: 검색, 직원소개, 현내광고, 이벤트메세지, 내시장실, 진료, 지인소개
- **일별 입력**: 각 경로별 고객 수 및 매출 기여도 입력
- **통계 분석**: 지인소개 62.5%, 현내광고 25%, 진료 12.5% 기여도
- **ROI 분석**: 방문 경로별 고객당 평균 매출, 마케팅 효과 측정

### 5. **📱 사용자 페이지 - 엑셀 업무 디지털 전환**
- **일일 업무 대시보드**: 엑셀 스프레드시트 대신 직관적인 대시보드
- **빠른 데이터 입력**: 원클릭 서비스 입력, 전날 데이터 복사 기능
- **실시간 집계**: 엑셀 수식 없이 자동 주차별/월별 집계
- **모바일 최적화**: 태블릿/스마트폰에서도 편리한 입력
- **자동 검증**: 입력 실수 방지, 데이터 일관성 검사

### 6. **🗄️ 데이터베이스 스키마 확장**
- **daily_service_usage**: 38개 서비스별 일일 이용 현황
- **daily_revenue**: 수액센터/내시경 매출 분리 관리
- **vip_coupon_issuers**: VIP 쿠폰 발급자별 할당량 관리
- **daily_visit_source_stats**: 방문 경로별 일일 통계
- **자동 계산 필드**: 총합, 잔여량, 주차/월/년 자동 분류

### 7. **⚡ 사용자 편의성 개선**
- **엑셀 대체 기능**: 복잡한 수식 → 자동 계산
- **시각화**: 수동 차트 → 자동 생성 차트
- **실시간 업데이트**: 수동 저장 → 자동 저장
- **오류 방지**: 수동 검증 → 자동 검증
- **모바일 지원**: PC 전용 → 반응형 디자인

### 8. **📈 통계 및 분석 자동화**
- **인기 서비스 순위**: VIP백옥더블 1위, 장건강회복(내시경) 2위
- **매출 트렌드**: 12월 최고 매출(18,203,000원), 3월 최저 매출(6,940,500원)
- **쿠폰 효과**: VIP쿠폰 사용률 17.7%, 생일자쿠폰 재방문율 분석
- **방문 경로 효과**: 지인소개가 가장 효과적인 유입 경로

이러한 수정사항들을 통해 기존 엑셀 기반의 복잡한 데이터 관리를 직관적이고 효율적인 디지털 시스템으로 전환할 수 있습니다.

---

## 🔄 수정사항 요약 5번 (인쇄 및 엑셀 내보내기 기능 추가)

### 1. **📊 모든 통계 및 리스트 페이지에 인쇄/내보내기 기능 추가**

#### 일별 서비스 이용 현황 관리
- **엑셀 내보내기**: 일별/주별/월별 서비스 이용 현황을 엑셀 파일로 다운로드
- **PDF 인쇄**: 서비스별 이용 통계를 PDF 형태로 인쇄 가능
- **CSV 내보내기**: 데이터 분석을 위한 CSV 파일 다운로드
- **인쇄 미리보기**: 인쇄 전 레이아웃 확인 및 페이지 설정
- **일괄 내보내기**: 여러 기간의 데이터를 한 번에 내보내기

#### 매출 관리 시스템
- **엑셀 내보내기**: 일별/월별/연간 매출 데이터를 엑셀 파일로 다운로드
- **PDF 보고서**: 매출 분석 보고서를 PDF 형태로 생성 및 인쇄
- **차트 내보내기**: 매출 트렌드 차트를 이미지 파일로 저장
- **요약 보고서**: 월별/연간 매출 요약 보고서 자동 생성
- **비교 분석**: 전년 대비, 전월 대비 매출 비교표 내보내기

#### 방문 경로 분석
- **엑셀 내보내기**: 방문 경로별 일별/월별 통계를 엑셀 파일로 다운로드
- **PDF 분석 보고서**: 유입 경로 분석 보고서를 PDF 형태로 생성
- **차트 내보내기**: 방문 경로별 기여도 차트를 이미지로 저장
- **ROI 분석표**: 마케팅 채널별 ROI 분석표 내보내기
- **트렌드 분석**: 유입 경로별 트렌드 분석 보고서 생성

#### 쿠폰 관리 시스템
- **엑셀 내보내기**: VIP쿠폰/생일자쿠폰 사용 현황을 엑셀 파일로 다운로드
- **PDF 쿠폰 보고서**: 쿠폰 사용 통계 및 효과 분석 보고서 생성
- **쿠폰 발급 명단**: 발급자별 쿠폰 할당량 및 사용 현황 명단 인쇄
- **할인 효과 분석**: 쿠폰별 할인 금액 및 매출 기여도 분석표
- **월별 쿠폰 요약**: 월별 쿠폰 발급/사용 요약 보고서 자동 생성

### 2. **🔌 API 확장 - 모든 데이터 조회 API에 내보내기 엔드포인트 추가**

#### 서비스 관리 API
- `GET /api/services/export/excel` - 서비스 목록 엑셀 내보내기
- `GET /api/services/export/pdf` - 서비스 카탈로그 PDF 생성
- `GET /api/services/statistics` - 서비스 이용 통계 조회
- `GET /api/services/statistics/export` - 서비스 통계 보고서 내보내기

#### 이용 현황 API
- `GET /api/usage/export/excel` - 이용 현황 엑셀 내보내기
- `GET /api/usage/export/pdf` - 이용 현황 보고서 PDF 생성
- `GET /api/usage/statistics` - 이용 통계 데이터 조회
- `GET /api/usage/statistics/export` - 이용 통계 보고서 내보내기

#### 매출 관리 API
- `GET /api/revenue/export/excel` - 매출 데이터 엑셀 내보내기
- `GET /api/revenue/export/pdf` - 매출 분석 보고서 PDF 생성
- `GET /api/revenue/export/charts` - 매출 차트 이미지 내보내기
- `GET /api/revenue/comparison/export` - 매출 비교 분석표 내보내기

#### 쿠폰 관리 API
- `GET /api/coupons/export/excel` - 쿠폰 사용 현황 엑셀 내보내기
- `GET /api/coupons/export/pdf` - 쿠폰 보고서 PDF 생성
- `GET /api/coupons/vip/export` - VIP 쿠폰 발급 명단 내보내기
- `GET /api/coupons/birthday/export` - 생일자 쿠폰 사용 현황 내보내기

#### 마케팅 API
- `GET /api/marketing/export/excel` - 방문 경로 통계 엑셀 내보내기
- `GET /api/marketing/export/pdf` - 마케팅 분석 보고서 PDF 생성
- `GET /api/marketing/roi/export` - ROI 분석표 내보내기
- `GET /api/marketing/trends/export` - 유입 경로 트렌드 분석 내보내기

#### 예약 관리 API
- `GET /api/reservations/export/excel` - 예약 목록 엑셀 내보내기
- `GET /api/reservations/export/pdf` - 예약 현황 보고서 PDF 생성
- `GET /api/reservations/schedule/export` - 일정표 내보내기

#### 환자 관리 API
- `GET /api/patients/export/excel` - 환자 목록 엑셀 내보내기
- `GET /api/patients/export/pdf` - 환자 명단 PDF 생성
- `GET /api/patients/statistics` - 환자 통계 데이터 조회
- `GET /api/patients/statistics/export` - 환자 통계 보고서 내보내기

### 3. **🎨 UI/UX 가이드라인 - 인쇄 및 내보내기 기능 설계 원칙**

#### 인쇄 버튼 배치
- **위치**: 모든 통계/리스트 페이지 상단 우측에 고정 배치
- **디자인**: 일관된 아이콘과 텍스트로 통일성 유지
- **접근성**: 키보드 단축키 지원 (Ctrl+P)

#### 내보내기 옵션
- **엑셀 내보내기 (Excel)**: 원본 데이터 그대로 내보내기
- **PDF 생성 (PDF)**: 인쇄 최적화된 레이아웃으로 생성
- **CSV 다운로드 (CSV)**: 데이터 분석용 원시 데이터
- **차트 이미지 저장 (PNG/JPG)**: 시각화 자료 저장

#### 인쇄 미리보기 기능
- **레이아웃 확인**: 인쇄 전 실제 출력 모습 미리보기
- **페이지 설정**: A4, A3, 가로/세로 방향 선택
- **여백 조정**: 사용자 정의 여백 설정
- **폰트 크기**: 인쇄용 폰트 크기 조정

#### 일괄 내보내기 기능
- **기간 선택**: 여러 날짜 범위 선택 가능
- **필터 적용**: 검색/필터링된 결과만 내보내기
- **컬럼 선택**: 사용자가 원하는 컬럼만 선택하여 내보내기
- **포맷 선택**: 엑셀/PDF/CSV 중 선택

#### 파일명 규칙
- **형식**: `{페이지명}_{날짜범위}_{생성일시}.{확장자}`
- **예시**: `서비스이용현황_2024-09-01~2024-09-30_2024-09-17-143022.xlsx`
- **한글 지원**: 파일명에 한글 사용 가능
- **특수문자 제거**: 파일명에 사용할 수 없는 문자 자동 제거

#### 사용자 경험 개선
- **진행 상태 표시**: 대용량 데이터 내보내기 시 진행률 표시
- **백그라운드 처리**: 완료 시 알림 표시
- **에러 처리**: 실패 시 명확한 오류 메시지와 재시도 옵션
- **다운로드 관리**: 다운로드 히스토리 및 재다운로드 기능

### 4. **📋 적용 대상 페이지 목록**

#### 필수 적용 페이지
1. **일별 서비스 이용 현황** - 38개 서비스 × 30일 데이터
2. **매출 관리** - 일별/월별/연간 매출 데이터
3. **방문 경로 분석** - 7가지 유입 경로 통계
4. **쿠폰 관리** - VIP쿠폰, 생일자쿠폰 사용 현황
5. **환자 관리** - 환자 목록 및 통계
6. **예약 관리** - 예약 현황 및 일정표
7. **서비스 관리** - 수액 서비스 목록 및 통계

#### 선택 적용 페이지
1. **대시보드** - 주요 지표 요약
2. **직원 관리** - 직원 목록 및 실적
3. **설정 페이지** - 시스템 설정 정보

### 5. **⚡ 기술적 구현 방안**

#### 프론트엔드
- **React 컴포넌트**: 재사용 가능한 내보내기 버튼 컴포넌트
- **상태 관리**: 내보내기 진행 상태 및 에러 처리
- **파일 다운로드**: Blob API를 활용한 파일 다운로드
- **인쇄 기능**: window.print() API 활용

#### 백엔드
- **엑셀 생성**: xlsx 라이브러리 활용
- **PDF 생성**: puppeteer 또는 jsPDF 활용
- **CSV 생성**: 직접 CSV 포맷 생성
- **이미지 생성**: Chart.js to Image 기능 활용

#### 성능 최적화
- **대용량 데이터**: 페이지네이션 및 청크 단위 처리
- **캐싱**: 자주 요청되는 데이터 캐싱
- **비동기 처리**: 백그라운드에서 내보내기 작업 처리
- **압축**: 대용량 파일 압축 전송

이러한 수정사항들을 통해 사용자가 모든 통계 및 리스트 데이터를 쉽게 인쇄하고 엑셀 파일로 내보낼 수 있는 완전한 시스템을 구축할 수 있습니다.

---

## 🔄 수정사항 요약 6번 (사용자 경험 혁신 및 미래 기술 통합)

### 1. **🔔 실시간 알림 및 알림센터 시스템**

#### 실시간 알림 기능
- **데이터 업데이트 알림**: 입력 후 자동 업데이트 알림
- **예약 관리 알림**: 예약 완료/취소 실시간 알림
- **쿠폰 시스템 알림**: 쿠폰 사용 및 발급 알림
- **목표 관리 알림**: 매출 목표 달성/미달성 알림
- **시스템 모니터링**: 오류 및 경고 알림
- **브라우저 푸시**: 웹 브라우저 푸시 알림 지원

#### 알림센터 기능
- **통합 관리**: 모든 알림을 한 곳에서 관리
- **상태 관리**: 읽음/안읽음 상태 추적
- **카테고리 분류**: 알림 유형별 자동 분류
- **개인화 설정**: 사용자별 알림 설정
- **히스토리 보관**: 알림 이력 장기 보관

### 2. **🔍 고급 검색 및 필터링 시스템**

#### 다중 조건 검색
- **조합 검색**: 날짜 + 서비스 + 환자 + 금액 범위
- **논리 연산**: AND/OR 조건 설정
- **실시간 미리보기**: 검색 결과 즉시 표시
- **저장 기능**: 검색 조건 저장 및 즐겨찾기

#### 스마트 검색
- **자동완성**: 환자명, 서비스명, 전화번호
- **검색 히스토리**: 최근 검색어 관리
- **음성 검색**: 모바일 환경 음성 입력
- **오타 수정**: 자동 오타 수정 제안
- **유사 검색**: 비슷한 결과 제공

### 3. **📊 실시간 대시보드 위젯**

#### 개인화된 대시보드
- **드래그 앤 드롭**: 위젯 자유 배치
- **크기 조정**: 1x1, 2x1, 2x2 크기 선택
- **실시간 업데이트**: 자동 새로고침
- **개인 설정**: 사용자별 대시보드 저장
- **새로고침 주기**: 위젯별 업데이트 간격 설정

#### 위젯 종류
- **실시간 매출**: 현재 매출 현황
- **예약 현황**: 오늘의 예약 상황
- **인기 서비스**: 서비스별 순위
- **쿠폰 현황**: 쿠폰 사용 통계
- **직원 실적**: 개인별 성과
- **시스템 상태**: 서버 및 성능 모니터

### 4. **📅 캘린더 통합 관리**

#### 통합 일정 관리
- **통합 뷰**: 예약 + 근무 + 휴무 통합
- **다양한 뷰**: 월간/주간/일간 전환
- **색상 코딩**: 서비스/상태/직원별 구분
- **충돌 방지**: 일정 중복 자동 감지
- **반복 일정**: 정기 예약 자동 설정

#### 고급 캘린더 기능
- **드래그 앤 드롭**: 일정 자유 이동
- **더블클릭 수정**: 빠른 일정 편집
- **휴무일 표시**: 공휴일 자동 표시
- **개인 캘린더**: 직원별 개별 캘린더
- **공유 기능**: 캘린더 공유 및 권한 설정

### 5. **💾 데이터 백업 및 복구**

#### 자동 백업 시스템
- **주기적 백업**: 일일/주간/월간 자동 백업
- **증분 백업**: 변경된 데이터만 백업
- **클라우드 지원**: 클라우드 스토리지 연동
- **암호화**: 백업 파일 보안 강화
- **완료 알림**: 백업 완료 자동 알림

#### 데이터 복구
- **시점 복구**: 특정 시점으로 복구
- **파일 다운로드**: 백업 파일 다운로드
- **히스토리 관리**: 백업 이력 추적
- **미리보기**: 복구 전 데이터 확인
- **작업 로그**: 복구 과정 기록

### 6. **🔐 세분화된 권한 관리**

#### 권한 그룹 관리
- **역할별 권한**: 관리자/매니저/직원/견습생
- **페이지별 접근**: 화면별 권한 설정
- **기능별 권한**: 읽기/쓰기/삭제 구분
- **데이터 범위**: 전체/개인 담당 구분
- **변경 이력**: 권한 변경 추적

#### 고급 보안 기능
- **2단계 인증**: 2FA 보안 강화
- **세션 관리**: 자동 타임아웃
- **IP 제한**: 접근 IP 화이트리스트
- **비밀번호 정책**: 강화된 비밀번호 규칙
- **로그인 제한**: 시도 횟수 제한

### 7. **📱 모바일 앱 (PWA)**

#### 오프라인 기능
- **오프라인 입력**: 인터넷 없이 데이터 입력
- **자동 동기화**: 연결 시 자동 업로드
- **오프라인 표시**: 네트워크 상태 표시
- **네트워크 감지**: 연결 상태 자동 감지

#### 모바일 전용 기능
- **푸시 알림**: 모바일 푸시 알림
- **생체 인증**: 지문/얼굴 인식
- **카메라 스캔**: 환자 정보 QR 스캔
- **GPS 체크**: 출근/퇴근 자동 체크
- **음성 메모**: 음성으로 메모 입력

### 8. **🤖 자동화 및 스마트 기능**

#### 자동 알림 시스템
- **예약 리마인더**: SMS/이메일 자동 발송
- **생일 쿠폰**: 자동 쿠폰 발급
- **목표 알림**: 달성/미달성 자동 알림
- **보고서 생성**: 정기 보고서 자동 생성
- **이상 감지**: 패턴 이상 자동 감지

#### 스마트 추천
- **맞춤 서비스**: 환자별 서비스 추천
- **최적 시간**: 예약 시간 제안
- **쿠폰 최적화**: 쿠폰 사용 전략
- **매출 증대**: 수익 증대 방안

### 9. **🧠 AI 기반 고급 분석**

#### 예측 분석
- **수요 예측**: AI 기반 수요 예측
- **트렌드 분석**: 계절성 및 패턴 분석
- **LTV 분석**: 고객 생애 가치 분석
- **서비스 추천**: 맞춤형 서비스 제안
- **수익 최적화**: 수익성 개선 방안

#### 패턴 분석
- **고객 행동**: 고객 행동 패턴 분석
- **서비스 패턴**: 이용 패턴 분석
- **매출 패턴**: 매출 트렌드 분석
- **이상 감지**: 비정상 거래 탐지
- **리스크 예측**: 위험 요소 예측

### 10. **🔗 외부 시스템 연동**

#### 결제 시스템
- **카드 결제**: 카드 결제 시스템 연동
- **간편결제**: 카카오페이, 네이버페이
- **현금영수증**: 자동 발행
- **결제 기록**: 자동 결제 내역 저장

#### 통신 시스템
- **SMS 발송**: SMS 자동 발송
- **이메일 발송**: 이메일 자동 발송
- **카카오톡**: 알림톡 연동
- **전화 발신**: 자동 전화 발신

#### 외부 서비스
- **회계 시스템**: 회계 소프트웨어 연동
- **의료진 관리**: 의료진 시스템 연동
- **CRM 연동**: 고객 관리 시스템 연동
- **클라우드**: 클라우드 스토리지 연동

### 11. **📋 작업 흐름 관리**

#### 워크플로우 설계
- **전체 프로세스**: 예약→접수→치료→결제→후속관리
- **체크리스트**: 단계별 체크 항목
- **완료율 추적**: 작업 진행률 모니터링
- **병목 식별**: 병목 구간 자동 식별
- **개선 제안**: 프로세스 개선 방안

#### 작업 관리
- **할 일 목록**: 개인별 할 일 관리
- **우선순위**: 작업 중요도 설정
- **배정/위임**: 작업 배정 및 위임
- **완료 알림**: 작업 완료 자동 알림
- **성과 분석**: 작업 성과 분석

### 12. **💬 고객 소통 관리**

#### 고객 기록 관리
- **메모 시스템**: 고객별 특이사항 기록
- **상담 이력**: 상담 내용 관리
- **만족도 조사**: 고객 만족도 측정
- **불만 처리**: 불만 사항 추적
- **피드백 분석**: 고객 피드백 분석

#### 소통 도구
- **내부 메모**: 직원 간 메모 시스템
- **대화 히스토리**: 고객별 대화 기록
- **알림/리마인더**: 소통 알림 시스템
- **고객 그룹**: 고객 그룹 관리
- **템플릿**: 소통 템플릿 관리

### 13. **📈 실시간 모니터링**

#### 현황 모니터링
- **대기 현황**: 현재 대기 환자 수
- **매출 현황**: 실시간 매출 모니터링
- **직원 현황**: 직원별 작업 상황
- **시스템 성능**: 서버 성능 모니터링
- **이상 감지**: 비정상 상황 자동 감지

#### 모니터링 대시보드
- **실시간 표시**: 현재 상태 실시간 표시
- **경고 알림**: 위험 상황 알림
- **성능 지표**: 시스템 성능 시각화
- **트렌드 모니터링**: 트렌드 변화 추적
- **자동 보고서**: 모니터링 보고서 자동 생성

### 14. **🎯 목표 관리 및 KPI 추적**

#### 목표 설정
- **매출 목표**: 월별/연간 매출 목표
- **직원 목표**: 개인별 실적 목표
- **서비스 목표**: 서비스별 목표 설정
- **개인 목표**: 개인별 목표 관리
- **달성률 추적**: 목표 달성률 모니터링

#### KPI 대시보드
- **실적 시각화**: 목표 대비 실적 차트
- **달성률 게이지**: 목표 달성률 게이지
- **미달성 알림**: 목표 미달성 시 알림
- **성과 보고서**: 성과 분석 보고서
- **개선 제안**: 개선 방안 자동 제안

### 15. **⚙️ 시스템 설정 및 커스터마이징**

#### 시스템 설정
- **테마 커스터마이징**: 색상 및 디자인 변경
- **다국어 지원**: 한국어/영어 지원
- **시간대 설정**: 지역별 시간대 설정
- **통화 설정**: 통화 단위 설정
- **사용자 정의 필드**: 커스텀 필드 추가

#### 개인화 설정
- **화면 레이아웃**: 개인별 화면 구성
- **즐겨찾기**: 자주 사용하는 메뉴 설정
- **알림 개인화**: 개인별 알림 설정
- **단축키**: 키보드 단축키 커스터마이징
- **테마/폰트**: 개인별 디자인 설정

### 16. **🚀 혁신 기능 및 미래 기술**

#### 디지털 전환 고도화
- **스마트 태블릿**: 대형 터치스크린 인터페이스
- **AR/VR 통합**: 증강현실/가상현실 기능
- **3D 시각화**: 서비스 3D 시각화
- **몰입형 교육**: VR 기반 교육 시스템

#### 고급 AI 기능
- **자연어 처리**: 음성 입력 및 자연어 검색
- **머신러닝**: 예약 패턴 학습 및 최적화
- **감정 분석**: 고객 만족도 감정 분석
- **자동 최적화**: 가격 및 스케줄 자동 조정

#### 워크플로우 자동화
- **RPA**: 로봇 프로세스 자동화
- **스마트 워크플로우**: 조건부 자동 실행
- **예외 처리**: 예외 상황 자동 처리
- **성능 분석**: 워크플로우 성능 분석

#### 고급 분석 도구
- **비즈니스 인텔리전스**: OLAP 큐브 분석
- **예측 모델링**: 시계열 예측 및 회귀 분석
- **다차원 분석**: 드릴다운/드릴업 기능
- **임시 분석**: 사용자 정의 분석 도구

#### 클라우드 및 하이브리드
- **멀티 클라우드**: AWS/Azure/GCP 지원
- **엣지 컴퓨팅**: 로컬 데이터 처리
- **재해 복구**: 자동 백업 및 복구
- **비용 최적화**: 클라우드 비용 최적화

#### 고급 보안
- **제로 트러스트**: 모든 접근 검증
- **데이터 거버넌스**: 데이터 분류 및 라벨링
- **개인정보 보호**: GDPR 등 규정 준수
- **위협 탐지**: 실시간 위협 탐지

#### 고객 경험 혁신
- **고객 포털**: 고객 전용 웹사이트
- **스마트 대기**: 실시간 대기 시간 안내
- **자체 서비스**: 예약 및 결제 자체 서비스
- **개인 건강 기록**: 고객별 건강 기록 관리

#### 차세대 모바일
- **웨어러블 연동**: 스마트워치 알림
- **IoT 통합**: 스마트 장비 연동
- **생체 데이터**: 건강 데이터 수집
- **원격 모니터링**: 원격 시스템 모니터링

#### 글로벌화
- **다국어 지원**: 10개 언어 지원
- **국제 표준**: HL7 FHIR, ISO 27001
- **현지화**: 문화별 맞춤화
- **컴플라이언스**: GDPR, SOC 2 준수

#### 미래 기술 준비
- **블록체인**: 의료 기록 무결성
- **양자 컴퓨팅**: 복잡한 최적화 문제 해결
- **스마트 계약**: 자동 계약 실행
- **분산 신원**: 분산 신원 관리

이러한 혁신적인 기능들을 통해 사용자 경험을 극대화하고 미래 기술 변화에 대응할 수 있는 차세대 수액센터 관리 시스템을 구축할 수 있습니다.

---

## 🔄 수정사항 요약 7번 (MSW + Playwright + Supabase 개발 전략)

### 1. **🧪 MSW (Mock Service Worker) 통합 전략**

#### 목업 API 서버 구축
- **네트워크 레벨 인터셉션**: HTTP 요청을 가로채서 목업 데이터 반환
- **브라우저/Node.js 통합**: 개발과 테스트 환경에서 동일한 목업 데이터 사용
- **실제 API 인터페이스**: Supabase API와 동일한 엔드포인트 구조
- **환경별 데이터**: 개발/테스트/프로덕션별 다른 목업 데이터 설정

#### 목업 데이터 관리
- **디렉토리 구조**: `src/mocks/` 하위에 API 핸들러 정의
- **데이터 일관성**: Supabase 스키마와 동일한 데이터 구조 사용
- **동적 데이터**: 요청에 따른 동적 응답 생성
- **에러 시나리오**: 네트워크 오류, 서버 오류 등 다양한 상황 시뮬레이션

#### API 핸들러 예시
```typescript
// src/mocks/handlers/services.ts
export const servicesHandlers = [
  rest.get('/api/services', (req, res, ctx) => {
    return res(ctx.json(mockServicesData))
  }),
  rest.post('/api/services', (req, res, ctx) => {
    return res(ctx.json({ id: 'new-service-id', ...req.body }))
  })
]
```

### 2. **🎭 Playwright 통합 테스트 전략**

#### E2E 테스트 자동화
- **사용자 시나리오 기반**: 실제 사용자 행동을 시뮬레이션
- **실제 브라우저 테스트**: Chrome, Firefox, Safari, Edge 지원
- **MSW 연동**: 안정적인 테스트 환경 구축
- **병렬 테스트**: 여러 브라우저에서 동시 테스트 실행

#### 테스트 시나리오 커버리지
- **인증 플로우**: 로그인/로그아웃, 권한 관리
- **서비스 관리**: CRUD 작업, 가격 계산, 카테고리 관리
- **환자 관리**: 등록/수정/삭제, 검색/필터링
- **예약 관리**: 생성/수정/취소, 캘린더 뷰
- **매출 관리**: 데이터 입력, 통계 분석, 보고서 생성
- **쿠폰 관리**: 발급/사용, 할인 적용

#### 테스트 환경 설정
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    // MSW와 연동된 테스트 환경
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ]
})
```

### 3. **🗄️ Supabase 연동 전략**

#### 단계적 마이그레이션 계획
1. **Phase 1**: MSW로 완전한 기능 개발 및 테스트
2. **Phase 2**: Playwright로 E2E 테스트 완료
3. **Phase 3**: Supabase 스키마 생성 및 데이터 마이그레이션
4. **Phase 4**: MSW에서 Supabase로 API 엔드포인트 교체

#### 환경별 설정 관리
```typescript
// src/lib/api-client.ts
const isDevelopment = process.env.NODE_ENV === 'development'
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export const apiClient = {
  baseURL: useMockData ? '/api/mock' : '/api/supabase',
  // MSW 또는 Supabase API 선택
}
```

#### 데이터 마이그레이션
- **스키마 변환**: MSW 데이터 구조를 Supabase 스키마로 변환
- **데이터 무결성**: 마이그레이션 전후 데이터 검증
- **롤백 계획**: 문제 발생 시 이전 상태로 복구
- **성능 벤치마크**: MSW vs Supabase 성능 비교

### 4. **🔄 개발 워크플로우 최적화**

#### 개발 단계 (MSW 기반)
1. **API 목업 설정**: MSW 핸들러로 API 엔드포인트 정의
2. **프론트엔드 개발**: 실제 API와 동일한 인터페이스로 개발
3. **E2E 테스트 작성**: Playwright로 사용자 시나리오 테스트
4. **테스트 통과 확인**: 모든 테스트가 통과할 때까지 반복

#### 테스트 단계 (MSW + Playwright)
1. **MSW 환경 테스트**: 목업 데이터로 E2E 테스트 실행
2. **다양한 브라우저**: Chrome, Firefox, Safari, Edge 테스트
3. **모바일 테스트**: 반응형 디자인 및 터치 인터페이스 테스트
4. **성능 테스트**: Lighthouse 점수 90점 이상 목표
5. **접근성 테스트**: WCAG 2.1 AA 준수 확인

#### 배포 단계 (Supabase 연동)
1. **Supabase 스키마 생성**: 데이터베이스 테이블 및 관계 설정
2. **데이터 마이그레이션**: 목업 데이터를 Supabase로 이전
3. **API 교체**: MSW 핸들러를 Supabase API로 교체
4. **최종 테스트**: 프로덕션 환경에서 최종 검증

### 5. **📊 테스트 커버리지 및 품질 관리**

#### 코드 커버리지 목표
- **전체 커버리지**: 90% 이상
- **핵심 기능**: 100% 커버리지
- **유틸리티 함수**: 95% 이상
- **컴포넌트**: 85% 이상

#### E2E 테스트 커버리지
- **주요 사용자 시나리오**: 100% 커버리지
- **에러 시나리오**: 80% 이상
- **엣지 케이스**: 70% 이상
- **성능 시나리오**: 100% 커버리지

#### 품질 지표
- **성능 테스트**: Lighthouse 점수 90점 이상
- **접근성 테스트**: WCAG 2.1 AA 준수
- **보안 테스트**: OWASP Top 10 대응
- **사용성 테스트**: 사용자 만족도 90% 이상

### 6. **🛠️ 개발 도구 및 설정**

#### MSW 설정
```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

#### Playwright 설정
```typescript
// tests/setup.ts
import { test as base } from '@playwright/test'
import { setupMockServer } from './utils/mock-server'

export const test = base.extend({
  page: async ({ page }, use) => {
    await setupMockServer(page)
    await use(page)
  }
})
```

#### 환경 변수 관리
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 7. **📈 성능 및 모니터링**

#### MSW 성능 최적화
- **응답 시간**: 목업 API 응답 시간 < 100ms
- **메모리 사용량**: 핸들러 등록/해제 자동화
- **데이터 크기**: 목업 데이터 압축 및 최적화
- **캐싱 전략**: 자주 사용되는 데이터 캐싱

#### Playwright 성능 최적화
- **테스트 실행 시간**: 전체 테스트 < 10분
- **병렬 실행**: 여러 브라우저 동시 테스트
- **재실행 전략**: 실패한 테스트 자동 재실행
- **리소스 관리**: 테스트 간 리소스 정리

#### Supabase 마이그레이션 모니터링
- **데이터 무결성**: 마이그레이션 전후 검증
- **성능 비교**: MSW vs Supabase 벤치마크
- **에러 추적**: 마이그레이션 과정 에러 모니터링
- **롤백 준비**: 문제 발생 시 즉시 롤백 가능

### 8. **🚀 개발 일정 최적화**

#### Phase 1 (3주) - MSW 기반 개발 환경 구축
- Next.js 프로젝트 설정
- MSW 설치 및 설정
- Playwright 테스트 환경 구축
- 기본 레이아웃 및 네비게이션

#### Phase 2 (4주) - MSW 기반 핵심 기능 개발
- 직원 인증 시스템 (MSW)
- 수액 서비스 관리 (MSW)
- 환자 관리 시스템 (MSW)
- 예약 관리 시스템 (MSW)
- Playwright E2E 테스트 작성

#### Phase 3 (3주) - 고급 기능 및 분석 (MSW)
- 실시간 가격 계산 시스템
- 일별 이용 현황 관리
- 매출 관리 시스템
- 쿠폰 관리 시스템
- Playwright 고급 테스트

#### Phase 4 (2주) - Supabase 마이그레이션 준비
- Supabase 스키마 설계
- 데이터 마이그레이션 준비
- API 엔드포인트 교체 준비

#### Phase 5 (2주) - Supabase 연동 및 최종 테스트
- Supabase 연동
- 최종 Playwright 테스트
- 성능 최적화

#### Phase 6 (1주) - 배포 및 모니터링
- 배포 준비
- 모니터링 설정
- 사용자 교육 및 문서화

### 9. **💡 개발 전략의 장점**

#### MSW 활용의 장점
- **빠른 개발**: 백엔드 없이 프론트엔드 개발 가능
- **안정적인 테스트**: 네트워크 의존성 없는 테스트
- **실제 API 시뮬레이션**: Supabase API와 동일한 인터페이스
- **에러 시나리오 테스트**: 다양한 오류 상황 시뮬레이션

#### Playwright 활용의 장점
- **실제 브라우저 테스트**: 사용자와 동일한 환경에서 테스트
- **크로스 브라우저**: 여러 브라우저에서 일관된 테스트
- **자동화**: CI/CD 파이프라인에서 자동 테스트 실행
- **디버깅**: 테스트 실패 시 스크린샷 및 비디오 제공

#### Supabase 연동의 장점
- **실시간 기능**: 실시간 데이터 동기화
- **확장성**: 클라우드 기반 확장 가능한 데이터베이스
- **보안**: RLS를 통한 데이터 보안
- **관리 편의성**: 웹 대시보드를 통한 쉬운 관리

이러한 MSW + Playwright + Supabase 전략을 통해 안정적이고 확장 가능한 수액센터 관리 시스템을 구축할 수 있습니다.