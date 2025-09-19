-- 세로음 수액센터 관리 시스템 데이터베이스 스키마
-- Supabase PostgreSQL 용 테이블 생성 스크립트

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 서비스 테이블 (30개 수액 서비스)
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60, -- 소요시간 (분)
    base_price INTEGER NOT NULL,
    package_4_price INTEGER, -- 4회 패키지 가격
    package_8_price INTEGER, -- 8회 패키지 가격
    package_10_price INTEGER, -- 10회 패키지 가격 (킬레이션 등)
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 환자 테이블
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
    favorite_services TEXT[], -- 선호 서비스 ID 배열
    notes TEXT,
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    membership VARCHAR(10) DEFAULT 'basic' CHECK (membership IN ('basic', 'silver', 'gold', 'vip')),
    visit_source VARCHAR(20) CHECK (visit_source IN ('검색', '직원소개', '원내광고', '이벤트메세지', '내시경실', '진료', '지인소개', '기타')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 패키지 구매 정보 테이블
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

-- 예약 테이블
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
    status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed')),
    notes TEXT,
    -- 추가 옵션들
    addon_백옥 BOOLEAN DEFAULT false,
    addon_백옥더블 BOOLEAN DEFAULT false,
    addon_가슴샘 BOOLEAN DEFAULT false,
    addon_강력주사 BOOLEAN DEFAULT false,
    package_type VARCHAR(10) DEFAULT 'single' CHECK (package_type IN ('single', '4times', '8times', '10times')),
    payment_status VARCHAR(10) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
    created_by VARCHAR(100), -- 직원 ID 또는 이름
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 매출 테이블
CREATE TABLE revenues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    iv_revenue INTEGER DEFAULT 0, -- 수액 매출
    endoscopy_revenue INTEGER DEFAULT 0, -- 내시경 매출
    total_revenue INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 매출 상세 테이블 (서비스별 일일 매출)
CREATE TABLE revenue_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    revenue_id UUID NOT NULL REFERENCES revenues(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL REFERENCES services(id),
    service_name VARCHAR(100) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    revenue INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 일일 서비스 데이터 테이블
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

-- 쿠폰 테이블
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount INTEGER NOT NULL, -- 할인 금액 또는 퍼센트
    discount_type VARCHAR(10) DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
    min_amount INTEGER, -- 최소 사용 금액
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    max_usage INTEGER DEFAULT 0, -- 0이면 무제한
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 마케팅 성과 테이블
CREATE TABLE marketing_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    channel VARCHAR(50) NOT NULL, -- 마케팅 채널 (검색, 직원소개, 원내광고 등)
    visits INTEGER DEFAULT 0, -- 방문 수
    conversions INTEGER DEFAULT 0, -- 전환 수 (실제 예약/방문)
    cost INTEGER DEFAULT 0, -- 마케팅 비용
    revenue INTEGER DEFAULT 0, -- 해당 채널을 통한 매출
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, channel)
);

-- 인덱스 생성
-- 환자 테이블 인덱스
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_registration_date ON patients(registration_date);
CREATE INDEX idx_patients_last_visit ON patients(last_visit);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_visit_source ON patients(visit_source);

-- 예약 테이블 인덱스
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_service_id ON appointments(service_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_payment_status ON appointments(payment_status);
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);

-- 패키지 테이블 인덱스
CREATE INDEX idx_packages_patient_id ON packages(patient_id);
CREATE INDEX idx_packages_service_id ON packages(service_id);
CREATE INDEX idx_packages_purchase_date ON packages(purchase_date);
CREATE INDEX idx_packages_expiry_date ON packages(expiry_date);

-- 매출 테이블 인덱스
CREATE INDEX idx_revenues_date ON revenues(date);
CREATE INDEX idx_revenue_details_revenue_id ON revenue_details(revenue_id);
CREATE INDEX idx_revenue_details_service_id ON revenue_details(service_id);

-- 일일 서비스 테이블 인덱스
CREATE INDEX idx_daily_services_date ON daily_services(date);
CREATE INDEX idx_daily_services_service_id ON daily_services(service_id);

-- 쿠폰 테이블 인덱스
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_valid_dates ON coupons(valid_from, valid_until);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);

-- 마케팅 성과 테이블 인덱스
CREATE INDEX idx_marketing_performance_date ON marketing_performance(date);
CREATE INDEX idx_marketing_performance_channel ON marketing_performance(channel);

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 생성
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenues_updated_at BEFORE UPDATE ON revenues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 정책 설정

-- RLS 활성화
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_performance ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자만 접근 가능한 기본 정책
CREATE POLICY "Enable all operations for authenticated users" ON patients
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON services
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON appointments
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON packages
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON revenues
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON revenue_details
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON daily_services
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON coupons
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON marketing_performance
    FOR ALL USING (auth.role() = 'authenticated');

-- 서비스 데이터 초기 삽입
INSERT INTO services (id, name, category, duration, base_price, package_4_price, package_8_price, description, is_active) VALUES
-- 피로회복 & 면역력
('1', '파워비타민', 'recovery', 60, 70000, 252000, 448000, '피로회복, 신체활력증강, 독감/코로나 감염 후 급성 염증 회복', true),
('2', '피로회복', 'recovery', 60, 80000, 288000, 512000, '간기능 개선, 면역력 강화 및 해독 작용, 만성 피로 회복', true),
('3', '프리미엄 회복', 'recovery', 60, 120000, 432000, 768000, '피로회복 + 비타민 C, B와 각종 무기질 함유로 신체 활력 증강', true),
('4', '필수면역', 'recovery', 30, 80000, 288000, 512000, '간기능 개선 및 숙취 해소, 면역력 강화 및 항염 작용', true),
('5', '프리미엄 면역', 'recovery', 60, 120000, 432000, 768000, '필수면역 + 비타민 C, B와 각종 무기질 함유', true),

-- 감기 & 숙취
('6', '감기야 가라', 'cold', 60, 40000, 144000, 256000, '몸살을 동반한 감기개선, 신경통, 근육통, 관절통 개선', true),
('7', '숙취야 가라', 'cold', 60, 60000, 216000, 384000, '만성 피로 회복, 알코올분해 효소 촉진, 고함량 비타민C', true),

-- 뇌건강 & 인지능력
('8', '쾌속면역', 'brain', 10, 40000, 144000, 256000, '항암/항노화 작용, 심혈관 건강증진, 바이러스 세균 저항력 향상', true),
('9', '오메가-3', 'brain', 30, 50000, 180000, 320000, '뇌기능 및 기억력 개선, 안구건조증, 콜레스테롤 개선', true),
('10', '뇌젊음 다시', 'brain', 60, 60000, 216000, 384000, '뇌혈관 순환 개선, 손상신경의 개선, 뇌기능 회복, 치매예방', true),
('11', '프리미엄 뇌젊음', 'brain', 60, 120000, 432000, 768000, '뇌젊음 + 피로회복', true),
('12', '총명주사', 'brain', 60, 50000, 180000, 320000, '집중력 개선, 에너지생성 및 기억력 향상', true),

-- 장건강 & 소화기
('13', '장건강 회복', 'gut', 20, 60000, 216000, 384000, '만성설사 및 장불편감 개선, 용종 제거 후 점막 회복', true),
('14', '프리미엄 장건강', 'gut', 20, 100000, 360000, 640000, '장건강 회복 + 피로회복, 간기능 개선, 항산화 작용', true),

-- 미용 & 항노화
('15', '백옥더블', 'beauty', 20, 50000, 180000, 320000, '2배 용량 글루타치온, 간기능 개선 및 피로회복, 미백효과', true),

-- 혈관 & 순환
('16', '혈관청소', 'vascular', 30, 80000, 288000, 512000, '혈액순환 개선, 신경통 근육통 완화, 말초 신경 재생 촉진', true),

-- 태반 & 호르몬
('17', '태반', 'placenta', 2, 30000, 108000, 192000, '만성피로 회복, 간기능개선, 탈모개선, 갱년기 증상 완화', true),
('18', '태반더블', 'placenta', 20, 50000, 180000, 320000, '태반 2배 용량', true),
('19', '태반트리플', 'placenta', 30, 70000, 252000, 448000, '태반 3배 용량', true),

-- 항암 & 면역치료
('20', '가슴샘에센셜', 'immune', 2, 80000, 288000, 512000, '암전이 재발 성장억제, 항암치료 효과 상승, 면역력 증강', true),
('21', '가슴샘에센셜 더블', 'immune', 2, 120000, null, null, '가슴샘에센셜 2배 용량 (25% 할인)', true),

-- 영양보충 & 에너지
('22', '단백 에센셜', 'nutrition', 30, 50000, 180000, 320000, '탄수화물, 단백질, 오메가-3 포함한 지질보충', true),
('23', '단백 파워업', 'nutrition', 60, 70000, 252000, 448000, '강화된 단백질 보충', true),
('24', '에너지 파워', 'nutrition', 60, 90000, 324000, 576000, '포도당, 아르기닌 외 단백질 보충을 통한 영양 상태 개선', true),
('25', '에너지 풀파워', 'nutrition', 60, 130000, 468000, 832000, '에너지 보급 및 면역력 향상 + 오메가3 외 지방질 보충', true),

-- 특수주사 & 해독
('26', '강력주사', 'special', 30, 50000, 180000, 320000, '혈류개선, 피로회복 및 활력증진, 성기능개선, 간 해독보조', true),
('27', '감초주사', 'special', 30, 40000, 144000, 256000, '간해독 및 간보호, 항염효과, 피로회복 및 면역력 증강', true),
('28', '멀티미네랄', 'special', 60, 40000, 144000, 256000, '미량 원소 보급, 면역력 증강, 항산화 효과, 만성 피로 회복', true),
('29', '프리미엄 멀티미네랄', 'special', 60, 100000, 360000, 640000, '멀티미네랄 + 이소류신, 아르기닌 외 단백질 함유', true),
('30', '킬레이션', 'special', 60, 120000, null, null, '중금속 해독, 혈관청소, 항동맥경화, 산화 스트레스 감소', true),
('31', '프리미엄 킬레이션', 'special', 60, 200000, null, null, '킬레이션 + 프리미엄 멀티미네랄 (주 2회 내원)', true);

-- 킬레이션 서비스의 10회 패키지 가격 업데이트
UPDATE services SET package_10_price = 900000 WHERE id = '30';
UPDATE services SET package_10_price = 1500000 WHERE id = '31';

COMMIT;