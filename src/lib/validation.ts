import { expenseSchema, participantSchema } from './schemas';
import { z } from 'zod';

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateParticipant = (participant: unknown): boolean => {
  try {
    participantSchema.parse(participant);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        error.issues[0]?.message || 'Invalid participant data',
        error.issues[0]?.path[0]?.toString(),
      );
    }
    throw error;
  }
};

export const validateExpense = (expense: unknown): boolean => {
  try {
    expenseSchema.parse(expense);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        error.issues[0]?.message || 'Invalid expense data',
        error.issues[0]?.path[0]?.toString(),
      );
    }
    throw error;
  }
};

export const validateAmount = (amount: number): boolean => {
  if (amount <= 0) {
    throw new ValidationError('Amount must be greater than 0', 'amount');
  }
  if (!Number.isFinite(amount)) {
    throw new ValidationError('Amount must be a valid number', 'amount');
  }
  return true;
};

export const validateParticipantName = (name: string): boolean => {
  if (!name || name.trim().length === 0) {
    throw new ValidationError('Participant name cannot be empty', 'name');
  }
  if (name.length > 50) {
    throw new ValidationError(
      'Participant name must be 50 characters or less',
      'name',
    );
  }
  return true;
};

export const validateExpenseDescription = (description: string): boolean => {
  if (!description || description.trim().length === 0) {
    throw new ValidationError(
      'Expense description cannot be empty',
      'description',
    );
  }
  if (description.length > 100) {
    throw new ValidationError(
      'Expense description must be 100 characters or less',
      'description',
    );
  }
  return true;
};
