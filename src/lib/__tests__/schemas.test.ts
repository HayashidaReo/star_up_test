import { describe, it, expect } from 'vitest';
import {
  validateParticipantSafe,
  validateExpenseSafe,
  participantSchema,
  expenseSchema,
  isValidString,
  isValidNumber,
} from '../schemas';
import { CURRENCIES } from '../constants';

describe('schemas', () => {
  describe('participantSchema', () => {
    it('有効な参加者データを受け入れる', () => {
      const validData = { name: '田中太郎' };
      const result = participantSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('田中太郎');
      }
    });

    it('空文字列を拒否する', () => {
      const invalidData = { name: '' };
      const result = participantSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '参加者名を入力してください',
        );
      }
    });

    it('空白のみの文字列を拒否する', () => {
      const invalidData = { name: '   ' };
      const result = participantSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('50文字を超える名前を拒否する', () => {
      const longName = 'a'.repeat(51);
      const invalidData = { name: longName };
      const result = participantSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '参加者名は50文字以内で入力してください',
        );
      }
    });

    it('前後の空白を削除する', () => {
      const dataWithSpaces = { name: '  田中太郎  ' };
      const result = participantSchema.safeParse(dataWithSpaces);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('田中太郎');
      }
    });
  });

  describe('expenseSchema', () => {
    const validExpenseData = {
      description: '夕食代',
      amount: '5000',
      payerId: 'user123',
      currency: CURRENCIES.JPY,
    };

    it('有効な費用データを受け入れる', () => {
      const result = expenseSchema.safeParse(validExpenseData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe('夕食代');
        expect(result.data.amount).toBe('5000');
        expect(result.data.payerId).toBe('user123');
        expect(result.data.currency).toBe(CURRENCIES.JPY);
      }
    });

    it('空の内容を拒否する', () => {
      const invalidData = { ...validExpenseData, description: '' };
      const result = expenseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('内容を入力してください');
      }
    });

    it('無効な金額を拒否する', () => {
      const invalidData = { ...validExpenseData, amount: 'abc' };
      const result = expenseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '有効な数値を入力してください',
        );
      }
    });

    it('負の金額を拒否する', () => {
      const invalidData = { ...validExpenseData, amount: '-100' };
      const result = expenseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '有効な数値を入力してください',
        );
      }
    });

    it('0の金額を拒否する', () => {
      const invalidData = { ...validExpenseData, amount: '0' };
      const result = expenseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '有効な数値を入力してください',
        );
      }
    });

    it('空の支払者IDを拒否する', () => {
      const invalidData = { ...validExpenseData, payerId: '' };
      const result = expenseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('支払者を選択してください');
      }
    });

    it('無効な通貨を拒否する', () => {
      const invalidData = { ...validExpenseData, currency: 'INVALID' };
      const result = expenseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '有効な通貨を選択してください',
        );
      }
    });
  });

  describe('validateParticipant', () => {
    it('有効なデータでsafeparseを実行する', () => {
      const result = validateParticipantSafe({ name: '田中太郎' });
      expect(result.success).toBe(true);
    });

    it('無効なデータでsafeparseを実行する', () => {
      const result = validateParticipantSafe({ name: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('validateExpense', () => {
    it('有効なデータでsafeparseを実行する', () => {
      const validData = {
        description: '夕食代',
        amount: '5000',
        payerId: 'user123',
        currency: CURRENCIES.JPY,
      };
      const result = validateExpenseSafe(validData);
      expect(result.success).toBe(true);
    });

    it('無効なデータでsafeparseを実行する', () => {
      const invalidData = {
        description: '',
        amount: 'abc',
        payerId: '',
        currency: 'INVALID',
      };
      const result = validateExpenseSafe(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('isValidString', () => {
    it('有効な文字列を受け入れる', () => {
      expect(isValidString('有効な文字列')).toBe(true);
    });

    it('空文字列を拒否する', () => {
      expect(isValidString('')).toBe(false);
    });

    it('空白のみの文字列を拒否する', () => {
      expect(isValidString('   ')).toBe(false);
    });
  });

  describe('isValidNumber', () => {
    it('有効な数値文字列を受け入れる', () => {
      expect(isValidNumber('100')).toBe(true);
      expect(isValidNumber('999.99')).toBe(true);
    });

    it('有効な数値を受け入れる', () => {
      expect(isValidNumber(100)).toBe(true);
      expect(isValidNumber(999.99)).toBe(true);
    });

    it('無効な文字列を拒否する', () => {
      expect(isValidNumber('abc')).toBe(false);
    });

    it('負の数値を拒否する', () => {
      expect(isValidNumber('-100')).toBe(false);
      expect(isValidNumber(-100)).toBe(false);
    });

    it('ゼロを拒否する', () => {
      expect(isValidNumber('0')).toBe(false);
      expect(isValidNumber(0)).toBe(false);
    });
  });
});
