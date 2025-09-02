import { describe, it, expect, beforeEach } from 'vitest';
import {
  useAppStore,
  participantsSelector,
  expensesSelector,
  settlementsSelector,
  participantCountSelector,
  expenseCountSelector,
  totalAmountSelector,
  hasParticipantsSelector,
  hasExpensesSelector,
  createParticipantByIdSelector,
  createExpenseByIdSelector,
} from '../useAppStore';
import { CURRENCIES } from '@/lib/constants';

describe('useAppStore selectors', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    useAppStore.getState().resetAll();
  });

  describe('基本的なセレクター', () => {
    it('participantsSelector は参加者配列を返す', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');

      const participants = participantsSelector(useAppStore.getState());
      expect(participants).toHaveLength(1);
      expect(participants[0].name).toBe('田中太郎');
    });

    it('expensesSelector は費用配列を返す', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');
      const participants = store.participants;

      store.addExpense({
        description: '夕食代',
        amount: 5000,
        payerId: participants[0].id,
        currency: CURRENCIES.JPY,
      });

      const expenses = expensesSelector(useAppStore.getState());
      expect(expenses).toHaveLength(1);
      expect(expenses[0].description).toBe('夕食代');
    });

    it('settlementsSelector は精算配列を返す', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');
      store.addParticipant('佐藤花子');

      const settlements = settlementsSelector(useAppStore.getState());
      expect(Array.isArray(settlements)).toBe(true);
    });
  });

  describe('アクションセレクター', () => {
    it('ストアから直接アクションを取得できる', () => {
      const store = useAppStore.getState();

      expect(typeof store.addParticipant).toBe('function');
      expect(typeof store.removeParticipant).toBe('function');
      expect(typeof store.addExpense).toBe('function');
      expect(typeof store.removeExpense).toBe('function');
    });
  });

  describe('コンポーネント用セレクター', () => {
    it('個別のセレクターとストアアクションを組み合わせて使用できる', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');

      const participants = participantsSelector(useAppStore.getState());

      expect(Array.isArray(participants)).toBe(true);
      expect(participants).toHaveLength(1);
      expect(typeof store.addParticipant).toBe('function');
      expect(typeof store.removeParticipant).toBe('function');
    });

    it('費用関連の個別セレクターとストアアクションを組み合わせて使用できる', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');

      const participants = participantsSelector(useAppStore.getState());
      const expenses = expensesSelector(useAppStore.getState());

      expect(Array.isArray(participants)).toBe(true);
      expect(Array.isArray(expenses)).toBe(true);
      expect(typeof store.addExpense).toBe('function');
      expect(typeof store.removeExpense).toBe('function');
    });

    it('精算関連の個別セレクターを組み合わせて使用できる', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');
      store.addParticipant('佐藤花子');

      const participants = participantsSelector(useAppStore.getState());
      const expenses = expensesSelector(useAppStore.getState());
      const settlements = settlementsSelector(useAppStore.getState());

      expect(Array.isArray(participants)).toBe(true);
      expect(Array.isArray(expenses)).toBe(true);
      expect(Array.isArray(settlements)).toBe(true);
      expect(participants).toHaveLength(2);
    });
  });

  describe('セレクターのパフォーマンス最適化', () => {
    it('参加者データが変更されていない場合、同じ参照を返す', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');

      const first = participantsSelector(useAppStore.getState());
      const second = participantsSelector(useAppStore.getState());

      // 同じ参照を返すことを確認（浅い比較でパフォーマンス最適化）
      expect(first).toBe(second);
    });

    it('費用データが変更されていない場合、同じ参照を返す', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');

      const first = expensesSelector(useAppStore.getState());
      const second = expensesSelector(useAppStore.getState());

      expect(first).toBe(second);
    });
  });

  describe('セレクターの組み合わせテスト', () => {
    it('複数のセレクターを組み合わせて使用できる', () => {
      const store = useAppStore.getState();

      // データを追加
      store.addParticipant('田中太郎');
      store.addParticipant('佐藤花子');

      const participants = store.participants;
      store.addExpense({
        description: 'ランチ代',
        amount: 3000,
        payerId: participants[0].id,
        currency: CURRENCIES.JPY,
      });

      // 各セレクターでデータを取得
      const participantsData = participantsSelector(useAppStore.getState());
      const expensesData = expensesSelector(useAppStore.getState());
      const settlementsData = settlementsSelector(useAppStore.getState());

      expect(participantsData).toHaveLength(2);
      expect(expensesData).toHaveLength(1);
      expect(Array.isArray(settlementsData)).toBe(true);
    });
  });

  describe('計算済みセレクター', () => {
    it('participantCountSelector は参加者数を返す', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');
      store.addParticipant('佐藤花子');

      const count = participantCountSelector(useAppStore.getState());
      expect(count).toBe(2);
    });

    it('expenseCountSelector は費用数を返す', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');
      const participants = store.participants;

      store.addExpense({
        description: 'ランチ代',
        amount: 1000,
        payerId: participants[0].id,
        currency: CURRENCIES.JPY,
      });

      const count = expenseCountSelector(useAppStore.getState());
      expect(count).toBe(1);
    });

    it('totalAmountSelector は合計金額を返す', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');
      const participants = store.participants;

      store.addExpense({
        description: 'ランチ代',
        amount: 1000,
        payerId: participants[0].id,
        currency: CURRENCIES.JPY,
      });

      store.addExpense({
        description: 'ディナー代',
        amount: 2000,
        payerId: participants[0].id,
        currency: CURRENCIES.JPY,
      });

      const total = totalAmountSelector(useAppStore.getState());
      expect(total).toBe(3000);
    });

    it('hasParticipantsSelector は参加者の存在を確認する', () => {
      const store = useAppStore.getState();

      let hasParticipants = hasParticipantsSelector(useAppStore.getState());
      expect(hasParticipants).toBe(false);

      store.addParticipant('田中太郎');
      hasParticipants = hasParticipantsSelector(useAppStore.getState());
      expect(hasParticipants).toBe(true);
    });

    it('hasExpensesSelector は費用の存在を確認する', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');

      let hasExpenses = hasExpensesSelector(useAppStore.getState());
      expect(hasExpenses).toBe(false);

      const participants = store.participants;
      store.addExpense({
        description: 'ランチ代',
        amount: 1000,
        payerId: participants[0].id,
        currency: CURRENCIES.JPY,
      });

      hasExpenses = hasExpensesSelector(useAppStore.getState());
      expect(hasExpenses).toBe(true);
    });
  });

  describe('動的セレクター', () => {
    it('createParticipantByIdSelector は特定IDの参加者を返す', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');
      store.addParticipant('佐藤花子');

      const participants = store.participants;
      const targetId = participants[0].id;

      const participant = createParticipantByIdSelector(targetId)(
        useAppStore.getState(),
      );
      expect(participant).toBeDefined();
      expect(participant?.name).toBe('田中太郎');
    });

    it('createExpenseByIdSelector は特定IDの費用を返す', () => {
      const store = useAppStore.getState();
      store.addParticipant('田中太郎');
      const participants = store.participants;

      store.addExpense({
        description: 'ランチ代',
        amount: 1000,
        payerId: participants[0].id,
        currency: CURRENCIES.JPY,
      });

      const expenses = store.expenses;
      const targetId = expenses[0].id;

      const expense = createExpenseByIdSelector(targetId)(
        useAppStore.getState(),
      );
      expect(expense).toBeDefined();
      expect(expense?.description).toBe('ランチ代');
    });
  });
});
