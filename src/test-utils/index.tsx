import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { useAppStore } from '@/store/useAppStore';

// テスト用のプロバイダーコンポーネント
const TestProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// カスタムレンダー関数
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: TestProvider, ...options });

// ストアの状態をリセットするヘルパー関数
export const resetStore = () => {
  useAppStore.getState().resetAll();
};

// テスト用のモックデータ
export const mockParticipants = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

export const mockExpenses = [
  {
    id: '1',
    description: 'Dinner',
    amount: 3000,
    payerId: '1',
    currency: 'JPY' as const,
  },
  {
    id: '2',
    description: 'Gas',
    amount: 2000,
    payerId: '2',
    currency: 'JPY' as const,
  },
];

export const mockSettlements = [
  {
    from: 'Bob',
    to: 'Alice',
    amount: 1000,
  },
  {
    from: 'Charlie',
    to: 'Alice',
    amount: 1000,
  },
];

// ストアにテストデータを設定するヘルパー関数
export const setupTestStore = () => {
  const store = useAppStore.getState();

  // ストアをリセット
  store.resetAll();

  // テストデータを追加
  mockParticipants.forEach((participant) => {
    store.addParticipant(participant.name);
  });

  mockExpenses.forEach((expense) => {
    store.addExpense({
      description: expense.description,
      amount: expense.amount,
      payerId: expense.payerId,
      currency: expense.currency,
    });
  });

  return store;
};

export * from '@testing-library/react';
export { customRender as render };
