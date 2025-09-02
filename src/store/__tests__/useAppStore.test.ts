import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../useAppStore';
import { CURRENCIES } from '@/lib/constants';

describe('useAppStore', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    useAppStore.getState().resetAll();
  });

  describe('initial state', () => {
    it('should have empty initial state', () => {
      const state = useAppStore.getState();

      expect(state.participants).toEqual([]);
      expect(state.expenses).toEqual([]);
      expect(state.settlements).toEqual([]);
    });
  });

  describe('participants', () => {
    it('should add participant', () => {
      const { addParticipant } = useAppStore.getState();

      addParticipant('Alice');

      const state = useAppStore.getState();
      expect(state.participants).toHaveLength(1);
      expect(state.participants[0].name).toBe('Alice');
      expect(state.participants[0].id).toBeDefined();
    });

    it('should not add participant with empty name', () => {
      const { addParticipant } = useAppStore.getState();

      addParticipant('');
      addParticipant('   ');

      const state = useAppStore.getState();
      expect(state.participants).toHaveLength(0);
    });

    it('should trim participant name', () => {
      const { addParticipant } = useAppStore.getState();

      addParticipant('  Bob  ');

      const state = useAppStore.getState();
      expect(state.participants[0].name).toBe('Bob');
    });

    it('should remove participant', () => {
      const { addParticipant, removeParticipant } = useAppStore.getState();

      addParticipant('Alice');
      addParticipant('Bob');

      const state1 = useAppStore.getState();
      const participantId = state1.participants[0].id;

      removeParticipant(participantId);

      const state2 = useAppStore.getState();
      expect(state2.participants).toHaveLength(1);
      expect(state2.participants[0].name).toBe('Bob');
    });

    it('should remove related expenses when participant is removed', () => {
      const { addParticipant, addExpense, removeParticipant } =
        useAppStore.getState();

      addParticipant('Alice');
      addParticipant('Bob');

      const state1 = useAppStore.getState();
      const aliceId = state1.participants[0].id;
      const bobId = state1.participants[1].id;

      addExpense({
        description: 'Dinner',
        amount: 3000,
        payerId: aliceId,
        currency: CURRENCIES.JPY,
      });

      addExpense({
        description: 'Gas',
        amount: 2000,
        payerId: bobId,
        currency: CURRENCIES.JPY,
      });

      const state2 = useAppStore.getState();
      expect(state2.expenses).toHaveLength(2);

      removeParticipant(aliceId);

      const state3 = useAppStore.getState();
      expect(state3.expenses).toHaveLength(1);
      expect(state3.expenses[0].payerId).toBe(bobId);
    });
  });

  describe('expenses', () => {
    it('should add expense', () => {
      const { addParticipant, addExpense } = useAppStore.getState();

      addParticipant('Alice');
      const state1 = useAppStore.getState();
      const participantId = state1.participants[0].id;

      addExpense({
        description: 'Dinner',
        amount: 3000,
        payerId: participantId,
        currency: CURRENCIES.JPY,
      });

      const state2 = useAppStore.getState();
      expect(state2.expenses).toHaveLength(1);
      expect(state2.expenses[0].description).toBe('Dinner');
      expect(state2.expenses[0].amount).toBe(3000);
      expect(state2.expenses[0].payerId).toBe(participantId);
      expect(state2.expenses[0].currency).toBe(CURRENCIES.JPY);
    });

    it('should remove expense', () => {
      const { addParticipant, addExpense, removeExpense } =
        useAppStore.getState();

      addParticipant('Alice');
      const state1 = useAppStore.getState();
      const participantId = state1.participants[0].id;

      addExpense({
        description: 'Dinner',
        amount: 3000,
        payerId: participantId,
        currency: CURRENCIES.JPY,
      });

      const state2 = useAppStore.getState();
      const expenseId = state2.expenses[0].id;

      removeExpense(expenseId);

      const state3 = useAppStore.getState();
      expect(state3.expenses).toHaveLength(0);
    });
  });

  describe('settlements', () => {
    it('should calculate settlements automatically when participants are added', () => {
      const { addParticipant, addExpense } = useAppStore.getState();

      addParticipant('Alice');
      addParticipant('Bob');

      const state1 = useAppStore.getState();
      const aliceId = state1.participants[0].id;

      addExpense({
        description: 'Dinner',
        amount: 3000,
        payerId: aliceId,
        currency: CURRENCIES.JPY,
      });

      const state2 = useAppStore.getState();
      expect(state2.settlements).toHaveLength(1);
      expect(state2.settlements[0].from).toBe('Bob');
      expect(state2.settlements[0].to).toBe('Alice');
      expect(state2.settlements[0].amount).toBe(1500);
    });

    it('should recalculate settlements when expenses are removed', () => {
      const { addParticipant, addExpense, removeExpense } =
        useAppStore.getState();

      addParticipant('Alice');
      addParticipant('Bob');

      const state1 = useAppStore.getState();
      const aliceId = state1.participants[0].id;

      addExpense({
        description: 'Dinner',
        amount: 3000,
        payerId: aliceId,
        currency: CURRENCIES.JPY,
      });

      const state2 = useAppStore.getState();
      expect(state2.settlements).toHaveLength(1);

      removeExpense(state2.expenses[0].id);

      const state3 = useAppStore.getState();
      expect(state3.settlements).toHaveLength(0);
    });

    it('should calculate settlements manually', () => {
      const { addParticipant, addExpense, calculateSettlements } =
        useAppStore.getState();

      addParticipant('Alice');
      addParticipant('Bob');

      const state1 = useAppStore.getState();
      const aliceId = state1.participants[0].id;

      addExpense({
        description: 'Dinner',
        amount: 3000,
        payerId: aliceId,
        currency: CURRENCIES.JPY,
      });

      // 手動で精算を計算
      calculateSettlements();

      const state2 = useAppStore.getState();
      expect(state2.settlements).toHaveLength(1);
    });
  });

  describe('resetAll', () => {
    it('should reset all state', () => {
      const { addParticipant, addExpense, resetAll } = useAppStore.getState();

      addParticipant('Alice');
      addParticipant('Bob');

      const state1 = useAppStore.getState();
      const aliceId = state1.participants[0].id;

      addExpense({
        description: 'Dinner',
        amount: 3000,
        payerId: aliceId,
        currency: CURRENCIES.JPY,
      });

      const state2 = useAppStore.getState();
      expect(state2.participants).toHaveLength(2);
      expect(state2.expenses).toHaveLength(1);
      expect(state2.settlements).toHaveLength(1);

      resetAll();

      const state3 = useAppStore.getState();
      expect(state3.participants).toHaveLength(0);
      expect(state3.expenses).toHaveLength(0);
      expect(state3.settlements).toHaveLength(0);
    });
  });
});
