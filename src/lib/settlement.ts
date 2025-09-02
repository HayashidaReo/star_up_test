import { Participant, Expense, Settlement } from '@/types';

/**
 * 精算計算のロジック
 * 各参加者の支払い額と負担額を計算し、最適な精算リストを生成する
 */
export function calculateSettlements(
  participants: Participant[],
  expenses: Expense[],
): Settlement[] {
  if (participants.length === 0 || expenses.length === 0) {
    return [];
  }

  // 各参加者の支払い総額を計算
  const payments = new Map<string, number>();
  participants.forEach((p) => payments.set(p.id, 0));

  expenses.forEach((expense) => {
    const current = payments.get(expense.payerId) || 0;
    payments.set(expense.payerId, current + expense.amount);
  });

  // 各参加者の負担額を計算（合計金額を参加者数で割る）
  const totalAmount = Array.from(payments.values()).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const perPersonAmount = totalAmount / participants.length;

  // 各参加者の差額を計算
  const balances = new Map<string, number>();
  participants.forEach((participant) => {
    const paid = payments.get(participant.id) || 0;
    balances.set(participant.id, paid - perPersonAmount);
  });

  // 精算リストを生成
  const settlements: Settlement[] = [];
  const sortedBalances = Array.from(balances.entries())
    .map(([id, balance]) => ({ id, balance }))
    .sort((a, b) => a.balance - b.balance);

  let i = 0; // 負債者（支払う人）のインデックス
  let j = sortedBalances.length - 1; // 債権者（受け取る人）のインデックス

  while (i < j) {
    const debtor = sortedBalances[i];
    const creditor = sortedBalances[j];

    if (Math.abs(debtor.balance) < 0.01 && Math.abs(creditor.balance) < 0.01) {
      break;
    }

    const debtorName = participants.find((p) => p.id === debtor.id)?.name || '';
    const creditorName =
      participants.find((p) => p.id === creditor.id)?.name || '';

    const exactAmount = Math.min(-debtor.balance, creditor.balance);
    let roundedAmount = Math.round(exactAmount);

    if (roundedAmount > 0) {
      settlements.push({
        from: debtorName,
        to: creditorName,
        amount: roundedAmount,
      });
    }

    debtor.balance += exactAmount;
    creditor.balance -= exactAmount;

    if (Math.abs(debtor.balance) < 0.01) i++;
    if (Math.abs(creditor.balance) < 0.01) j--;
  }

  // 端数調整: 四捨五入による誤差を最後の精算額に反映
  if (settlements.length >= 2) {
    const totalPayments = settlements.reduce((sum, s) => sum + s.amount, 0);
    const expectedTotal = Math.round(
      Math.abs(Array.from(balances.values()).find((v) => v > 0) || 0),
    );
    const difference = expectedTotal - totalPayments;

    if (Math.abs(difference) === 1) {
      // 新しいオブジェクトで最後の精算額を調整
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
 * 合計金額を計算する
 */
export function calculateTotalAmount(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * 一人当たりの金額を計算する
 */
export function calculatePerPersonAmount(
  totalAmount: number,
  participantCount: number,
): number {
  return participantCount > 0 ? totalAmount / participantCount : 0;
}
