import { create } from 'zustand';
import { Participant, Expense, Settlement } from '@/types';

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
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;

  // 精算計算
  calculateSettlements: () => void;

  // リセット
  resetAll: () => void;
}

// ユニークIDを生成する関数
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// 精算計算のロジック
const calculateSettlements = (
  participants: Participant[],
  expenses: Expense[],
): Settlement[] => {
  if (participants.length === 0 || expenses.length === 0) {
    return [];
  }

  // 各参加者の支払い総額を計算
  const payments = new Map<string, number>();
  participants.forEach((p) => payments.set(p.id, 0));

  expenses.forEach((expense) => {
    const current = payments.get(expense.payerId) || 0;
    payments.set(expense.payerId, current + expense.amount);
  });

  // 各参加者の負担額を計算（合計金額を参加者数で割る）
  const totalAmount = Array.from(payments.values()).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const perPersonAmount = totalAmount / participants.length;

  // 各参加者の差額を計算
  const balances = new Map<string, number>();
  participants.forEach((participant) => {
    const paid = payments.get(participant.id) || 0;
    balances.set(participant.id, paid - perPersonAmount);
  });

  // 精算リストを生成
  const settlements: Settlement[] = [];
  const sortedBalances = Array.from(balances.entries())
    .map(([id, balance]) => ({ id, balance }))
    .sort((a, b) => a.balance - b.balance);

  let i = 0; // 負債者（支払う人）のインデックス
  let j = sortedBalances.length - 1; // 債権者（受け取る人）のインデックス

  while (i < j) {
    const debtor = sortedBalances[i];
    const creditor = sortedBalances[j];

    if (Math.abs(debtor.balance) < 0.01 && Math.abs(creditor.balance) < 0.01) {
      break;
    }

    const debtorName = participants.find((p) => p.id === debtor.id)?.name || '';
    const creditorName =
      participants.find((p) => p.id === creditor.id)?.name || '';

    const amount = Math.min(-debtor.balance, creditor.balance);

    if (amount > 0.01) {
      settlements.push({
        from: debtorName,
        to: creditorName,
        amount: Math.round(amount),
      });
    }

    debtor.balance += amount;
    creditor.balance -= amount;

    if (Math.abs(debtor.balance) < 0.01) i++;
    if (Math.abs(creditor.balance) < 0.01) j--;
  }

  return settlements;
};

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
