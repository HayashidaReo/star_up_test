// 参加者の型定義
export interface Participant {
  id: string;
  name: string;
}

// 費用の型定義
export interface Expense {
  id: string;
  description: string; // 内容
  amount: number; // 支払額
  payerId: string; // 支払者のID
  currency: 'JPY' | 'USD' | 'EUR'; // 通貨
}

// 精算結果の型定義
export interface Settlement {
  from: string; // 支払う人の名前
  to: string; // 受け取る人の名前
  amount: number; // 金額
}

// アプリケーション全体の状態の型定義
export interface AppState {
  participants: Participant[];
  expenses: Expense[];
  settlements: Settlement[];
}
