-- 사용자 테이블 생성 (직원 및 관리자)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'staff')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 할인율 관리 테이블
CREATE TABLE IF NOT EXISTS discount_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  rate INTEGER NOT NULL CHECK (rate >= 0 AND rate <= 100),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 환자 테이블 업데이트 (새 필드 추가)
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS chart_number VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS discount_rate_id UUID REFERENCES discount_rates(id),
ADD COLUMN IF NOT EXISTS assigned_staff_id UUID REFERENCES users(id);

-- 예약 테이블에 직원 정보 추가
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS created_by_staff_id UUID REFERENCES users(id);

-- 기본 사용자 데이터 삽입
INSERT INTO users (email, password, name, role) VALUES
  ('admin@seroum.com', 'admin1234', '관리자', 'admin'),
  ('staff@seroum.com', 'staff1234', '직원1', 'staff'),
  ('staff2@seroum.com', 'staff1234', '직원2', 'staff')
ON CONFLICT (email) DO NOTHING;

-- 기본 할인율 데이터 삽입
INSERT INTO discount_rates (name, rate, description) VALUES
  ('일반', 0, '할인 없음'),
  ('VIP 고객', 10, 'VIP 고객 10% 할인'),
  ('직원 할인', 20, '직원 및 가족 20% 할인'),
  ('특별 할인', 30, '특별 프로모션 30% 할인')
ON CONFLICT DO NOTHING;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_patients_chart_number ON patients(chart_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- RLS 정책 추가
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_rates ENABLE ROW LEVEL SECURITY;

-- users 테이블 정책
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Only admins can manage users" ON users FOR ALL USING (true);

-- discount_rates 테이블 정책
CREATE POLICY "Anyone can view discount rates" ON discount_rates FOR SELECT USING (true);
CREATE POLICY "Only admins can manage discount rates" ON discount_rates FOR ALL USING (true);