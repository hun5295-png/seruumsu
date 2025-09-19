# 세로움 수액센터 관리 시스템

세로움 수액센터의 운영을 위한 통합 관리 시스템입니다.

## 주요 기능

### 📊 서비스 이용 현황 관리
- 수액/서비스 종류별 일별 이용 현황 입력 및 조회
- 주별/월별 자동 집계 및 분석
- 실시간 대시보드를 통한 현황 파악

### 💰 매출 관리 시스템
- 수액센터와 내시경 매출을 구분하여 관리
- 일별/주별/월별 매출 자동 계산
- 매출 트렌드 분석 및 수익성 분석

### 🎯 마케팅/유입 경로 분석
- 직원소개, 현내광고, 메세지 등 유입 채널 관리
- 채널별 실적 추적 및 ROI 분석
- 고객 유입 패턴 분석

### 🎫 쿠폰 관리 시스템
- VIP, 생일자, 무료 등 다양한 쿠폰 타입 관리
- 고객별 쿠폰 발급 및 사용 내역 추적
- 쿠폰 효과 분석

## 기술 스택

- **프론트엔드**: Next.js 15.5.3, React 19.1.0, TypeScript 5
- **스타일링**: Tailwind CSS 4
- **백엔드**: Supabase (PostgreSQL, Auth, Realtime)
- **개발 도구**: ESLint, Turbopack

## 시작하기

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
```

`.env.local` 파일에 Supabase 설정을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 2. 데이터베이스 설정

Supabase 대시보드에서 `supabase-schema.sql` 파일의 내용을 실행하여 데이터베이스 스키마를 생성하세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── login/             # 로그인 페이지
│   ├── services/          # 서비스 관리
│   ├── usage/             # 이용 현황
│   ├── revenue/           # 매출 관리
│   ├── coupons/           # 쿠폰 관리
│   ├── marketing/         # 마케팅 관리
│   ├── settings/          # 설정
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 대시보드
├── components/            # 재사용 가능한 컴포넌트
│   └── Navigation.tsx     # 네비게이션
├── lib/                   # 유틸리티 및 설정
│   ├── supabase.ts        # Supabase 클라이언트
│   └── auth.ts            # 인증 서비스
└── types/                 # TypeScript 타입 정의
```

## 주요 페이지

- **대시보드** (`/`): 주요 지표와 빠른 액션
- **서비스 관리** (`/services`): 수액/서비스 등록 및 관리
- **이용 현황** (`/usage`): 일별 서비스 이용 현황 입력
- **매출 관리** (`/revenue`): 일별 매출 입력 및 분석
- **쿠폰 관리** (`/coupons`): 쿠폰 생성 및 사용 내역 관리
- **마케팅** (`/marketing`): 유입 채널 및 고객 유입 관리
- **설정** (`/settings`): 직원 관리 및 시스템 설정

## 배포

### Vercel 배포

1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 설정
4. 자동 배포 완료

### 수동 배포

```bash
npm run build
npm start
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
