// 서비스 데이터 삽입 스크립트
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mucfwbfkewagfwgtvouc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Y2Z3YmZrZXdhZ2Z3Z3R2b3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDAyODEsImV4cCI6MjA3MzgxNjI4MX0.n81U4qziONKkDuj-X3pvjpkNt8oALJLxggxbzxO4wkg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertServices() {
  console.log('🚀 서비스 데이터 삽입 시작...\n');

  const servicesData = [
    // 피로회복 & 면역력
    { id: 'power-vitamin', name: '파워비타민', category: 'recovery', duration: 60, base_price: 42000, package_4_price: 151200, package_8_price: 268800, description: '고용량 비타민과 미네랄로 활력 충전' },
    { id: 'fatigue-recovery', name: '피로회복', category: 'recovery', duration: 60, base_price: 56000, package_4_price: 201600, package_8_price: 358400, description: '만성피로 개선을 위한 특별 조합' },
    { id: 'premium-recovery', name: '프리미엄 회복', category: 'recovery', duration: 60, base_price: 70000, package_4_price: 252000, package_8_price: 448000, description: '최상급 피로회복 프로그램' },
    { id: 'essential-immune', name: '필수면역', category: 'immune', duration: 60, base_price: 98000, package_4_price: 352800, package_8_price: 627200, description: '면역력 강화를 위한 필수 영양소' },
    { id: 'premium-immune', name: '프리미엄 면역', category: 'immune', duration: 60, base_price: 126000, package_4_price: 453600, package_8_price: 806400, description: '최고급 면역 증강 프로그램' },

    // 감기 & 숙취
    { id: 'cold-away', name: '감기야 가라', category: 'cold', duration: 60, base_price: 56000, package_4_price: 201600, package_8_price: 358400, description: '감기 증상 완화 특별 처방' },
    { id: 'hangover-away', name: '숙취야 가라', category: 'cold', duration: 60, base_price: 56000, package_4_price: 201600, package_8_price: 358400, description: '숙취 해소를 위한 수액 치료' },

    // 뇌건강 & 인지능력
    { id: 'quick-immune', name: '쾌속면역', category: 'brain', duration: 60, base_price: 140000, package_4_price: 504000, package_8_price: 896000, description: '두뇌 활성화와 면역 강화' },
    { id: 'omega-3', name: '오메가-3', category: 'brain', duration: 60, base_price: 140000, package_4_price: 504000, package_8_price: 896000, description: '두뇌 건강을 위한 오메가-3' },
    { id: 'brain-youth', name: '뇌젊음 다시', category: 'brain', duration: 60, base_price: 140000, package_4_price: 504000, package_8_price: 896000, description: '뇌 노화 방지 프로그램' },
    { id: 'premium-brain', name: '프리미엄 뇌젊음', category: 'brain', duration: 60, base_price: 182000, package_4_price: 655200, package_8_price: 1164800, description: '최고급 뇌 건강 프로그램' },
    { id: 'smart-injection', name: '총명주사', category: 'brain', duration: 60, base_price: 56000, package_4_price: 201600, package_8_price: 358400, description: '집중력과 기억력 향상' },

    // 장건강 & 소화기
    { id: 'gut-recovery', name: '장건강 회복', category: 'gut', duration: 60, base_price: 70000, package_4_price: 252000, package_8_price: 448000, description: '장 건강 개선 프로그램' },
    { id: 'premium-gut', name: '프리미엄 장건강', category: 'gut', duration: 60, base_price: 98000, package_4_price: 352800, package_8_price: 627200, description: '최고급 장 건강 프로그램' },

    // 미용 & 항노화
    { id: 'white-jade-double', name: '백옥더블', category: 'beauty', duration: 60, base_price: 70000, package_4_price: 252000, package_8_price: 448000, description: '미백과 피부 개선' },

    // 혈관 & 순환
    { id: 'vessel-cleanse', name: '혈관청소', category: 'vascular', duration: 60, base_price: 56000, package_4_price: 201600, package_8_price: 358400, description: '혈관 건강 개선' },

    // 태반 & 호르몬
    { id: 'placenta', name: '태반', category: 'placenta', duration: 60, base_price: 56000, package_4_price: 201600, package_8_price: 358400, description: '태반 주사 요법' },
    { id: 'placenta-double', name: '태반더블', category: 'placenta', duration: 60, base_price: 84000, package_4_price: 302400, package_8_price: 537600, description: '강화된 태반 주사' },
    { id: 'placenta-triple', name: '태반트리플', category: 'placenta', duration: 60, base_price: 112000, package_4_price: 403200, package_8_price: 716800, description: '최고급 태반 주사' },

    // 항암 & 면역치료
    { id: 'thymosin-essential', name: '가슴샘에센셜', category: 'immune', duration: 60, base_price: 140000, package_4_price: 504000, package_8_price: 896000, description: '흉선 호르몬 면역 치료' },
    { id: 'thymosin-double', name: '가슴샘에센셜 더블', category: 'immune', duration: 60, base_price: 224000, package_4_price: 806400, package_8_price: 1433600, description: '강화된 흉선 호르몬 치료' },

    // 영양보충 & 에너지
    { id: 'protein-essential', name: '단백 에센셜', category: 'nutrition', duration: 60, base_price: 56000, package_4_price: 201600, package_8_price: 358400, description: '필수 아미노산 공급' },
    { id: 'protein-power', name: '단백 파워업', category: 'nutrition', duration: 60, base_price: 84000, package_4_price: 302400, package_8_price: 537600, description: '고농도 단백질 공급' },
    { id: 'energy-power', name: '에너지 파워', category: 'nutrition', duration: 60, base_price: 84000, package_4_price: 302400, package_8_price: 537600, description: '에너지 부스팅 프로그램' },
    { id: 'energy-full', name: '에너지 풀파워', category: 'nutrition', duration: 60, base_price: 112000, package_4_price: 403200, package_8_price: 716800, description: '최대 에너지 충전' },

    // 특수주사 & 해독
    { id: 'power-injection', name: '강력주사', category: 'special', duration: 30, base_price: 28000, package_4_price: 100800, package_8_price: 179200, description: '빠른 효과의 강력 주사' },
    { id: 'licorice', name: '감초주사', category: 'special', duration: 30, base_price: 28000, package_4_price: 100800, package_8_price: 179200, description: '감초 성분 특수 주사' },
    { id: 'multi-mineral', name: '멀티미네랄', category: 'special', duration: 60, base_price: 70000, package_4_price: 252000, package_8_price: 448000, description: '종합 미네랄 공급' },
    { id: 'premium-mineral', name: '프리미엄 멀티미네랄', category: 'special', duration: 60, base_price: 98000, package_4_price: 352800, package_8_price: 627200, description: '고급 미네랄 복합체' },
    { id: 'chelation', name: '킬레이션', category: 'special', duration: 120, base_price: 140000, package_10_price: 1260000, description: '중금속 해독 치료' },
    { id: 'premium-chelation', name: '프리미엄 킬레이션', category: 'special', duration: 120, base_price: 182000, package_10_price: 1638000, description: '최고급 해독 프로그램' }
  ];

  try {
    // 기존 데이터 삭제
    console.log('기존 서비스 데이터 삭제 중...');
    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .neq('id', '');

    if (deleteError) {
      console.log('삭제 중 에러 (무시해도 됨):', deleteError.message);
    }

    // 새 데이터 삽입
    console.log('새 서비스 데이터 삽입 중...');
    const { data, error } = await supabase
      .from('services')
      .insert(servicesData)
      .select();

    if (error) {
      console.error('❌ 삽입 실패:', error.message);
      console.error('상세 에러:', error);
    } else {
      console.log(`✅ ${data.length}개의 서비스 데이터 삽입 완료!`);

      // 삽입된 데이터 확인
      const { count } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true });

      console.log(`\n📊 총 ${count}개의 서비스가 데이터베이스에 있습니다.`);
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

insertServices();