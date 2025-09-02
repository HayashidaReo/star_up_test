import { describe, it, expect } from 'vitest';
import {
  ValidationError,
  validateParticipant,
  validateExpense,
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

describe('validateParticipant', () => {
  it('should return true for valid participant', () => {
    const validParticipant = { name: 'John Doe' };
    expect(validateParticipant(validParticipant)).toBe(true);
  });

  it('should throw ValidationError for invalid participant', () => {
    const invalidParticipant = { name: '' };
    expect(() => validateParticipant(invalidParticipant)).toThrow(
      ValidationError,
    );
  });

  it('should throw ValidationError for participant with long name', () => {
    const longName = 'a'.repeat(51);
    const invalidParticipant = { name: longName };
    expect(() => validateParticipant(invalidParticipant)).toThrow(
      ValidationError,
    );
  });

  it('should throw ValidationError for missing name', () => {
    const invalidParticipant = {};
    expect(() => validateParticipant(invalidParticipant)).toThrow(
      ValidationError,
    );
  });
});

describe('validateExpense', () => {
  it('should return true for valid expense', () => {
    const validExpense = {
      description: 'Test expense',
      amount: '100',
      currency: 'JPY',
      payerId: '1',
    };
    expect(validateExpense(validExpense)).toBe(true);
  });

  it('should throw ValidationError for invalid expense', () => {
    const invalidExpense = {
      description: '',
      amount: 100,
      currency: 'JPY',
      payerId: '1',
    };
    expect(() => validateExpense(invalidExpense)).toThrow(ValidationError);
  });

  it('should throw ValidationError for negative amount', () => {
    const invalidExpense = {
      description: 'Test',
      amount: -100,
      currency: 'JPY',
      payerId: '1',
    };
    expect(() => validateExpense(invalidExpense)).toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid currency', () => {
    const invalidExpense = {
      description: 'Test',
      amount: 100,
      currency: 'INVALID',
      payerId: '1',
    };
    expect(() => validateExpense(invalidExpense)).toThrow(ValidationError);
  });
});

describe('validateAmount', () => {
  it('should return true for valid positive amount', () => {
    expect(validateAmount(100)).toBe(true);
    expect(validateAmount(0.01)).toBe(true);
    expect(validateAmount(1000000)).toBe(true);
  });

  it('should throw ValidationError for zero amount', () => {
    expect(() => validateAmount(0)).toThrow(ValidationError);
    expect(() => validateAmount(0)).toThrow('Amount must be greater than 0');
  });

  it('should throw ValidationError for negative amount', () => {
    expect(() => validateAmount(-100)).toThrow(ValidationError);
    expect(() => validateAmount(-100)).toThrow('Amount must be greater than 0');
  });

  it('should throw ValidationError for invalid number', () => {
    expect(() => validateAmount(Infinity)).toThrow(ValidationError);
    expect(() => validateAmount(NaN)).toThrow(ValidationError);
    expect(() => validateAmount(Infinity)).toThrow(
      'Amount must be a valid number',
    );
  });
});

describe('validateParticipantName', () => {
  it('should return true for valid name', () => {
    expect(validateParticipantName('John')).toBe(true);
    expect(validateParticipantName('山田太郎')).toBe(true);
    expect(validateParticipantName('A')).toBe(true);
  });

  it('should throw ValidationError for empty name', () => {
    expect(() => validateParticipantName('')).toThrow(ValidationError);
    expect(() => validateParticipantName('')).toThrow(
      'Participant name cannot be empty',
    );
  });

  it('should throw ValidationError for whitespace-only name', () => {
    expect(() => validateParticipantName('   ')).toThrow(ValidationError);
  });

  it('should throw ValidationError for too long name', () => {
    const longName = 'a'.repeat(51);
    expect(() => validateParticipantName(longName)).toThrow(ValidationError);
    expect(() => validateParticipantName(longName)).toThrow(
      'Participant name must be 50 characters or less',
    );
  });
});

describe('validateExpenseDescription', () => {
  it('should return true for valid description', () => {
    expect(validateExpenseDescription('Lunch')).toBe(true);
    expect(validateExpenseDescription('ランチ代')).toBe(true);
    expect(validateExpenseDescription('A')).toBe(true);
  });

  it('should throw ValidationError for empty description', () => {
    expect(() => validateExpenseDescription('')).toThrow(ValidationError);
    expect(() => validateExpenseDescription('')).toThrow(
      'Expense description cannot be empty',
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
      'Expense description must be 100 characters or less',
    );
  });
});
