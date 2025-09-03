import { Participant, Expense, Settlement } from '@/types';

/**
 * 参加者エンティティのドメインロジック
 */
export class ParticipantEntity {
  constructor(private readonly participant: Participant) {}

  get id(): string {
    return this.participant.id;
  }

  get name(): string {
    return this.participant.name;
  }

  /**
   * 参加者名が有効かチェック
   */
  isValidName(): boolean {
    return this.participant.name.trim().length > 0;
  }

  /**
   * 不変オブジェクトとして参加者データを取得
   */
  toData(): Participant {
    return { ...this.participant };
  }
}

/**
 * 費用エンティティのドメインロジック
 */
export class ExpenseEntity {
  constructor(private readonly expense: Expense) {}

  get id(): string {
    return this.expense.id;
  }

  get amount(): number {
    return this.expense.amount;
  }

  get payerId(): string {
    return this.expense.payerId;
  }

  get description(): string {
    return this.expense.description;
  }

  get currency(): string {
    return this.expense.currency;
  }

  /**
   * 費用が有効かチェック
   */
  isValid(): boolean {
    return (
      this.expense.amount > 0 &&
      this.expense.description.trim().length > 0 &&
      this.expense.payerId.trim().length > 0 &&
      this.expense.currency.trim().length > 0
    );
  }

  /**
   * 不変オブジェクトとして費用データを取得
   */
  toData(): Expense {
    return { ...this.expense };
  }
}

/**
 * 精算エンティティのドメインロジック
 */
export class SettlementEntity {
  constructor(private readonly settlement: Settlement) {}

  get from(): string {
    return this.settlement.from;
  }

  get to(): string {
    return this.settlement.to;
  }

  get amount(): number {
    return this.settlement.amount;
  }

  /**
   * 精算が有効かチェック
   */
  isValid(): boolean {
    return (
      this.settlement.from.trim().length > 0 &&
      this.settlement.to.trim().length > 0 &&
      this.settlement.amount > 0 &&
      this.settlement.from !== this.settlement.to
    );
  }

  /**
   * 不変オブジェクトとして精算データを取得
   */
  toData(): Settlement {
    return { ...this.settlement };
  }
}
