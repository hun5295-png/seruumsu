-- Seroumsu IV Center RLS (Row Level Security) 정책 설정
-- 이 스크립트는 init-supabase.sql 실행 후에 실행해야 합니다.

-- 1. RLS 활성화
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_performance ENABLE ROW LEVEL SECURITY;

-- 2. 사용자 역할 정의 (Supabase Auth 사용)
-- anon: 인증되지 않은 사용자 (읽기 전용, 제한적)
-- authenticated: 인증된 사용자 (일반 직원)
-- service_role: 서비스 역할 (관리자, 모든 권한)

-- 3. 환자 테이블 정책

-- 인증된 사용자는 모든 환자 정보 조회 가능
DROP POLICY IF EXISTS "환자 정보 조회" ON patients;
CREATE POLICY "환자 정보 조회" ON patients
    FOR SELECT USING (auth.role() = 'authenticated');

-- 인증된 사용자는 환자 정보 추가 가능
DROP POLICY IF EXISTS "환자 정보 추가" ON patients;
CREATE POLICY "환자 정보 추가" ON patients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자는 환자 정보 수정 가능
DROP POLICY IF EXISTS "환자 정보 수정" ON patients;
CREATE POLICY "환자 정보 수정" ON patients
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 인증된 사용자는 환자 정보 삭제 가능
DROP POLICY IF EXISTS "환자 정보 삭제" ON patients;
CREATE POLICY "환자 정보 삭제" ON patients
    FOR DELETE USING (auth.role() = 'authenticated');

-- 4. 서비스 테이블 정책

-- 모든 사용자(익명 포함)는 서비스 정보 조회 가능
DROP POLICY IF EXISTS "서비스 정보 조회" ON services;
CREATE POLICY "서비스 정보 조회" ON services
    FOR SELECT USING (true);

-- 인증된 사용자만 서비스 정보 수정 가능
DROP POLICY IF EXISTS "서비스 정보 수정" ON services;
CREATE POLICY "서비스 정보 수정" ON services
    FOR ALL USING (auth.role() = 'authenticated');

-- 5. 예약 테이블 정책

-- 인증된 사용자는 모든 예약 정보 조회 가능
DROP POLICY IF EXISTS "예약 정보 조회" ON appointments;
CREATE POLICY "예약 정보 조회" ON appointments
    FOR SELECT USING (auth.role() = 'authenticated');

-- 인증된 사용자는 예약 추가 가능
DROP POLICY IF EXISTS "예약 추가" ON appointments;
CREATE POLICY "예약 추가" ON appointments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자는 예약 수정 가능
DROP POLICY IF EXISTS "예약 수정" ON appointments;
CREATE POLICY "예약 수정" ON appointments
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 인증된 사용자는 예약 삭제 가능
DROP POLICY IF EXISTS "예약 삭제" ON appointments;
CREATE POLICY "예약 삭제" ON appointments
    FOR DELETE USING (auth.role() = 'authenticated');

-- 6. 패키지 테이블 정책

-- 인증된 사용자는 모든 패키지 정보 조회 가능
DROP POLICY IF EXISTS "패키지 정보 조회" ON packages;
CREATE POLICY "패키지 정보 조회" ON packages
    FOR SELECT USING (auth.role() = 'authenticated');

-- 인증된 사용자는 패키지 관리 가능
DROP POLICY IF EXISTS "패키지 관리" ON packages;
CREATE POLICY "패키지 관리" ON packages
    FOR ALL USING (auth.role() = 'authenticated');

-- 7. 매출 테이블 정책

-- 인증된 사용자는 매출 정보 조회 가능
DROP POLICY IF EXISTS "매출 정보 조회" ON revenues;
CREATE POLICY "매출 정보 조회" ON revenues
    FOR SELECT USING (auth.role() = 'authenticated');

-- 인증된 사용자는 매출 정보 관리 가능
DROP POLICY IF EXISTS "매출 정보 관리" ON revenues;
CREATE POLICY "매출 정보 관리" ON revenues
    FOR ALL USING (auth.role() = 'authenticated');

-- 8. 매출 세부사항 테이블 정책

-- 인증된 사용자는 매출 세부사항 조회 가능
DROP POLICY IF EXISTS "매출 세부사항 조회" ON revenue_details;
CREATE POLICY "매출 세부사항 조회" ON revenue_details
    FOR SELECT USING (auth.role() = 'authenticated');

-- 인증된 사용자는 매출 세부사항 관리 가능
DROP POLICY IF EXISTS "매출 세부사항 관리" ON revenue_details;
CREATE POLICY "매출 세부사항 관리" ON revenue_details
    FOR ALL USING (auth.role() = 'authenticated');

-- 9. 일일 서비스 테이블 정책

-- 인증된 사용자는 일일 서비스 데이터 조회 가능
DROP POLICY IF EXISTS "일일 서비스 조회" ON daily_services;
CREATE POLICY "일일 서비스 조회" ON daily_services
    FOR SELECT USING (auth.role() = 'authenticated');

-- 인증된 사용자는 일일 서비스 데이터 관리 가능
DROP POLICY IF EXISTS "일일 서비스 관리" ON daily_services;
CREATE POLICY "일일 서비스 관리" ON daily_services
    FOR ALL USING (auth.role() = 'authenticated');

-- 10. 쿠폰 테이블 정책

-- 인증된 사용자는 쿠폰 정보 조회 가능
DROP POLICY IF EXISTS "쿠폰 정보 조회" ON coupons;
CREATE POLICY "쿠폰 정보 조회" ON coupons
    FOR SELECT USING (auth.role() = 'authenticated');

-- 인증된 사용자는 쿠폰 관리 가능
DROP POLICY IF EXISTS "쿠폰 관리" ON coupons;
CREATE POLICY "쿠폰 관리" ON coupons
    FOR ALL USING (auth.role() = 'authenticated');

-- 11. 마케팅 성과 테이블 정책

-- 인증된 사용자는 마케팅 성과 조회 가능
DROP POLICY IF EXISTS "마케팅 성과 조회" ON marketing_performance;
CREATE POLICY "마케팅 성과 조회" ON marketing_performance
    FOR SELECT USING (auth.role() = 'authenticated');

-- 인증된 사용자는 마케팅 성과 관리 가능
DROP POLICY IF EXISTS "마케팅 성과 관리" ON marketing_performance;
CREATE POLICY "마케팅 성과 관리" ON marketing_performance
    FOR ALL USING (auth.role() = 'authenticated');

-- 12. 특별 정책: 서비스 역할(관리자)을 위한 모든 테이블 전체 액세스

-- 서비스 역할은 모든 테이블에 대한 모든 권한을 가짐
-- 이는 백업, 마이그레이션, 관리 작업을 위해 필요합니다.

DROP POLICY IF EXISTS "서비스 역할 전체 액세스 - patients" ON patients;
CREATE POLICY "서비스 역할 전체 액세스 - patients" ON patients
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "서비스 역할 전체 액세스 - services" ON services;
CREATE POLICY "서비스 역할 전체 액세스 - services" ON services
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "서비스 역할 전체 액세스 - appointments" ON appointments;
CREATE POLICY "서비스 역할 전체 액세스 - appointments" ON appointments
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "서비스 역할 전체 액세스 - packages" ON packages;
CREATE POLICY "서비스 역할 전체 액세스 - packages" ON packages
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "서비스 역할 전체 액세스 - revenues" ON revenues;
CREATE POLICY "서비스 역할 전체 액세스 - revenues" ON revenues
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "서비스 역할 전체 액세스 - revenue_details" ON revenue_details;
CREATE POLICY "서비스 역할 전체 액세스 - revenue_details" ON revenue_details
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "서비스 역할 전체 액세스 - daily_services" ON daily_services;
CREATE POLICY "서비스 역할 전체 액세스 - daily_services" ON daily_services
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "서비스 역할 전체 액세스 - coupons" ON coupons;
CREATE POLICY "서비스 역할 전체 액세스 - coupons" ON coupons
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "서비스 역할 전체 액세스 - marketing_performance" ON marketing_performance;
CREATE POLICY "서비스 역할 전체 액세스 - marketing_performance" ON marketing_performance
    FOR ALL USING (auth.role() = 'service_role');

-- 13. 뷰 생성 (성능 최적화 및 복잡한 쿼리용)

-- 환자 통계 뷰
CREATE OR REPLACE VIEW patient_stats AS
SELECT
    p.id,
    p.name,
    p.phone,
    p.registration_date,
    p.total_visits,
    p.total_spent,
    p.membership,
    p.status,
    COUNT(a.id) as appointment_count,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
    SUM(CASE WHEN a.status = 'completed' THEN a.price ELSE 0 END) as calculated_total_spent,
    MAX(a.appointment_date) as last_appointment_date
FROM patients p
LEFT JOIN appointments a ON p.id = a.patient_id
GROUP BY p.id, p.name, p.phone, p.registration_date, p.total_visits, p.total_spent, p.membership, p.status;

-- 일일 매출 요약 뷰
CREATE OR REPLACE VIEW daily_revenue_summary AS
SELECT
    DATE(a.appointment_date) as date,
    COUNT(*) as total_appointments,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
    SUM(CASE WHEN a.status = 'completed' THEN a.price ELSE 0 END) as daily_revenue,
    AVG(CASE WHEN a.status = 'completed' THEN a.price ELSE NULL END) as avg_revenue_per_appointment
FROM appointments a
GROUP BY DATE(a.appointment_date)
ORDER BY date DESC;

-- 서비스별 성과 뷰
CREATE OR REPLACE VIEW service_performance AS
SELECT
    s.id,
    s.name,
    s.category,
    s.base_price,
    COUNT(a.id) as total_bookings,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_bookings,
    SUM(CASE WHEN a.status = 'completed' THEN a.price ELSE 0 END) as total_revenue,
    AVG(CASE WHEN a.status = 'completed' THEN a.price ELSE NULL END) as avg_price
FROM services s
LEFT JOIN appointments a ON s.id = a.service_id
WHERE s.is_active = true
GROUP BY s.id, s.name, s.category, s.base_price
ORDER BY total_revenue DESC;

-- 14. 보안 함수들

-- 환자 개인정보 마스킹 함수 (필요시 사용)
CREATE OR REPLACE FUNCTION mask_phone(phone_number TEXT)
RETURNS TEXT AS $$
BEGIN
    IF LENGTH(phone_number) >= 4 THEN
        RETURN LEFT(phone_number, 3) || '****' || RIGHT(phone_number, 4);
    ELSE
        RETURN '****';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 이메일 마스킹 함수
CREATE OR REPLACE FUNCTION mask_email(email_address TEXT)
RETURNS TEXT AS $$
BEGIN
    IF email_address IS NULL OR LENGTH(email_address) = 0 THEN
        RETURN '';
    END IF;

    IF POSITION('@' IN email_address) > 0 THEN
        RETURN LEFT(email_address, 2) || '****@' || SPLIT_PART(email_address, '@', 2);
    ELSE
        RETURN '****';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. 데이터 정합성 체크 함수들

-- 예약 시간 중복 체크 함수
CREATE OR REPLACE FUNCTION check_appointment_conflict(
    p_date DATE,
    p_time TIME,
    p_duration INTEGER,
    p_exclude_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflict_count
    FROM appointments
    WHERE appointment_date = p_date
    AND (
        (appointment_time <= p_time AND appointment_time + (duration || ' minutes')::INTERVAL > p_time::TIME)
        OR
        (appointment_time < (p_time + (p_duration || ' minutes')::INTERVAL)::TIME AND appointment_time >= p_time)
    )
    AND status IN ('confirmed', 'pending')
    AND (p_exclude_id IS NULL OR id != p_exclude_id);

    RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 완료 메시지
SELECT 'RLS 정책 설정이 완료되었습니다.' AS message;