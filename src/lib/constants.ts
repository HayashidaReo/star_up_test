/**
 * アプリケーション全体で使用する定数
 */

// 通貨の種類（CURRENCY_SYMBOLSと同期）
export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  JPY: 'JPY',
  GBP: 'GBP',
  CAD: 'CAD',
  AUD: 'AUD',
  CHF: 'CHF',
  CNY: 'CNY',
  KRW: 'KRW',
} as const;

// 主要通貨の記号マッピング（世界的に認識度の高い通貨）
export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  KRW: '₩',
} as const;

// 記号を持つ主要通貨のリスト
export const MAJOR_CURRENCIES = new Set(Object.keys(CURRENCY_SYMBOLS));

// 最小金額（精算計算での丸め誤差対策）
export const MIN_AMOUNT_THRESHOLD = 0.01;

// デフォルト通貨
export const DEFAULT_CURRENCY = CURRENCIES.JPY;

// フォームのプレースホルダー
export const PLACEHOLDERS = {
  PARTICIPANT_NAME: '名前を入力...',
  EXPENSE_DESCRIPTION: '例: 夕食代',
  EXPENSE_AMOUNT: '例: 8000',
} as const;

// メッセージ
export const MESSAGES = {
  ADD_PARTICIPANT: '追加',
  ADD_EXPENSE: '費用を追加',
  SETTLE: '精算する',
  CANCEL: 'キャンセル',
  NO_PARTICIPANTS: '支払いを追加してください',
  NO_EXPENSES: '費用を追加してください',
  NO_PARTICIPANTS_FOR_EXPENSE: 'まず参加者を追加してください',
  NO_EXPENSES_FOR_SETTLEMENT: '費用を追加してください',
  CALCULATE_SETTLEMENT: '精算を計算してください',
} as const;
