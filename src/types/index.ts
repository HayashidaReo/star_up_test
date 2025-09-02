import { CURRENCIES } from '@/lib/constants';

// 通貨の型定義
export type Currency = (typeof CURRENCIES)[keyof typeof CURRENCIES];

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

// フォームの状態の型定義
export interface ExpenseFormData {
  description: string;
  amount: string;
  payerId: string;
  currency: Currency;
}

// 参加者フォームの状態の型定義
export interface ParticipantFormData {
  name: string;
}
