import { describe, it, expect } from 'vitest';
import {
  ValidationError,
  validateAmount,
  validateParticipantName,
  validateExpenseDescription,
} from '../validation';

describe('ValidationError', () => {
  it('should create error with message', () => {
    const error = new ValidationError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('ValidationError');
    expect(error.field).toBeUndefined();
  });

  it('should create error with message and field', () => {
    const error = new ValidationError('Test error', 'testField');
    expect(error.message).toBe('Test error');
    expect(error.field).toBe('testField');
  });
});

describe('validateAmount', () => {
  it('should not throw for valid positive amounts', () => {
    expect(() => validateAmount(100)).not.toThrow();
    expect(() => validateAmount(0.01)).not.toThrow();
    expect(() => validateAmount(1000000)).not.toThrow();
  });

  it('should throw ValidationError for zero amount', () => {
    expect(() => validateAmount(0)).toThrow(ValidationError);
    expect(() => validateAmount(0)).toThrow(
      '金額は0より大きい値を入力してください',
    );
  });

  it('should throw ValidationError for negative amount', () => {
    expect(() => validateAmount(-100)).toThrow(ValidationError);
    expect(() => validateAmount(-100)).toThrow(
      '金額は0より大きい値を入力してください',
    );
  });

  it('should throw ValidationError for invalid number', () => {
    expect(() => validateAmount(Infinity)).toThrow(ValidationError);
    expect(() => validateAmount(NaN)).toThrow(ValidationError);
    expect(() => validateAmount(Infinity)).toThrow(
      '金額は有効な数値を入力してください',
    );
  });
});

describe('validateParticipantName', () => {
  it('should not throw for valid names', () => {
    expect(() => validateParticipantName('John')).not.toThrow();
    expect(() => validateParticipantName('山田太郎')).not.toThrow();
    expect(() => validateParticipantName('A')).not.toThrow();
  });

  it('should throw ValidationError for empty name', () => {
    expect(() => validateParticipantName('')).toThrow(ValidationError);
    expect(() => validateParticipantName('')).toThrow(
      '参加者名を入力してください',
    );
  });

  it('should throw ValidationError for whitespace-only name', () => {
    expect(() => validateParticipantName('   ')).toThrow(ValidationError);
  });

  it('should throw ValidationError for too long name', () => {
    const longName = 'a'.repeat(51);
    expect(() => validateParticipantName(longName)).toThrow(ValidationError);
    expect(() => validateParticipantName(longName)).toThrow(
      '参加者名は50文字以内で入力してください',
    );
  });
});

describe('validateExpenseDescription', () => {
  it('should not throw for valid descriptions', () => {
    expect(() => validateExpenseDescription('Lunch')).not.toThrow();
    expect(() => validateExpenseDescription('ランチ代')).not.toThrow();
    expect(() => validateExpenseDescription('A')).not.toThrow();
  });

  it('should throw ValidationError for empty description', () => {
    expect(() => validateExpenseDescription('')).toThrow(ValidationError);
    expect(() => validateExpenseDescription('')).toThrow(
      '支出の説明を入力してください',
    );
  });

  it('should throw ValidationError for whitespace-only description', () => {
    expect(() => validateExpenseDescription('   ')).toThrow(ValidationError);
  });

  it('should throw ValidationError for too long description', () => {
    const longDescription = 'a'.repeat(101);
    expect(() => validateExpenseDescription(longDescription)).toThrow(
      ValidationError,
    );
    expect(() => validateExpenseDescription(longDescription)).toThrow(
      '支出の説明は100文字以内で入力してください',
    );
  });
});
