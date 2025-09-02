import { CurrencyRepository } from '@/repository/CurrencyRepository';
import { ConvertedAmount, Expense } from '@/types';

/**
 * 通貨変換に関するビジネスロジックを担当するユースケース
 * 精算計算と通貨変換を統合した処理を提供
 */
export class ConvertCurrencyUseCase {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  /**
   * 指定された金額を別の通貨に変換する
   * @param amount - 変換元の金額
   * @param fromCurrency - 変換元の通貨コード
   * @param toCurrency - 変換先の通貨コード
   * @returns Promise<ConvertedAmount> - 変換結果
   */
  async convertAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<ConvertedAmount> {
    // 同じ通貨の場合は変換不要
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: amount,
        targetCurrency: toCurrency,
        rate: 1,
      };
    }

    // 為替レートを取得（変換元通貨を基準とする）
    const exchangeRates = await this.currencyRepository.getExchangeRates(
      fromCurrency,
      [toCurrency],
    );

    const rate = exchangeRates.rates[toCurrency];
    if (!rate) {
      throw new Error(
        `${fromCurrency}から${toCurrency}への為替レートが見つかりません`,
      );
    }

    const convertedAmount = amount * rate;

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount: Math.round(convertedAmount * 100) / 100, // 小数点2桁で丸め
      targetCurrency: toCurrency,
      rate,
    };
  }

  /**
   * 複数の費用を指定通貨に統一変換する
   * @param expenses - 費用のリスト
   * @param targetCurrency - 変換先通貨コード
   * @returns Promise<ConvertedAmount[]> - 変換結果のリスト
   */
  async convertExpenses(
    expenses: Expense[],
    targetCurrency: string,
  ): Promise<ConvertedAmount[]> {
    if (expenses.length === 0) {
      return [];
    }

    // 異なる通貨の一覧を取得
    const uniqueCurrencies = Array.from(
      new Set(expenses.map((expense) => expense.currency)),
    );

    // 必要な為替レートを一括取得（効率化のため）
    const exchangeRatesPromises = uniqueCurrencies.map((currency) => {
      if (currency === targetCurrency) {
        return Promise.resolve({
          base: currency,
          rates: { [targetCurrency]: 1 },
          date: '',
        });
      }
      return this.currencyRepository.getExchangeRates(currency, [
        targetCurrency,
      ]);
    });

    const exchangeRatesResults = await Promise.all(exchangeRatesPromises);

    // 通貨コードと為替レートのマッピングを作成
    const ratesMap = new Map<string, number>();
    uniqueCurrencies.forEach((currency, index) => {
      const rates = exchangeRatesResults[index];
      const rate = rates.rates[targetCurrency] ?? 1;
      ratesMap.set(currency, rate);
    });

    // 各費用を変換
    return expenses.map((expense) => {
      const rate = ratesMap.get(expense.currency) ?? 1;
      const convertedAmount = Math.round(expense.amount * rate * 100) / 100;

      return {
        originalAmount: expense.amount,
        originalCurrency: expense.currency,
        convertedAmount,
        targetCurrency,
        rate,
      };
    });
  }

  /**
   * 利用可能な通貨リストを取得する
   * @returns Promise<Array<{code: string, description: string}>> - 通貨リスト
   */
  async getAvailableCurrencies() {
    return this.currencyRepository.getCurrencySymbols();
  }
}
