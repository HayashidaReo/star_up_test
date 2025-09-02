import { Participant, Expense, Settlement } from '@/types';

/**
 * 精算計算のロジック
 * 各参加者の支払い額と負担額を計算し、最適な精算リストを生成する
 *
 * アルゴリズムの概要:
 * 1. 各参加者の支払い総額を集計
 * 2. 全体の支出を参加者数で割って一人当たりの負担額を算出
 * 3. 各参加者の「支払い額 - 負担額」で差額を計算
 * 4. 差額をソートして、負債者（マイナス）と債権者（プラス）をペアリング
 * 5. 最小の精算回数で全体のバランスを調整
 */
export function calculateSettlements(
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
  // 正の値: その人に支払われるべき金額（債権者）
  // 負の値: その人が支払うべき金額（負債者）
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
    if (Math.abs(debtor.balance) < 0.01 && Math.abs(creditor.balance) < 0.01) {
      break;
    }

    // 参加者IDから名前を取得
    const debtorName = participants.find((p) => p.id === debtor.id)?.name || '';
    const creditorName =
      participants.find((p) => p.id === creditor.id)?.name || '';

    // 精算額を決定: 負債者の負債額と債権者の債権額の小さい方
    // 負債者のbalanceは負の値なので、-debtor.balanceで正の値にする
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
    if (Math.abs(debtor.balance) < 0.01) i++; // 次の負債者へ
    if (Math.abs(creditor.balance) < 0.01) j--; // 次の債権者へ
  }

  // === STEP 5: 端数調整 ===
  // 四捨五入による誤差を最後の精算額に反映して全体の整合性を保つ
  if (settlements.length >= 2) {
    const totalPayments = settlements.reduce((sum, s) => sum + s.amount, 0);
    const expectedTotal = Math.round(
      Math.abs(Array.from(balances.values()).find((v) => v > 0) || 0),
    );
    const difference = expectedTotal - totalPayments;

    // 1円の誤差がある場合のみ調整（それ以上の誤差は計算エラーの可能性）
    if (Math.abs(difference) === 1) {
      // イミュータブルな更新で最後の精算額を調整
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
 * @param expenses 支出リスト
 * @returns 全支出の合計金額
 */
export function calculateTotalAmount(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * 一人当たりの金額を計算する
 * @param totalAmount 合計金額
 * @param participantCount 参加者数
 * @returns 一人当たりの負担額（参加者数が0の場合は0を返す）
 */
export function calculatePerPersonAmount(
  totalAmount: number,
  participantCount: number,
): number {
  return participantCount > 0 ? totalAmount / participantCount : 0;
}
