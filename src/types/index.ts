import { CURRENCIES } from '@/lib/constants';

// 通貨の型定義
export type Currency = (typeof CURRENCIES)[keyof typeof CURRENCIES];

// 通貨シンボル情報の型定義
export interface CurrencySymbol {
  readonly code: string;
  readonly description: string;
}

// 為替レート情報の型定義
export interface ExchangeRate {
  readonly base: string;
  readonly rates: Record<string, number>;
  readonly date: string;
}

// 通貨変換結果の型定義
export interface ConvertedAmount {
  readonly originalAmount: number;
  readonly originalCurrency: string;
  readonly convertedAmount: number;
  readonly targetCurrency: string;
  readonly rate: number;
}

// 参加者の型定義
export interface Participant {
  readonly id: string;
  readonly name: string;
}

// 費用の型定義
export interface Expense {
  readonly id: string;
  readonly description: string; // 内容
  readonly amount: number; // 支払額
  readonly payerId: string; // 支払者のID
  readonly currency: Currency; // 通貨
}

// 精算結果の型定義
export interface Settlement {
  readonly from: string; // 支払う人の名前
  readonly to: string; // 受け取る人の名前
  readonly amount: number; // 金額
}

// 新しい費用を作成する際の型（IDを除く）
export type CreateExpense = Omit<Expense, 'id'>;

// アプリケーション全体の状態の型定義
export interface AppState {
  readonly participants: readonly Participant[];
  readonly expenses: readonly Expense[];
  readonly settlements: readonly Settlement[];
}

// フォームの状態の型定義（Zodスキーマから推論）
export type { ParticipantFormData, ExpenseFormData } from '@/lib/schemas';
