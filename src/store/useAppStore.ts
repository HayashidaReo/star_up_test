import { create } from 'zustand';
import { Participant, Expense, Settlement, CreateExpense } from '../types';
import { generateId } from '../lib/utils';
import { SettlementUseCase } from '../domain/SettlementUseCase';

// 基本的な精算計算用のユースケースインスタンス（通貨変換なし）
const basicSettlementUseCase = new SettlementUseCase();

// アプリケーションの状態管理ストア
interface AppStore {
  // 状態
  participants: Participant[];
  expenses: Expense[];
  settlements: Settlement[];

  // 参加者関連のアクション
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;

  // 費用関連のアクション
  addExpense: (expense: CreateExpense) => void;
  removeExpense: (id: string) => void;

  // リセット
  resetAll: () => void;
}

// セレクター関数（パフォーマンス最適化用）
export const participantsSelector = (state: AppStore) => state.participants;
export const expensesSelector = (state: AppStore) => state.expenses;
export const settlementsSelector = (state: AppStore) => state.settlements;

// 計算済みセレクター（メモ化される）
export const participantCountSelector = (state: AppStore) =>
  state.participants.length;
export const expenseCountSelector = (state: AppStore) => state.expenses.length;
export const totalAmountSelector = (state: AppStore) =>
  state.expenses.reduce((total, expense) => total + expense.amount, 0);

// 参加者が存在するかチェックするセレクター
export const hasParticipantsSelector = (state: AppStore) =>
  state.participants.length > 0;
export const hasExpensesSelector = (state: AppStore) =>
  state.expenses.length > 0;

// 特定の参加者を検索するセレクター関数ファクトリー
export const createParticipantByIdSelector =
  (id: string) => (state: AppStore) =>
    state.participants.find((p) => p.id === id);

// 特定の費用を検索するセレクター関数ファクトリー
export const createExpenseByIdSelector = (id: string) => (state: AppStore) =>
  state.expenses.find((e) => e.id === id);

export const useAppStore = create<AppStore>((set) => ({
  // 初期状態
  participants: [],
  expenses: [],
  settlements: [],

  // 参加者を追加
  addParticipant: (name: string) => {
    if (!name.trim()) return;

    set((state) => {
      const newParticipant: Participant = {
        id: generateId(),
        name: name.trim(),
      };

      const newParticipants = [...state.participants, newParticipant];

      // 参加者が追加されたら精算を再計算
      const newSettlements = basicSettlementUseCase.calculateBasicSettlements(
        newParticipants,
        state.expenses,
      );

      return {
        participants: newParticipants,
        settlements: newSettlements,
      };
    });
  },

  // 参加者を削除
  removeParticipant: (id: string) => {
    set((state) => {
      const newParticipants = state.participants.filter((p) => p.id !== id);
      const newExpenses = state.expenses.filter((e) => e.payerId !== id);

      // 参加者や費用が削除されたら精算を再計算
      const newSettlements = basicSettlementUseCase.calculateBasicSettlements(
        newParticipants,
        newExpenses,
      );

      return {
        participants: newParticipants,
        expenses: newExpenses,
        settlements: newSettlements,
      };
    });
  },

  // 費用を追加
  addExpense: (expenseData: Omit<Expense, 'id'>) => {
    set((state) => {
      const newExpense: Expense = {
        id: generateId(),
        ...expenseData,
      };

      const newExpenses = [...state.expenses, newExpense];

      // 費用が追加されたら精算を再計算
      const newSettlements = basicSettlementUseCase.calculateBasicSettlements(
        state.participants,
        newExpenses,
      );

      return {
        expenses: newExpenses,
        settlements: newSettlements,
      };
    });
  },

  // 費用を削除
  removeExpense: (id: string) => {
    set((state) => {
      const newExpenses = state.expenses.filter((e) => e.id !== id);

      // 費用が削除されたら精算を再計算
      const newSettlements = basicSettlementUseCase.calculateBasicSettlements(
        state.participants,
        newExpenses,
      );

      return {
        expenses: newExpenses,
        settlements: newSettlements,
      };
    });
  },

  // すべてをリセット
  resetAll: () => {
    set({
      participants: [],
      expenses: [],
      settlements: [],
    });
  },
}));
