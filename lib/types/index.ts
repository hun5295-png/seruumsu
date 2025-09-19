export * from './database.types'

export type ServiceCategory =
  | '피로회복&면역력'
  | '감기&숙취'
  | '뇌건강&인지능력'
  | '장건강&소화기'
  | '미용&항노화'
  | '혈관&순환'
  | '태반&호르몬'
  | '항암&면역치료'
  | '영양보충&에너지'
  | '특수주사&해독'

export type MarketingSource =
  | '검색'
  | '직원소개'
  | '현내광고'
  | '이벤트메세지'
  | '내시경실'
  | '진료'
  | '지인소개'

export interface AddOn {
  name: string
  price: number
}

export const ADD_ONS: AddOn[] = [
  { name: '백옥', price: 30000 },
  { name: '백옥더블', price: 50000 },
  { name: '가슴샘', price: 70000 },
  { name: '강력주사', price: 50000 }
]

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  '피로회복&면역력',
  '감기&숙취',
  '뇌건강&인지능력',
  '장건강&소화기',
  '미용&항노화',
  '혈관&순환',
  '태반&호르몬',
  '항암&면역치료',
  '영양보충&에너지',
  '특수주사&해독'
]

export const MARKETING_SOURCES: MarketingSource[] = [
  '검색',
  '직원소개',
  '현내광고',
  '이벤트메세지',
  '내시경실',
  '진료',
  '지인소개'
]