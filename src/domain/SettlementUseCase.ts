import { Participant, Expense, Settlement, ConvertedAmount } from '@/types';
import { ConvertCurrencyUseCase } from './ConvertCurrencyUseCase';
import { ParticipantEntity, ExpenseEntity } from './entities';

// 定数定義
const MIN_SETTLEMENTS_FOR_ADJUSTMENT = 2; // 端数調整を行うために必要な最小精算数
const MIN_AMOUNT_THRESHOLD = 0.01; // 最小金額閾値

/**
 * 精算計算のビジネスロジックを担当するユースケース
 * 通貨変換機能を統合した精算計算と基本精算計算の両方を提供
 */
export class SettlementUseCase {
  constructor(
    private readonly convertCurrencyUseCase?: ConvertCurrencyUseCase,
  ) {}

  /**
   * 通貨変換を含む精算計算の実行
   * @param participants - 参加者リスト
   * @param expenses - 費用リスト
   * @param settlementCurrency - 精算通貨コード（省略時は最初の費用の通貨を使用）
   * @returns Promise<{settlements: Settlement[], convertedExpenses: ConvertedAmount[], settlementCurrency: string}>
   */
  async calculateSettlementsWithCurrency(
    participants: Participant[],
    expenses: Expense[],
    settlementCurrency?: string,
  ): Promise<{
    settlements: Settlement[];
    convertedExpenses: ConvertedAmount[];
    settlementCurrency: string;
  }> {
    // ConvertCurrencyUseCaseが提供されていない場合はエラー
    if (!this.convertCurrencyUseCase) {
      throw new Error('通貨変換機能が初期化されていません。ConvertCurrencyUseCaseを提供してください。');
    }

    // 参加者または支出がない場合は空配列を返す
    if (participants.length === 0 || expenses.length === 0) {
      return {
        settlements: [],
        convertedExpenses: [],
        settlementCurrency: settlementCurrency || 'JPY',
      };
    }

    // 精算通貨が指定されていない場合は最初の費用の通貨を使用
    const targetCurrency = settlementCurrency || expenses[0].currency;

    // 全ての費用を指定通貨に変換
    const convertedExpenses = await this.convertCurrencyUseCase.convertExpenses(
      expenses,
      targetCurrency,
    );

    // 変換後の金額で精算計算を実行
    const settlements = this.calculateSettlementsWithConvertedAmounts(
      participants,
      expenses,
      convertedExpenses,
    );

    return {
      settlements,
      convertedExpenses,
      settlementCurrency: targetCurrency,
    };
  }

  /**
   * 精算計算のロジック（変換済み金額ベース）
   * @param participants - 参加者リスト
   * @param expenses - 元の費用リスト（支払者情報取得用）
   * @param convertedExpenses - 変換済み費用リスト（金額計算用）
   */
  private calculateSettlementsWithConvertedAmounts(
    participants: Participant[],
    expenses: Expense[],
    convertedExpenses: ConvertedAmount[],
  ): Settlement[] {
    // === STEP 1: 各参加者の支払い総額を計算 ===
    const payments = new Map<string, number>();
    // 全参加者を0円で初期化
    participants.forEach((p) => payments.set(p.id, 0));

    // 各支出を支払者に集計（変換済み金額を使用）
    expenses.forEach((expense, index) => {
      const convertedAmount = convertedExpenses[index]?.convertedAmount || 0;
      const current = payments.get(expense.payerId) || 0;
      payments.set(expense.payerId, current + convertedAmount);
    });

    // === STEP 2: 一人当たりの負担額を計算 ===
    const totalAmount = Array.from(payments.values()).reduce(
      (sum, amount) => sum + amount,
      0,
    );
    const perPersonAmount = totalAmount / participants.length;

    // === STEP 3: 各参加者の差額（バランス）を計算 ===
    const balances = new Map<string, number>();
    participants.forEach((participant) => {
      const paid = payments.get(participant.id) || 0;
      const balance = paid - perPersonAmount;
      balances.set(participant.id, balance);
    });

    // === STEP 4: 精算リストの生成 ===
    const settlements: Settlement[] = [];

    // バランスを昇順でソート（負債者が先頭、債権者が末尾）
    const sortedBalances = Array.from(balances.entries())
      .map(([id, balance]) => ({ id, balance }))
      .sort((a, b) => a.balance - b.balance);

    // 両端からポインタを使って効率的に精算を計算
    let i = 0; // 負債者（支払う人）のインデックス（左端から）
    let j = sortedBalances.length - 1; // 債権者（受け取る人）のインデックス（右端から）

    // 負債者と債権者が交差するまでループ
    while (i < j) {
      const debtor = sortedBalances[i]; // 現在の負債者
      const creditor = sortedBalances[j]; // 現在の債権者

      // 両方のバランスが0に近い場合（誤差範囲内）は終了
      if (
        Math.abs(debtor.balance) < MIN_AMOUNT_THRESHOLD &&
        Math.abs(creditor.balance) < MIN_AMOUNT_THRESHOLD
      ) {
        break;
      }

      // 参加者IDから名前を取得
      const debtorName =
        participants.find((p) => p.id === debtor.id)?.name || '';
      const creditorName =
        participants.find((p) => p.id === creditor.id)?.name || '';

      // 精算額を決定: 負債者の負債額と債権者の債権額の小さい方
      const exactAmount = Math.min(-debtor.balance, creditor.balance);
      const roundedAmount = Math.round(exactAmount);

      // 精算額が1円以上の場合のみ精算リストに追加
      if (roundedAmount > 0) {
        settlements.push({
          from: debtorName,
          to: creditorName,
          amount: roundedAmount,
        });
      }

      // 精算後のバランスを更新
      debtor.balance += exactAmount; // 負債者の負債を減らす
      creditor.balance -= exactAmount; // 債権者の債権を減らす

      // バランスが0に近くなったらポインタを移動
      if (Math.abs(debtor.balance) < MIN_AMOUNT_THRESHOLD) i++; // 次の負債者へ
      if (Math.abs(creditor.balance) < MIN_AMOUNT_THRESHOLD) j--; // 次の債権者へ
    }

    // === STEP 5: 端数調整 ===
    if (settlements.length >= MIN_SETTLEMENTS_FOR_ADJUSTMENT) {
      const totalPayments = settlements.reduce((sum, s) => sum + s.amount, 0);
      const expectedTotal = Math.round(
        Array.from(balances.values()).reduce(
          (sum, v) => (v > 0 ? sum + v : sum),
          0,
        ),
      );
      const difference = expectedTotal - totalPayments;

      // 1円の誤差がある場合のみ調整
      if (Math.abs(difference) === 1) {
        const lastIndex = settlements.length - 1;
        settlements[lastIndex] = {
          ...settlements[lastIndex],
          amount: settlements[lastIndex].amount + difference,
        };
      }
    }

    return settlements;
  }

  /**
   * 従来の精算計算ロジック（後方互換性のため残置）
   */
  calculateSettlementsLegacy(
    participants: Participant[],
    expenses: Expense[],
  ): Settlement[] {
    // 参加者または支出がない場合は空配列を返す
    if (participants.length === 0 || expenses.length === 0) {
      return [];
    }

    // === STEP 1: 各参加者の支払い総額を計算 ===
    const payments = new Map<string, number>();
    // 全参加者を0円で初期化
    participants.forEach((p) => payments.set(p.id, 0));

    // 各支出を支払者に集計
    expenses.forEach((expense) => {
      const current = payments.get(expense.payerId) || 0;
      payments.set(expense.payerId, current + expense.amount);
    });

    // === STEP 2: 一人当たりの負担額を計算 ===
    const totalAmount = Array.from(payments.values()).reduce(
      (sum, amount) => sum + amount,
      0,
    );
    const perPersonAmount = totalAmount / participants.length;

    // === STEP 3: 各参加者の差額（バランス）を計算 ===
    const balances = new Map<string, number>();
    participants.forEach((participant) => {
      const paid = payments.get(participant.id) || 0;
      const balance = paid - perPersonAmount;
      balances.set(participant.id, balance);
    });

    // === STEP 4: 精算リストの生成 ===
    const settlements: Settlement[] = [];

    // バランスを昇順でソート（負債者が先頭、債権者が末尾）
    const sortedBalances = Array.from(balances.entries())
      .map(([id, balance]) => ({ id, balance }))
      .sort((a, b) => a.balance - b.balance);

    // 両端からポインタを使って効率的に精算を計算
    let i = 0; // 負債者（支払う人）のインデックス（左端から）
    let j = sortedBalances.length - 1; // 債権者（受け取る人）のインデックス（右端から）

    // 負債者と債権者が交差するまでループ
    while (i < j) {
      const debtor = sortedBalances[i]; // 現在の負債者
      const creditor = sortedBalances[j]; // 現在の債権者

      // 両方のバランスが0に近い場合（誤差範囲内）は終了
      if (
        Math.abs(debtor.balance) < MIN_AMOUNT_THRESHOLD &&
        Math.abs(creditor.balance) < MIN_AMOUNT_THRESHOLD
      ) {
        break;
      }

      // 参加者IDから名前を取得
      const debtorName =
        participants.find((p) => p.id === debtor.id)?.name || '';
      const creditorName =
        participants.find((p) => p.id === creditor.id)?.name || '';

      // 精算額を決定: 負債者の負債額と債権者の債権額の小さい方
      const exactAmount = Math.min(-debtor.balance, creditor.balance);
      const roundedAmount = Math.round(exactAmount);

      // 精算額が1円以上の場合のみ精算リストに追加
      if (roundedAmount > 0) {
        settlements.push({
          from: debtorName,
          to: creditorName,
          amount: roundedAmount,
        });
      }

      // 精算後のバランスを更新
      debtor.balance += exactAmount; // 負債者の負債を減らす
      creditor.balance -= exactAmount; // 債権者の債権を減らす

      // バランスが0に近くなったらポインタを移動
      if (Math.abs(debtor.balance) < MIN_AMOUNT_THRESHOLD) i++; // 次の負債者へ
      if (Math.abs(creditor.balance) < MIN_AMOUNT_THRESHOLD) j--; // 次の債権者へ
    }

    // === STEP 5: 端数調整 ===
    if (settlements.length >= MIN_SETTLEMENTS_FOR_ADJUSTMENT) {
      const totalPayments = settlements.reduce((sum, s) => sum + s.amount, 0);
      const expectedTotal = Math.round(
        Array.from(balances.values()).reduce(
          (sum, v) => (v > 0 ? sum + v : sum),
          0,
        ),
      );
      const difference = expectedTotal - totalPayments;

      // 1円の誤差がある場合のみ調整
      if (Math.abs(difference) === 1) {
        const lastIndex = settlements.length - 1;
        settlements[lastIndex] = {
          ...settlements[lastIndex],
          amount: settlements[lastIndex].amount + difference,
        };
      }
    }

    return settlements;
  }

  /**
   * 合計金額を計算する（変換済み費用ベース）
   */
  calculateTotalAmount(convertedExpenses: ConvertedAmount[]): number {
    return convertedExpenses.reduce(
      (sum, expense) => sum + expense.convertedAmount,
      0,
    );
  }

  /**
   * 一人当たりの金額を計算する
   */
  calculatePerPersonAmount(
    totalAmount: number,
    participantCount: number,
  ): number {
    return participantCount > 0 ? totalAmount / participantCount : 0;
  }

  /**
   * 基本的な精算計算（通貨変換なし）
   * lib/settlement.tsの機能を統合
   * @param participants - 参加者リスト
   * @param expenses - 費用リスト
   * @returns Settlement[] - 精算結果
   */
  calculateBasicSettlements(
    participants: Participant[],
    expenses: Expense[],
  ): Settlement[] {
    // 入力検証
    const validParticipants = participants.filter(p => 
      new ParticipantEntity(p).isValidName()
    );
    const validExpenses = expenses.filter(e => 
      new ExpenseEntity(e).isValid()
    );

    // 参加者または支出がない場合は空配列を返す
    if (validParticipants.length === 0 || validExpenses.length === 0) {
      return [];
    }

    // === STEP 1: 各参加者の支払い総額を計算 ===
    const payments = new Map<string, number>();
    // 全参加者を0円で初期化
    validParticipants.forEach((p) => payments.set(p.id, 0));

    // 各支出を支払者に集計
    validExpenses.forEach((expense) => {
      const current = payments.get(expense.payerId) || 0;
      payments.set(expense.payerId, current + expense.amount);
    });

    // === STEP 2: 一人当たりの負担額を計算 ===
    const totalAmount = Array.from(payments.values()).reduce(
      (sum, amount) => sum + amount,
      0,
    );
    const perPersonAmount = totalAmount / validParticipants.length;

    // === STEP 3: 各参加者の差額（バランス）を計算 ===
    const balances = new Map<string, number>();
    validParticipants.forEach((participant) => {
      const paid = payments.get(participant.id) || 0;
      const balance = paid - perPersonAmount;
      balances.set(participant.id, balance);
    });

    // === STEP 4: 精算リストの生成 ===
    const settlements: Settlement[] = [];

    // バランスを昇順でソート（負債者が先頭、債権者が末尾）
    const sortedBalances = Array.from(balances.entries())
      .map(([id, balance]) => ({ id, balance }))
      .sort((a, b) => a.balance - b.balance);

    // 両端からポインタを使って効率的に精算を計算
    let i = 0; // 負債者（支払う人）のインデックス
    let j = sortedBalances.length - 1; // 債権者（受け取る人）のインデックス

    while (i < j) {
      const debtor = sortedBalances[i];
      const creditor = sortedBalances[j];

      // 両方のバランスが0に近い場合は終了
      if (Math.abs(debtor.balance) < MIN_AMOUNT_THRESHOLD && 
          Math.abs(creditor.balance) < MIN_AMOUNT_THRESHOLD) {
        break;
      }

      // 参加者IDから名前を取得
      const debtorName = validParticipants.find((p) => p.id === debtor.id)?.name || '';
      const creditorName = validParticipants.find((p) => p.id === creditor.id)?.name || '';

      // 精算額を決定
      const exactAmount = Math.min(-debtor.balance, creditor.balance);
      const roundedAmount = Math.round(exactAmount);

      // 精算額が1円以上の場合のみ精算リストに追加
      if (roundedAmount > 0) {
        settlements.push({
          from: debtorName,
          to: creditorName,
          amount: roundedAmount,
        });
      }

      // 精算後のバランスを更新
      debtor.balance += exactAmount;
      creditor.balance -= exactAmount;

      // バランスが0に近くなったらポインタを移動
      if (Math.abs(debtor.balance) < MIN_AMOUNT_THRESHOLD) i++;
      if (Math.abs(creditor.balance) < MIN_AMOUNT_THRESHOLD) j--;
    }

    // === STEP 5: 端数調整 ===
    if (settlements.length >= MIN_SETTLEMENTS_FOR_ADJUSTMENT) {
      const totalPayments = settlements.reduce((sum, s) => sum + s.amount, 0);
      const expectedTotal = Math.round(
        Array.from(balances.values()).reduce(
          (sum, v) => (v > 0 ? sum + v : sum),
          0,
        ),
      );
      const difference = expectedTotal - totalPayments;

      // 1円の誤差がある場合のみ調整
      if (Math.abs(difference) === 1) {
        const lastIndex = settlements.length - 1;
        settlements[lastIndex] = {
          ...settlements[lastIndex],
          amount: settlements[lastIndex].amount + difference,
        };
      }
    }

    return settlements;
  }

  /**
   * 基本的な合計金額を計算する（Expense配列ベース）
   */
  calculateBasicTotalAmount(expenses: Expense[]): number {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }
}
