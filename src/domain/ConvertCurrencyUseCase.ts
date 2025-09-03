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

    // USDベースのAPIなので、USD経由で変換を行う
    const exchangeRates = await this.currencyRepository.getExchangeRates('USD');

    let convertedAmount: number;
    let rate: number;

    if (fromCurrency === 'USD') {
      // USDから他通貨への変換
      rate = exchangeRates.rates[toCurrency];
      if (!rate) {
        throw new Error(
          `${fromCurrency}から${toCurrency}への為替レートが見つかりません`,
        );
      }
      convertedAmount = amount * rate;
    } else if (toCurrency === 'USD') {
      // 他通貨からUSDへの変換
      const fromRate = exchangeRates.rates[fromCurrency];
      if (!fromRate) {
        throw new Error(
          `${fromCurrency}から${toCurrency}への為替レートが見つかりません`,
        );
      }
      rate = 1 / fromRate;
      convertedAmount = amount * rate;
    } else {
      // 他通貨から他通貨への変換（USD経由）
      const fromRate = exchangeRates.rates[fromCurrency];
      const toRate = exchangeRates.rates[toCurrency];

      if (!fromRate || !toRate) {
        throw new Error(
          `${fromCurrency}から${toCurrency}への為替レートが見つかりません`,
        );
      }

      // USD経由での変換: fromCurrency -> USD -> toCurrency
      rate = toRate / fromRate;
      convertedAmount = amount * rate;
    }

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

    // USDベースの為替レートを一括取得
    const exchangeRates = await this.currencyRepository.getExchangeRates('USD');

    // 各費用を変換
    return expenses.map((expense) => {
      let convertedAmount: number;
      let rate: number;

      // 同じ通貨の場合は変換不要
      if (expense.currency === targetCurrency) {
        return {
          originalAmount: expense.amount,
          originalCurrency: expense.currency,
          convertedAmount: expense.amount,
          targetCurrency,
          rate: 1,
        };
      }

      if (expense.currency === 'USD') {
        // USDから他通貨への変換
        rate = exchangeRates.rates[targetCurrency] ?? 1;
        convertedAmount = expense.amount * rate;
      } else if (targetCurrency === 'USD') {
        // 他通貨からUSDへの変換
        const fromRate = exchangeRates.rates[expense.currency] ?? 1;
        rate = 1 / fromRate;
        convertedAmount = expense.amount * rate;
      } else {
        // 他通貨から他通貨への変換（USD経由）
        const fromRate = exchangeRates.rates[expense.currency] ?? 1;
        const toRate = exchangeRates.rates[targetCurrency] ?? 1;
        rate = toRate / fromRate;
        convertedAmount = expense.amount * rate;
      }

      return {
        originalAmount: expense.amount,
        originalCurrency: expense.currency,
        convertedAmount: Math.round(convertedAmount * 100) / 100,
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
