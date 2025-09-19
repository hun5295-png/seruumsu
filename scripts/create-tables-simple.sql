-- 세로음 수액센터 데이터베이스 초기화
-- Supabase SQL Editor에서 이 코드를 실행하세요

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. services 테이블 생성
CREATE TABLE IF NOT EXISTS services (
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

-- 2. patients 테이블 생성
CREATE TABLE IF NOT EXISTS patients (
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

-- 3. appointments 테이블 생성
CREATE TABLE IF NOT EXISTS appointments (
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

-- 4. packages 테이블 생성
CREATE TABLE IF NOT EXISTS packages (
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

-- 5. revenues 테이블 생성
CREATE TABLE IF NOT EXISTS revenues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    iv_revenue INTEGER DEFAULT 0,
    endoscopy_revenue INTEGER DEFAULT 0,
    total_revenue INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. revenue_details 테이블 생성
CREATE TABLE IF NOT EXISTS revenue_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    revenue_id UUID NOT NULL REFERENCES revenues(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL REFERENCES services(id),
    service_name VARCHAR(100) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    revenue INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. daily_services 테이블 생성
CREATE TABLE IF NOT EXISTS daily_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    service_id TEXT NOT NULL REFERENCES services(id),
    service_name VARCHAR(100) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    revenue INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, service_id)
);

-- 8. coupons 테이블 생성
CREATE TABLE IF NOT EXISTS coupons (
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

-- 9. marketing_performance 테이블 생성
CREATE TABLE IF NOT EXISTS marketing_performance (
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

-- 10. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_registration_date ON patients(registration_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_packages_patient_id ON packages(patient_id);
CREATE INDEX IF NOT EXISTS idx_revenues_date ON revenues(date);

-- 11. 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. 트리거 생성
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_revenues_updated_at BEFORE UPDATE ON revenues
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 13. RLS (Row Level Security) 활성화
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_performance ENABLE ROW LEVEL SECURITY;

-- 14. RLS 정책 생성 (인증된 사용자는 모든 작업 가능)
CREATE POLICY "Enable all operations for authenticated users" ON services
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON patients
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON appointments
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON packages
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON revenues
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON revenue_details
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON daily_services
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON coupons
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON marketing_performance
    FOR ALL USING (true);

-- 15. 서비스 초기 데이터 삽입
INSERT INTO services (id, name, category, duration, base_price, package_4_price, package_8_price, description) VALUES
-- 피로회복 & 면역력
('power-vitamin', '파워비타민', 'recovery', 60, 42000, 151200, 268800, '고용량 비타민과 미네랄로 활력 충전'),
('fatigue-recovery', '피로회복', 'recovery', 60, 56000, 201600, 358400, '만성피로 개선을 위한 특별 조합'),
('premium-recovery', '프리미엄 회복', 'recovery', 60, 70000, 252000, 448000, '최상급 피로회복 프로그램'),
('essential-immune', '필수면역', 'immune', 60, 98000, 352800, 627200, '면역력 강화를 위한 필수 영양소'),
('premium-immune', '프리미엄 면역', 'immune', 60, 126000, 453600, 806400, '최고급 면역 증강 프로그램'),

-- 감기 & 숙취
('cold-away', '감기야 가라', 'cold', 60, 56000, 201600, 358400, '감기 증상 완화 특별 처방'),
('hangover-away', '숙취야 가라', 'cold', 60, 56000, 201600, 358400, '숙취 해소를 위한 수액 치료'),

-- 뇌건강 & 인지능력
('quick-immune', '쾌속면역', 'brain', 60, 140000, 504000, 896000, '두뇌 활성화와 면역 강화'),
('omega-3', '오메가-3', 'brain', 60, 140000, 504000, 896000, '두뇌 건강을 위한 오메가-3'),
('brain-youth', '뇌젊음 다시', 'brain', 60, 140000, 504000, 896000, '뇌 노화 방지 프로그램'),
('premium-brain', '프리미엄 뇌젊음', 'brain', 60, 182000, 655200, 1164800, '최고급 뇌 건강 프로그램'),
('smart-injection', '총명주사', 'brain', 60, 56000, 201600, 358400, '집중력과 기억력 향상'),

-- 장건강 & 소화기
('gut-recovery', '장건강 회복', 'gut', 60, 70000, 252000, 448000, '장 건강 개선 프로그램'),
('premium-gut', '프리미엄 장건강', 'gut', 60, 98000, 352800, 627200, '최고급 장 건강 프로그램'),

-- 미용 & 항노화
('white-jade-double', '백옥더블', 'beauty', 60, 70000, 252000, 448000, '미백과 피부 개선'),

-- 혈관 & 순환
('vessel-cleanse', '혈관청소', 'vascular', 60, 56000, 201600, 358400, '혈관 건강 개선'),

-- 태반 & 호르몬
('placenta', '태반', 'placenta', 60, 56000, 201600, 358400, '태반 주사 요법'),
('placenta-double', '태반더블', 'placenta', 60, 84000, 302400, 537600, '강화된 태반 주사'),
('placenta-triple', '태반트리플', 'placenta', 60, 112000, 403200, 716800, '최고급 태반 주사'),

-- 항암 & 면역치료
('thymosin-essential', '가슴샘에센셜', 'immune', 60, 140000, 504000, 896000, '흉선 호르몬 면역 치료'),
('thymosin-double', '가슴샘에센셜 더블', 'immune', 60, 224000, 806400, 1433600, '강화된 흉선 호르몬 치료'),

-- 영양보충 & 에너지
('protein-essential', '단백 에센셜', 'nutrition', 60, 56000, 201600, 358400, '필수 아미노산 공급'),
('protein-power', '단백 파워업', 'nutrition', 60, 84000, 302400, 537600, '고농도 단백질 공급'),
('energy-power', '에너지 파워', 'nutrition', 60, 84000, 302400, 537600, '에너지 부스팅 프로그램'),
('energy-full', '에너지 풀파워', 'nutrition', 60, 112000, 403200, 716800, '최대 에너지 충전'),

-- 특수주사 & 해독
('power-injection', '강력주사', 'special', 30, 28000, 100800, 179200, '빠른 효과의 강력 주사'),
('licorice', '감초주사', 'special', 30, 28000, 100800, 179200, '감초 성분 특수 주사'),
('multi-mineral', '멀티미네랄', 'special', 60, 70000, 252000, 448000, '종합 미네랄 공급'),
('premium-mineral', '프리미엄 멀티미네랄', 'special', 60, 98000, 352800, 627200, '고급 미네랄 복합체')
ON CONFLICT (id) DO NOTHING;

-- 킬레이션은 10회 패키지만 제공
INSERT INTO services (id, name, category, duration, base_price, package_10_price, description) VALUES
('chelation', '킬레이션', 'special', 120, 140000, 1260000, '중금속 해독 치료'),
('premium-chelation', '프리미엄 킬레이션', 'special', 120, 182000, 1638000, '최고급 해독 프로그램')
ON CONFLICT (id) DO NOTHING;

-- 확인
SELECT COUNT(*) as total_services FROM services;