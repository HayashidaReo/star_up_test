import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConvertCurrencyUseCase } from '../ConvertCurrencyUseCase';
import { CurrencyRepository } from '@/repository/CurrencyRepository';
import { CurrencySymbol, Expense } from '@/types';

// モックリポジトリの作成
class MockCurrencyRepository implements CurrencyRepository {
  getCurrencySymbols = vi.fn();
  getExchangeRates = vi.fn();
}

describe('ConvertCurrencyUseCase', () => {
  let useCase: ConvertCurrencyUseCase;
  let mockRepository: MockCurrencyRepository;

  beforeEach(() => {
    mockRepository = new MockCurrencyRepository();
    useCase = new ConvertCurrencyUseCase(mockRepository);
  });

  describe('convertAmount', () => {
    it('同じ通貨の場合は変換せずそのまま返す', async () => {
      const result = await useCase.convertAmount(100, 'USD', 'USD');

      expect(result).toEqual({
        originalAmount: 100,
        originalCurrency: 'USD',
        convertedAmount: 100,
        targetCurrency: 'USD',
        rate: 1,
      });

      expect(mockRepository.getExchangeRates).not.toHaveBeenCalled();
    });

    it('異なる通貨の場合は為替レートを取得して変換する', async () => {
      // モックの設定
      mockRepository.getExchangeRates.mockResolvedValue({
        base: 'USD',
        date: '2024-01-01',
        rates: { JPY: 110.0 },
      });

      const result = await useCase.convertAmount(100, 'USD', 'JPY');

      expect(result).toEqual({
        originalAmount: 100,
        originalCurrency: 'USD',
        convertedAmount: 11000, // 100 * 110
        targetCurrency: 'JPY',
        rate: 110.0,
      });

      expect(mockRepository.getExchangeRates).toHaveBeenCalledWith('USD');
    });

    it('為替レートが見つからない場合はエラーを投げる', async () => {
      mockRepository.getExchangeRates.mockResolvedValue({
        base: 'USD',
        date: '2024-01-01',
        rates: {}, // JPYのレートが存在しない
      });

      await expect(useCase.convertAmount(100, 'USD', 'JPY')).rejects.toThrow(
        'USDからJPYへの為替レートが見つかりません',
      );
    });

    it('小数点の処理が正しく行われる', async () => {
      mockRepository.getExchangeRates.mockResolvedValue({
        base: 'USD',
        date: '2024-01-01',
        rates: { EUR: 0.8567 },
      });

      const result = await useCase.convertAmount(123.45, 'USD', 'EUR');

      expect(result.convertedAmount).toBe(105.76); // 123.45 * 0.8567 = 105.7452... → 105.76
    });
  });

  describe('convertExpenses', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        description: 'Food',
        amount: 100,
        payerId: 'user1',
        currency: 'USD',
      },
      {
        id: '2',
        description: 'Hotel',
        amount: 200,
        payerId: 'user2',
        currency: 'EUR',
      },
      {
        id: '3',
        description: 'Transport',
        amount: 50,
        payerId: 'user1',
        currency: 'JPY',
      },
    ];

    it('空の費用リストの場合は空配列を返す', async () => {
      const result = await useCase.convertExpenses([], 'USD');
      expect(result).toEqual([]);
    });

    it('複数の費用を一括で変換する', async () => {
      // USD → JPY のモック
      // USDベースの為替レートを1回だけ取得するように修正
      mockRepository.getExchangeRates.mockResolvedValue({
        base: 'USD',
        date: '2024-01-01',
        rates: { JPY: 110, EUR: 0.85 }, // EUR to JPY via USD: 110/0.85 = 129.41...
      });

      const result = await useCase.convertExpenses(expenses, 'JPY');

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        originalAmount: 100,
        originalCurrency: 'USD',
        convertedAmount: 11000, // 100 * 110
        targetCurrency: 'JPY',
        rate: 110,
      });
      expect(result[1]).toEqual({
        originalAmount: 200,
        originalCurrency: 'EUR',
        convertedAmount: 25882.35, // 200 * (110/0.85) = 200 * 129.41176... = 25882.35...
        targetCurrency: 'JPY',
        rate: 129.41176470588235, // 110/0.85
      });
      expect(result[2]).toEqual({
        originalAmount: 50,
        originalCurrency: 'JPY',
        convertedAmount: 50, // 50 * 1
        targetCurrency: 'JPY',
        rate: 1,
      });
    });

    it('API呼び出しが効率的に行われる（重複する通貨のリクエストは1回だけ）', async () => {
      const expensesWithDuplicateCurrency: Expense[] = [
        {
          id: '1',
          description: 'Food1',
          amount: 100,
          payerId: 'user1',
          currency: 'USD',
        },
        {
          id: '2',
          description: 'Food2',
          amount: 50,
          payerId: 'user2',
          currency: 'USD',
        },
        {
          id: '3',
          description: 'Hotel',
          amount: 200,
          payerId: 'user3',
          currency: 'EUR',
        },
      ];

      mockRepository.getExchangeRates.mockResolvedValue({
        base: 'USD',
        date: '2024-01-01',
        rates: { JPY: 110, EUR: 0.85 },
      });

      await useCase.convertExpenses(expensesWithDuplicateCurrency, 'JPY');

      // USDベースで1回だけ呼び出される
      expect(mockRepository.getExchangeRates).toHaveBeenCalledTimes(1);
      expect(mockRepository.getExchangeRates).toHaveBeenCalledWith('USD');
    });
  });

  describe('getAvailableCurrencies', () => {
    it('リポジトリから通貨リストを取得する', async () => {
      const mockCurrencies: CurrencySymbol[] = [
        { code: 'USD', description: 'US Dollar' },
        { code: 'EUR', description: 'Euro' },
        { code: 'JPY', description: 'Japanese Yen' },
      ];

      mockRepository.getCurrencySymbols.mockResolvedValue(mockCurrencies);

      const result = await useCase.getAvailableCurrencies();

      expect(result).toEqual(mockCurrencies);
      expect(mockRepository.getCurrencySymbols).toHaveBeenCalledTimes(1);
    });

    it('リポジトリでエラーが発生した場合はそのまま投げる', async () => {
      const error = new Error('API error');
      mockRepository.getCurrencySymbols.mockRejectedValue(error);

      await expect(useCase.getAvailableCurrencies()).rejects.toThrow(
        'API error',
      );
    });
  });
});
