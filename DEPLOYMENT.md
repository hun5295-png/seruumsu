# Seroumsu IV Center - 배포 가이드

## 📋 개요

이 문서는 Seroumsu IV Center 애플리케이션을 Vercel에 배포하고 Supabase와 연동하는 과정을 안내합니다.

## 🚀 배포 전 준비사항

### 1. Supabase 프로젝트 설정

#### 1-1. Supabase 데이터베이스 초기화

1. Supabase 대시보드(https://app.supabase.io)에 로그인
2. 프로젝트 생성 또는 기존 프로젝트 선택
3. SQL Editor에서 다음 스크립트들을 순서대로 실행:

```bash
# 1. 데이터베이스 초기화
scripts/init-supabase.sql

# 2. RLS 정책 설정
scripts/rls-policies.sql
```

#### 1-2. 환경 변수 수집

Supabase 프로젝트의 Settings > API에서 다음 정보를 수집:

- **Project URL**: `https://mucfwbfkewagfwgtvouc.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Service Role Key**: Settings > API > service_role 키

### 2. Vercel 프로젝트 설정

#### 2-1. Vercel CLI 설치 (선택사항)

```bash
npm install -g vercel
```

#### 2-2. 프로젝트 연결

```bash
# Vercel에 로그인
vercel login

# 프로젝트를 Vercel과 연결
vercel link

# 또는 새 프로젝트로 배포
vercel
```

## 🔧 환경 변수 설정

### Vercel 환경 변수 설정

Vercel 대시보드에서 프로젝트 > Settings > Environment Variables에 다음 변수들을 추가:

#### Production 환경

```bash
NEXT_PUBLIC_SUPABASE_URL=https://mucfwbfkewagfwgtvouc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Y2Z3YmZrZXdhZ2Z3Z3R2b3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyNTI0MTIsImV4cCI6MjA1MjgyODQxMn0.HqBEhOC1V_AE3rCPpA5M2l-DGhO_WQnz7T-8ixhKhgY
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Development & Preview 환경

동일한 값들을 Development와 Preview 환경에도 설정합니다.

### 로컬 개발 환경 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://mucfwbfkewagfwgtvouc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Y2Z3YmZrZXdhZ2Z3Z3R2b3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyNTI0MTIsImV4cCI6MjA1MjgyODQxMn0.HqBEhOC1V_AE3rCPpA5M2l-DGhO_WQnz7T-8ixhKhgY
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **보안 주의사항**: `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

## 📦 배포 과정

### 방법 1: Git 연동 자동 배포 (권장)

1. GitHub/GitLab/Bitbucket에 코드 푸시
2. Vercel 대시보드에서 프로젝트 Import
3. 환경 변수 설정
4. Deploy 버튼 클릭

### 방법 2: Vercel CLI 사용

```bash
# 프리뷰 배포
npm run deploy:preview

# 프로덕션 배포
npm run deploy
```

### 방법 3: 수동 배포

```bash
# 빌드 테스트
npm run build

# Vercel에 배포
vercel --prod
```

## 🧪 배포 후 검증

### 1. 애플리케이션 동작 확인

배포된 URL로 접속하여 다음을 확인:

- 애플리케이션이 정상적으로 로드되는지
- 메인 페이지가 표시되는지
- 네비게이션이 동작하는지

### 2. Supabase 연결 테스트

배포된 애플리케이션에서 `/test-supabase` 페이지에 접속하여:

```
https://your-app.vercel.app/test-supabase
```

- 연결 테스트 실행
- CRUD 작업 테스트 실행
- 실시간 구독 테스트 실행

### 3. 데이터 마이그레이션 (필요시)

기존 localStorage 데이터가 있는 경우:

1. `/test-supabase` 페이지에서 "마이그레이션 실행" 버튼 클릭
2. 마이그레이션 진행상황 모니터링
3. 결과 확인 및 오류 검토

## 🔄 지속적 배포 설정

### GitHub Actions (선택사항)

`.github/workflows/deploy.yml` 파일을 생성하여 자동 배포 설정:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run typecheck

      - name: Run build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📊 모니터링 및 성능

### Vercel 대시보드 모니터링

- **Functions**: API 라우트 성능 모니터링
- **Analytics**: 페이지 뷰 및 사용자 행동 분석
- **Speed Insights**: 페이지 로딩 성능 측정

### Supabase 대시보드 모니터링

- **Database**: 쿼리 성능 및 연결 상태
- **API**: API 사용량 및 응답 시간
- **Auth**: 사용자 인증 현황

## 🚨 문제 해결

### 자주 발생하는 문제들

#### 1. 환경 변수 관련

**문제**: "Missing Supabase environment variables" 오류

**해결**:
```bash
# 환경 변수가 올바르게 설정되었는지 확인
vercel env ls

# 환경 변수 추가
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

#### 2. 빌드 실패

**문제**: TypeScript 타입 오류로 빌드 실패

**해결**:
```bash
# 타입 체크 실행
npm run typecheck

# 오류 수정 후 다시 빌드
npm run build
```

#### 3. Supabase 연결 실패

**문제**: 데이터베이스 연결 실패

**해결**:
1. Supabase 프로젝트가 활성화되어 있는지 확인
2. RLS 정책이 올바르게 설정되었는지 확인
3. API 키가 만료되지 않았는지 확인

#### 4. CORS 오류

**문제**: Cross-Origin 요청 차단

**해결**:
1. Supabase 대시보드 > Settings > API > CORS에 도메인 추가
2. `vercel.json`의 headers 설정 확인

### 로그 확인

#### Vercel 로그
```bash
# 실시간 로그 확인
vercel logs

# 특정 배포의 로그 확인
vercel logs [deployment-url]
```

#### Supabase 로그
- Supabase 대시보드 > Logs에서 실시간 로그 확인

## 🔧 성능 최적화

### 1. 이미지 최적화

Next.js Image 컴포넌트 사용:
```jsx
import Image from 'next/image'

<Image
  src="/images/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

### 2. 코드 분할

동적 import 사용:
```jsx
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})
```

### 3. 캐싱 전략

`vercel.json`에서 캐시 설정:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60"
        }
      ]
    }
  ]
}
```

## 📚 추가 리소스

### 공식 문서
- [Vercel 배포 가이드](https://vercel.com/docs/deployments)
- [Supabase 문서](https://supabase.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)

### 유용한 도구
- [Vercel CLI](https://vercel.com/cli)
- [Supabase CLI](https://supabase.com/docs/reference/cli)
- [Vercel Desktop](https://vercel.com/desktop)

## 🤝 지원

문제가 발생하거나 도움이 필요한 경우:

1. **기술 문서 확인**: 각 서비스의 공식 문서 참조
2. **커뮤니티 포럼**: Vercel과 Supabase 커뮤니티 활용
3. **GitHub Issues**: 프로젝트 저장소에 이슈 등록

---

**배포 성공을 위한 체크리스트**

- [ ] Supabase 프로젝트 생성 및 데이터베이스 초기화
- [ ] 환경 변수 설정 (로컬 및 Vercel)
- [ ] Vercel 프로젝트 연결
- [ ] 빌드 테스트 통과
- [ ] 배포 완료
- [ ] 연결 테스트 통과
- [ ] 데이터 마이그레이션 (필요시)
- [ ] 성능 모니터링 설정

배포 완료 후 `/test-supabase` 페이지에서 모든 테스트가 통과하면 성공적으로 배포된 것입니다! 🎉