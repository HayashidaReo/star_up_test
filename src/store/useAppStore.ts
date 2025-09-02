import { create } from 'zustand';
import { Participant, Expense, Settlement, CreateExpense } from '@/types';
import { generateId } from '@/lib/utils';
import { calculateSettlements } from '@/lib/settlement';

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

  // 精算計算
  calculateSettlements: () => void;

  // リセット
  resetAll: () => void;
}

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
      const newSettlements = calculateSettlements(
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
      const newSettlements = calculateSettlements(newParticipants, newExpenses);

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
      const newSettlements = calculateSettlements(
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
      const newSettlements = calculateSettlements(
        state.participants,
        newExpenses,
      );

      return {
        expenses: newExpenses,
        settlements: newSettlements,
      };
    });
  },

  // 精算を計算（手動実行用）
  calculateSettlements: () => {
    set((state) => ({
      settlements: calculateSettlements(state.participants, state.expenses),
    }));
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
