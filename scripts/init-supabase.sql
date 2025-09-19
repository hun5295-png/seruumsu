-- Seroumsu IV Center 데이터베이스 초기화 스크립트
-- 이 스크립트는 Supabase SQL 에디터에서 실행해야 합니다.

-- 1. 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 사용자 정의 타입 생성
DO $$ BEGIN
    CREATE TYPE patient_status AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE patient_membership AS ENUM ('basic', 'silver', 'gold', 'vip');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('confirmed', 'pending', 'cancelled', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE package_type AS ENUM ('single', '4times', '8times', '10times');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE visit_source AS ENUM ('검색', '직원소개', '원내광고', '이벤트메세지', '내시경실', '진료', '지인소개', '기타');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. 테이블 생성

-- 환자 테이블
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    birth_date DATE,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_visit DATE,
    total_visits INTEGER NOT NULL DEFAULT 0,
    total_spent DECIMAL(10, 2) NOT NULL DEFAULT 0,
    favorite_services TEXT[],
    notes TEXT,
    status patient_status NOT NULL DEFAULT 'active',
    membership patient_membership NOT NULL DEFAULT 'basic',
    visit_source visit_source,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 서비스 테이블
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60, -- 분 단위
    base_price DECIMAL(10, 2) NOT NULL,
    package_4_price DECIMAL(10, 2),
    package_8_price DECIMAL(10, 2),
    package_10_price DECIMAL(10, 2),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 예약 테이블
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    service_id UUID NOT NULL REFERENCES services(id),
    service_name VARCHAR(200) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60,
    price DECIMAL(10, 2) NOT NULL,
    status appointment_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    addon_백옥 BOOLEAN NOT NULL DEFAULT false,
    addon_백옥더블 BOOLEAN NOT NULL DEFAULT false,
    addon_가슴샘 BOOLEAN NOT NULL DEFAULT false,
    addon_강력주사 BOOLEAN NOT NULL DEFAULT false,
    package_type package_type NOT NULL DEFAULT 'single',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    created_by UUID, -- 직원 ID (추후 확장용)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 패키지 테이블 (환자별 구매한 패키지)
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id),
    service_name VARCHAR(200) NOT NULL,
    total_count INTEGER NOT NULL,
    remaining_count INTEGER NOT NULL,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    purchase_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 매출 테이블
CREATE TABLE IF NOT EXISTS revenues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    iv_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
    endoscopy_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 매출 세부사항 테이블
CREATE TABLE IF NOT EXISTS revenue_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    revenue_id UUID NOT NULL REFERENCES revenues(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id),
    service_name VARCHAR(200) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 일일 서비스 데이터 테이블
CREATE TABLE IF NOT EXISTS daily_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    service_id UUID NOT NULL REFERENCES services(id),
    service_name VARCHAR(200) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE(date, service_id)
);

-- 쿠폰 테이블
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(10, 2) NOT NULL,
    discount_type discount_type NOT NULL DEFAULT 'percentage',
    min_amount DECIMAL(10, 2),
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    max_usage INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 마케팅 성과 테이블
CREATE TABLE IF NOT EXISTS marketing_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    channel VARCHAR(100) NOT NULL,
    visits INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE(date, channel)
);

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_registration_date ON patients(registration_date);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);

CREATE INDEX IF NOT EXISTS idx_packages_patient_id ON packages(patient_id);
CREATE INDEX IF NOT EXISTS idx_packages_service_id ON packages(service_id);

CREATE INDEX IF NOT EXISTS idx_revenues_date ON revenues(date);
CREATE INDEX IF NOT EXISTS idx_revenue_details_revenue_id ON revenue_details(revenue_id);

CREATE INDEX IF NOT EXISTS idx_daily_services_date ON daily_services(date);
CREATE INDEX IF NOT EXISTS idx_daily_services_service_id ON daily_services(service_id);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);

CREATE INDEX IF NOT EXISTS idx_marketing_date ON marketing_performance(date);

-- 5. 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 트리거 생성
DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_packages_updated_at ON packages;
CREATE TRIGGER update_packages_updated_at
    BEFORE UPDATE ON packages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_revenues_updated_at ON revenues;
CREATE TRIGGER update_revenues_updated_at
    BEFORE UPDATE ON revenues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. 기본 서비스 데이터 삽입
INSERT INTO services (id, name, category, duration, base_price, package_4_price, package_8_price, description) VALUES
    ('vita-basic', '비타민 기본', 'IV치료', 30, 15000, 12000, 10000, '기본 비타민 IV 치료'),
    ('vita-premium', '비타민 프리미엄', 'IV치료', 45, 25000, 20000, 18000, '프리미엄 비타민 IV 치료'),
    ('detox-basic', '해독 기본', 'IV치료', 60, 35000, 28000, 25000, '기본 해독 IV 치료'),
    ('detox-premium', '해독 프리미엄', 'IV치료', 90, 50000, 40000, 35000, '프리미엄 해독 IV 치료'),
    ('anti-aging', '안티에이징', 'IV치료', 60, 45000, 36000, 32000, '안티에이징 IV 치료'),
    ('immunity-boost', '면역력 강화', 'IV치료', 45, 30000, 24000, 21000, '면역력 강화 IV 치료'),
    ('fatigue-recovery', '피로회복', 'IV치료', 30, 20000, 16000, 14000, '피로회복 IV 치료'),
    ('skin-care', '피부관리', 'IV치료', 60, 40000, 32000, 28000, '피부관리 IV 치료'),
    ('liver-care', '간기능 개선', 'IV치료', 45, 35000, 28000, 25000, '간기능 개선 IV 치료'),
    ('endoscopy-upper', '상부내시경', '내시경', 30, 80000, NULL, NULL, '상부위 내시경 검사'),
    ('endoscopy-lower', '하부내시경', '내시경', 45, 120000, NULL, NULL, '하부위 내시경 검사'),
    ('endoscopy-full', '전체내시경', '내시경', 90, 180000, NULL, NULL, '상하부 내시경 검사')
ON CONFLICT (id) DO NOTHING;

-- 8. 샘플 쿠폰 데이터
INSERT INTO coupons (code, discount, discount_type, min_amount, valid_from, valid_until, max_usage) VALUES
    ('WELCOME10', 10, 'percentage', 50000, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 100),
    ('FIRST5000', 5000, 'fixed', 20000, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 200),
    ('VIP20', 20, 'percentage', 100000, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 50)
ON CONFLICT (code) DO NOTHING;

-- 완료 메시지
SELECT 'Seroumsu IV Center 데이터베이스 초기화가 완료되었습니다.' AS message;