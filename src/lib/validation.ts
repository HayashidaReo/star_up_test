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
    throw new ValidationError(
      '金額は0より大きい値を入力してください',
      'amount',
    );
  }
  if (!Number.isFinite(amount)) {
    throw new ValidationError('金額は有効な数値を入力してください', 'amount');
  }
};

export const validateParticipantName = (name: string): void => {
  if (!name || name.trim().length === 0) {
    throw new ValidationError('参加者名を入力してください', 'name');
  }
  if (name.length > 50) {
    throw new ValidationError('参加者名は50文字以内で入力してください', 'name');
  }
};

export const validateExpenseDescription = (description: string): void => {
  if (!description || description.trim().length === 0) {
    throw new ValidationError('支出の説明を入力してください', 'description');
  }
  if (description.length > 100) {
    throw new ValidationError(
      '支出の説明は100文字以内で入力してください',
      'description',
    );
  }
};
