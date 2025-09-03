import { describe, it, expect } from 'vitest';
import {
  ParticipantEntity,
  ExpenseEntity,
  SettlementEntity,
} from '../entities';
import { Participant, Expense, Settlement } from '@/types';
import { CURRENCIES } from '@/lib/constants';

describe('Domain Entities', () => {
  describe('ParticipantEntity', () => {
    it('should validate participant names correctly', () => {
      const validParticipant: Participant = { id: '1', name: 'Alice' };
      const entity = new ParticipantEntity(validParticipant);

      expect(entity.isValidName()).toBe(true);
      expect(entity.id).toBe('1');
      expect(entity.name).toBe('Alice');
    });

    it('should reject empty names', () => {
      const invalidParticipant: Participant = { id: '1', name: '' };
      const entity = new ParticipantEntity(invalidParticipant);

      expect(entity.isValidName()).toBe(false);
    });

    it('should reject whitespace-only names', () => {
      const invalidParticipant: Participant = { id: '1', name: '   ' };
      const entity = new ParticipantEntity(invalidParticipant);

      expect(entity.isValidName()).toBe(false);
    });

    it('should return immutable data copy', () => {
      const participant: Participant = { id: '1', name: 'Alice' };
      const entity = new ParticipantEntity(participant);
      const data = entity.toData();

      expect(data).toEqual(participant);
      expect(data).not.toBe(participant); // 異なるオブジェクト参照
    });
  });

  describe('ExpenseEntity', () => {
    it('should validate expenses correctly', () => {
      const validExpense: Expense = {
        id: '1',
        description: 'Lunch',
        amount: 1000,
        payerId: 'user1',
        currency: CURRENCIES.JPY,
      };
      const entity = new ExpenseEntity(validExpense);

      expect(entity.isValid()).toBe(true);
      expect(entity.id).toBe('1');
      expect(entity.amount).toBe(1000);
      expect(entity.payerId).toBe('user1');
      expect(entity.description).toBe('Lunch');
      expect(entity.currency).toBe(CURRENCIES.JPY);
    });

    it('should reject zero or negative amounts', () => {
      const invalidExpense: Expense = {
        id: '1',
        description: 'Lunch',
        amount: 0,
        payerId: 'user1',
        currency: CURRENCIES.JPY,
      };
      const entity = new ExpenseEntity(invalidExpense);

      expect(entity.isValid()).toBe(false);
    });

    it('should reject empty descriptions', () => {
      const invalidExpense: Expense = {
        id: '1',
        description: '',
        amount: 1000,
        payerId: 'user1',
        currency: CURRENCIES.JPY,
      };
      const entity = new ExpenseEntity(invalidExpense);

      expect(entity.isValid()).toBe(false);
    });

    it('should reject empty payerId', () => {
      const invalidExpense: Expense = {
        id: '1',
        description: 'Lunch',
        amount: 1000,
        payerId: '',
        currency: CURRENCIES.JPY,
      };
      const entity = new ExpenseEntity(invalidExpense);

      expect(entity.isValid()).toBe(false);
    });

    it('should reject empty currency', () => {
      const invalidExpense: Expense = {
        id: '1',
        description: 'Lunch',
        amount: 1000,
        payerId: 'user1',
        currency: ' ' as any, // 無効な通貨として空白文字を使用
      };
      const entity = new ExpenseEntity(invalidExpense);

      expect(entity.isValid()).toBe(false);
    });

    it('should return immutable data copy', () => {
      const expense: Expense = {
        id: '1',
        description: 'Lunch',
        amount: 1000,
        payerId: 'user1',
        currency: CURRENCIES.JPY,
      };
      const entity = new ExpenseEntity(expense);
      const data = entity.toData();

      expect(data).toEqual(expense);
      expect(data).not.toBe(expense); // 異なるオブジェクト参照
    });
  });

  describe('SettlementEntity', () => {
    it('should validate settlements correctly', () => {
      const validSettlement: Settlement = {
        from: 'Alice',
        to: 'Bob',
        amount: 1000,
      };
      const entity = new SettlementEntity(validSettlement);

      expect(entity.isValid()).toBe(true);
      expect(entity.from).toBe('Alice');
      expect(entity.to).toBe('Bob');
      expect(entity.amount).toBe(1000);
    });

    it('should reject zero or negative amounts', () => {
      const invalidSettlement: Settlement = {
        from: 'Alice',
        to: 'Bob',
        amount: 0,
      };
      const entity = new SettlementEntity(invalidSettlement);

      expect(entity.isValid()).toBe(false);
    });

    it('should reject empty from field', () => {
      const invalidSettlement: Settlement = {
        from: '',
        to: 'Bob',
        amount: 1000,
      };
      const entity = new SettlementEntity(invalidSettlement);

      expect(entity.isValid()).toBe(false);
    });

    it('should reject empty to field', () => {
      const invalidSettlement: Settlement = {
        from: 'Alice',
        to: '',
        amount: 1000,
      };
      const entity = new SettlementEntity(invalidSettlement);

      expect(entity.isValid()).toBe(false);
    });

    it('should reject self-transfers', () => {
      const invalidSettlement: Settlement = {
        from: 'Alice',
        to: 'Alice',
        amount: 1000,
      };
      const entity = new SettlementEntity(invalidSettlement);

      expect(entity.isValid()).toBe(false);
    });

    it('should return immutable data copy', () => {
      const settlement: Settlement = {
        from: 'Alice',
        to: 'Bob',
        amount: 1000,
      };
      const entity = new SettlementEntity(settlement);
      const data = entity.toData();

      expect(data).toEqual(settlement);
      expect(data).not.toBe(settlement); // 異なるオブジェクト参照
    });
  });
});
