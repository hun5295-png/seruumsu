# 세로음 수액센터 관리 시스템 데이터베이스 스키마

## 개요

이 문서는 세로음 수액센터 관리 시스템의 Supabase PostgreSQL 데이터베이스 스키마를 설명합니다.

### 프로젝트 정보
- **수파베이스 URL**: https://mucfwbfkewagfwgtvouc.supabase.co
- **데이터베이스**: PostgreSQL 15
- **스키마 버전**: 1.0.0
- **최종 업데이트**: 2024-09-19

## 테이블 구조

### 1. services (서비스 테이블)
30개의 수액 서비스 정보를 저장합니다.

```sql
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60,
    base_price INTEGER NOT NULL,
    package_4_price INTEGER,
    package_8_price INTEGER,
    package_10_price INTEGER,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**필드 설명:**
- `id`: 서비스 고유 ID (문자열)
- `name`: 서비스 명 (예: "파워비타민", "피로회복")
- `category`: 서비스 카테고리 (recovery, cold, brain, gut, beauty, vascular, placenta, immune, nutrition, special)
- `duration`: 소요시간 (분)
- `base_price`: 기본 가격
- `package_4_price`: 4회 패키지 가격
- `package_8_price`: 8회 패키지 가격
- `package_10_price`: 10회 패키지 가격 (킬레이션 등)
- `description`: 서비스 설명
- `is_active`: 활성화 상태

### 2. patients (환자 테이블)
환자 정보를 저장합니다.

```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    birth_date DATE,
    registration_date DATE DEFAULT CURRENT_DATE,
    last_visit DATE,
    total_visits INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    favorite_services TEXT[],
    notes TEXT,
    status VARCHAR(10) DEFAULT 'active',
    membership VARCHAR(10) DEFAULT 'basic',
    visit_source VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**필드 설명:**
- `id`: 환자 고유 ID (UUID)
- `name`: 환자 이름
- `phone`: 전화번호 (고유값)
- `email`: 이메일 주소
- `birth_date`: 생년월일
- `registration_date`: 등록일
- `last_visit`: 최종 방문일
- `total_visits`: 총 방문 횟수
- `total_spent`: 총 지출 금액
- `favorite_services`: 선호 서비스 ID 배열
- `notes`: 메모
- `status`: 환자 상태 (active, inactive)
- `membership`: 멤버십 등급 (basic, silver, gold, vip)
- `visit_source`: 방문 경로 (검색, 직원소개, 원내광고, 이벤트메세지, 내시경실, 진료, 지인소개, 기타)

### 3. appointments (예약 테이블)
예약 정보를 저장합니다.

```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    service_id TEXT NOT NULL REFERENCES services(id),
    service_name VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60,
    price INTEGER NOT NULL,
    status VARCHAR(10) DEFAULT 'pending',
    notes TEXT,
    addon_백옥 BOOLEAN DEFAULT false,
    addon_백옥더블 BOOLEAN DEFAULT false,
    addon_가슴샘 BOOLEAN DEFAULT false,
    addon_강력주사 BOOLEAN DEFAULT false,
    package_type VARCHAR(10) DEFAULT 'single',
    payment_status VARCHAR(10) DEFAULT 'pending',
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**필드 설명:**
- `id`: 예약 고유 ID (UUID)
- `patient_id`: 환자 ID (외래키)
- `patient_name`: 환자 이름 (중복 저장)
- `phone`: 전화번호
- `service_id`: 서비스 ID (외래키)
- `service_name`: 서비스 이름 (중복 저장)
- `appointment_date`: 예약 날짜
- `appointment_time`: 예약 시간
- `duration`: 소요시간 (분)
- `price`: 총 가격
- `status`: 예약 상태 (confirmed, pending, cancelled, completed)
- `notes`: 메모
- `addon_*`: 추가 옵션들 (백옥, 백옥더블, 가슴샘, 강력주사)
- `package_type`: 패키지 타입 (single, 4times, 8times, 10times)
- `payment_status`: 결제 상태 (pending, paid)
- `created_by`: 생성자 (직원 ID 또는 이름)

### 4. packages (패키지 구매 정보 테이블)
환자의 패키지 구매 및 잔여 횟수를 관리합니다.

```sql
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL REFERENCES services(id),
    service_name VARCHAR(100) NOT NULL,
    total_count INTEGER NOT NULL,
    remaining_count INTEGER NOT NULL,
    purchase_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    purchase_price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**필드 설명:**
- `id`: 패키지 고유 ID (UUID)
- `patient_id`: 환자 ID (외래키)
- `service_id`: 서비스 ID (외래키)
- `service_name`: 서비스 이름
- `total_count`: 총 횟수
- `remaining_count`: 잔여 횟수
- `purchase_date`: 구매일
- `expiry_date`: 만료일
- `purchase_price`: 구매 가격

### 5. revenues (매출 테이블)
일별 매출 정보를 저장합니다.

```sql
CREATE TABLE revenues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    iv_revenue INTEGER DEFAULT 0,
    endoscopy_revenue INTEGER DEFAULT 0,
    total_revenue INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**필드 설명:**
- `id`: 매출 고유 ID (UUID)
- `date`: 날짜 (고유값)
- `iv_revenue`: 수액 매출
- `endoscopy_revenue`: 내시경 매출
- `total_revenue`: 총 매출

### 6. revenue_details (매출 상세 테이블)
일별 서비스별 매출 상세 정보를 저장합니다.

```sql
CREATE TABLE revenue_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    revenue_id UUID NOT NULL REFERENCES revenues(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL REFERENCES services(id),
    service_name VARCHAR(100) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    revenue INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. daily_services (일일 서비스 데이터 테이블)
일별 서비스 사용 통계를 저장합니다.

```sql
CREATE TABLE daily_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    service_id TEXT NOT NULL REFERENCES services(id),
    service_name VARCHAR(100) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    revenue INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, service_id)
);
```

### 8. coupons (쿠폰 테이블)
쿠폰 정보를 저장합니다.

```sql
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount INTEGER NOT NULL,
    discount_type VARCHAR(10) DEFAULT 'percentage',
    min_amount INTEGER,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    max_usage INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**필드 설명:**
- `id`: 쿠폰 고유 ID (UUID)
- `code`: 쿠폰 코드 (고유값)
- `discount`: 할인 금액 또는 퍼센트
- `discount_type`: 할인 타입 (percentage, fixed)
- `min_amount`: 최소 사용 금액
- `valid_from`: 사용 시작일
- `valid_until`: 사용 만료일
- `usage_count`: 사용 횟수
- `max_usage`: 최대 사용 횟수 (0이면 무제한)
- `is_active`: 활성화 상태

### 9. marketing_performance (마케팅 성과 테이블)
마케팅 채널별 성과를 저장합니다.

```sql
CREATE TABLE marketing_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    channel VARCHAR(50) NOT NULL,
    visits INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    cost INTEGER DEFAULT 0,
    revenue INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, channel)
);
```

**필드 설명:**
- `id`: 성과 고유 ID (UUID)
- `date`: 날짜
- `channel`: 마케팅 채널 (검색, 직원소개, 원내광고 등)
- `visits`: 방문 수
- `conversions`: 전환 수 (실제 예약/방문)
- `cost`: 마케팅 비용
- `revenue`: 해당 채널을 통한 매출

## 인덱스

성능 최적화를 위해 다음 인덱스들이 생성됩니다:

### 환자 테이블 인덱스
- `idx_patients_phone`: 전화번호
- `idx_patients_email`: 이메일
- `idx_patients_registration_date`: 등록일
- `idx_patients_last_visit`: 최종 방문일
- `idx_patients_status`: 환자 상태
- `idx_patients_visit_source`: 방문 경로

### 예약 테이블 인덱스
- `idx_appointments_patient_id`: 환자 ID
- `idx_appointments_service_id`: 서비스 ID
- `idx_appointments_date`: 예약 날짜
- `idx_appointments_status`: 예약 상태
- `idx_appointments_payment_status`: 결제 상태
- `idx_appointments_date_time`: 예약 날짜 + 시간

### 기타 인덱스
- 패키지, 매출, 일일 서비스, 쿠폰, 마케팅 성과 테이블에도 적절한 인덱스 설정

## Row Level Security (RLS)

모든 테이블에 RLS가 활성화되어 있으며, 인증된 사용자만 접근 가능한 정책이 설정되어 있습니다.

```sql
-- 예시: 환자 테이블 RLS 정책
CREATE POLICY "Enable all operations for authenticated users" ON patients
    FOR ALL USING (auth.role() = 'authenticated');
```

## 트리거

업데이트 시간 자동 갱신을 위한 트리거가 설정되어 있습니다:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

## 초기 데이터

### 서비스 데이터
31개의 수액 서비스가 초기 데이터로 삽입됩니다:

1. **피로회복 & 면역력** (5개)
   - 파워비타민, 피로회복, 프리미엄 회복, 필수면역, 프리미엄 면역

2. **감기 & 숙취** (2개)
   - 감기야 가라, 숙취야 가라

3. **뇌건강 & 인지능력** (5개)
   - 쾌속면역, 오메가-3, 뇌젊음 다시, 프리미엄 뇌젊음, 총명주사

4. **장건강 & 소화기** (2개)
   - 장건강 회복, 프리미엄 장건강

5. **미용 & 항노화** (1개)
   - 백옥더블

6. **혈관 & 순환** (1개)
   - 혈관청소

7. **태반 & 호르몬** (3개)
   - 태반, 태반더블, 태반트리플

8. **항암 & 면역치료** (2개)
   - 가슴샘에센셜, 가슴샘에센셜 더블

9. **영양보충 & 에너지** (4개)
   - 단백 에센셜, 단백 파워업, 에너지 파워, 에너지 풀파워

10. **특수주사 & 해독** (6개)
    - 강력주사, 감초주사, 멀티미네랄, 프리미엄 멀티미네랄, 킬레이션, 프리미엄 킬레이션

## 사용 방법

1. **데이터베이스 설정**:
   ```bash
   # setup_database.sql 파일을 Supabase SQL 에디터에서 실행
   ```

2. **환경변수 설정**:
   ```bash
   # .env.local.example을 .env.local로 복사하고 실제 값으로 변경
   cp .env.local.example .env.local
   ```

3. **TypeScript 타입 사용**:
   ```typescript
   import { Database } from '@/lib/supabase/types'
   import { supabase } from '@/lib/supabase/client'

   // 환자 조회
   const { data: patients } = await supabase
     .from('patients')
     .select('*')
   ```

## 백업 및 마이그레이션

### 데이터 백업
- Supabase Dashboard에서 정기 백업 설정
- 중요 데이터는 별도 백업 스케줄 관리

### 스키마 마이그레이션
- 스키마 변경 시 migration 스크립트 작성
- 버전 관리를 통한 순차적 적용

## 보안 고려사항

1. **RLS 정책**: 모든 테이블에 적절한 RLS 정책 적용
2. **환경변수**: 민감한 정보는 환경변수로 관리
3. **API 키**: Service Role Key는 서버 사이드에서만 사용
4. **데이터 암호화**: 중요 개인정보는 암호화 저장 고려

## 성능 최적화

1. **인덱스**: 자주 조회되는 컬럼에 인덱스 설정
2. **쿼리 최적화**: 복잡한 조인 쿼리 최적화
3. **연결 풀링**: 적절한 연결 풀 설정
4. **캐싱**: 자주 조회되는 데이터 캐싱 적용

## 연락처

데이터베이스 관련 문의사항이 있으시면 개발팀에 연락해 주세요.

---

**작성일**: 2024-09-19
**버전**: 1.0.0
**작성자**: Claude AI