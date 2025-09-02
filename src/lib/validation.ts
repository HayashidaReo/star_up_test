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

export const validateAmount = (amount: number): void => {
  if (amount <= 0) {
    throw new ValidationError('Amount must be greater than 0', 'amount');
  }
  if (!Number.isFinite(amount)) {
    throw new ValidationError('Amount must be a valid number', 'amount');
  }
};

export const validateParticipantName = (name: string): void => {
  if (!name || name.trim().length === 0) {
    throw new ValidationError('Participant name cannot be empty', 'name');
  }
  if (name.length > 50) {
    throw new ValidationError(
      'Participant name must be 50 characters or less',
      'name',
    );
  }
};

export const validateExpenseDescription = (description: string): void => {
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
};
