import { describe, it, expect } from 'vitest';
import {
  calculateSettlements,
  calculateTotalAmount,
  calculatePerPersonAmount,
} from '../settlement';
import { Participant, Expense } from '@/types';
import { CURRENCIES } from '../constants';

describe('settlement', () => {
  const mockParticipants: Participant[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  describe('calculateTotalAmount', () => {
    it('should calculate total amount correctly', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          description: 'Dinner',
          amount: 3000,
          payerId: '1',
          currency: CURRENCIES.JPY,
        },
        {
          id: '2',
          description: 'Gas',
          amount: 2000,
          payerId: '2',
          currency: CURRENCIES.JPY,
        },
      ];

      expect(calculateTotalAmount(expenses)).toBe(5000);
    });

    it('should return 0 for empty expenses', () => {
      expect(calculateTotalAmount([])).toBe(0);
    });
  });

  describe('calculatePerPersonAmount', () => {
    it('should calculate per person amount correctly', () => {
      expect(calculatePerPersonAmount(6000, 3)).toBe(2000);
      expect(calculatePerPersonAmount(1000, 2)).toBe(500);
    });

    it('should return 0 for zero participants', () => {
      expect(calculatePerPersonAmount(1000, 0)).toBe(0);
    });

    it('should handle decimal amounts', () => {
      expect(calculatePerPersonAmount(1000, 3)).toBeCloseTo(333.33, 2);
    });
  });

  describe('calculateSettlements', () => {
    it('should return empty array for no participants', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          description: 'Dinner',
          amount: 3000,
          payerId: '1',
          currency: CURRENCIES.JPY,
        },
      ];

      expect(calculateSettlements([], expenses)).toEqual([]);
    });

    it('should return empty array for no expenses', () => {
      expect(calculateSettlements(mockParticipants, [])).toEqual([]);
    });

    it('should calculate simple settlement correctly', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          description: 'Dinner',
          amount: 3000,
          payerId: '1',
          currency: CURRENCIES.JPY,
        },
      ];

      const settlements = calculateSettlements(mockParticipants, expenses);

      expect(settlements).toHaveLength(2);
      expect(settlements[0]).toEqual({
        from: 'Bob',
        to: 'Alice',
        amount: 1000,
      });
      expect(settlements[1]).toEqual({
        from: 'Charlie',
        to: 'Alice',
        amount: 1000,
      });
    });

    it('should handle complex settlement scenario', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          description: 'Dinner',
          amount: 6000,
          payerId: '1',
          currency: CURRENCIES.JPY,
        },
        {
          id: '2',
          description: 'Gas',
          amount: 3000,
          payerId: '2',
          currency: CURRENCIES.JPY,
        },
        {
          id: '3',
          description: 'Hotel',
          amount: 9000,
          payerId: '3',
          currency: CURRENCIES.JPY,
        },
      ];

      const settlements = calculateSettlements(mockParticipants, expenses);

      // Total: 18000, Per person: 6000
      // Alice paid: 6000, Bob paid: 3000, Charlie paid: 9000
      // Alice balance: 0, Bob balance: -3000, Charlie balance: +3000
      expect(settlements).toHaveLength(1);
      expect(settlements[0]).toEqual({
        from: 'Bob',
        to: 'Charlie',
        amount: 3000,
      });
    });

    it('should handle equal payments (no settlement needed)', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          description: 'Dinner',
          amount: 3000,
          payerId: '1',
          currency: CURRENCIES.JPY,
        },
        {
          id: '2',
          description: 'Gas',
          amount: 3000,
          payerId: '2',
          currency: CURRENCIES.JPY,
        },
        {
          id: '3',
          description: 'Hotel',
          amount: 3000,
          payerId: '3',
          currency: CURRENCIES.JPY,
        },
      ];

      const settlements = calculateSettlements(mockParticipants, expenses);
      expect(settlements).toEqual([]);
    });

    it('should handle single participant', () => {
      const singleParticipant = [mockParticipants[0]];
      const expenses: Expense[] = [
        {
          id: '1',
          description: 'Dinner',
          amount: 3000,
          payerId: '1',
          currency: CURRENCIES.JPY,
        },
      ];

      const settlements = calculateSettlements(singleParticipant, expenses);
      expect(settlements).toEqual([]);
    });

    it('should round settlement amounts', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          description: 'Dinner',
          amount: 1000,
          payerId: '1',
          currency: CURRENCIES.JPY,
        },
      ];

      const settlements = calculateSettlements(mockParticipants, expenses);

      // Total: 1000, Per person: 333.33...
      // Alice paid: 1000, Bob paid: 0, Charlie paid: 0
      // Alice balance: +666.67, Bob balance: -333.33, Charlie balance: -333.33
      expect(settlements).toHaveLength(2);
      expect(settlements[0].amount).toBe(333);
      expect(settlements[1].amount).toBe(334);
    });
  });
});
