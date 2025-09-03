import { describe, it, expect, beforeEach } from 'vitest';
import { ConvertCurrencyUseCase } from '../ConvertCurrencyUseCase';
import { CurrencyRepositoryFactory } from '@/data/CurrencyRepositoryFactory';
import { Currency, Expense } from '@/types';

describe('ConvertCurrencyUseCase (統合テスト)', () => {
  let useCase: ConvertCurrencyUseCase;

  beforeEach(() => {
    // モックリポジトリを使用した統合テスト
    const mockRepository = CurrencyRepositoryFactory.createMock({
      simulateDelay: false, // テストでは遅延なし
      simulateErrors: false, // エラーなし
    });
    useCase = new ConvertCurrencyUseCase(mockRepository);
  });

  describe('getAvailableCurrencies', () => {
    it('モック通貨リストを取得できる', async () => {
      const currencies = await useCase.getAvailableCurrencies();

      expect(currencies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: 'JPY', description: 'Japanese Yen' }),
          expect.objectContaining({
            code: 'USD',
            description: 'United States Dollar',
          }),
          expect.objectContaining({ code: 'EUR', description: 'Euro' }),
        ]),
      );
      expect(currencies.length).toBeGreaterThan(10);
    });
  });

  describe('convertAmount (統合テスト)', () => {
    it('実際のモックデータを使用してUSDからJPYに変換できる', async () => {
      const result = await useCase.convertAmount(100, 'USD', 'JPY');

      expect(result.originalAmount).toBe(100);
      expect(result.originalCurrency).toBe('USD');
      expect(result.targetCurrency).toBe('JPY');
      expect(result.convertedAmount).toBeGreaterThan(1000); // 1ドル = 150円程度を想定
      expect(result.rate).toBeGreaterThan(100);
    });

    it('同じ通貨間の変換はrate=1になる', async () => {
      const result = await useCase.convertAmount(500, 'EUR', 'EUR');

      expect(result.originalAmount).toBe(500);
      expect(result.convertedAmount).toBe(500);
      expect(result.rate).toBe(1);
    });

    it('EURからUSDへの変換ができる', async () => {
      const result = await useCase.convertAmount(100, 'EUR', 'USD');

      expect(result.originalAmount).toBe(100);
      expect(result.originalCurrency).toBe('EUR');
      expect(result.targetCurrency).toBe('USD');
      expect(result.convertedAmount).toBeGreaterThan(50);
      expect(result.rate).toBeGreaterThan(0.5);
    });
  });

  describe('convertExpenses (統合テスト)', () => {
    it('複数の費用を一括で変換できる', async () => {
      const expenses: Expense[] = [
        {
          id: '1',
          description: 'ランチ',
          amount: 1000,
          payerId: 'user1',
          currency: 'JPY' as Currency,
        },
        {
          id: '2',
          description: 'コーヒー',
          amount: 5,
          payerId: 'user2',
          currency: 'USD' as Currency,
        },
        {
          id: '3',
          description: 'タクシー',
          amount: 20,
          payerId: 'user3',
          currency: 'EUR' as Currency,
        },
      ];

      const results = await useCase.convertExpenses(expenses, 'USD');

      expect(results).toHaveLength(3);

      // JPYからUSDへの変換
      expect(results[0].originalCurrency).toBe('JPY');
      expect(results[0].targetCurrency).toBe('USD');
      expect(results[0].convertedAmount).toBeLessThan(
        results[0].originalAmount,
      );

      // USD->USDは変換なし
      expect(results[1].rate).toBe(1);
      expect(results[1].convertedAmount).toBe(5);

      // EURからUSDへの変換
      expect(results[2].originalCurrency).toBe('EUR');
      expect(results[2].targetCurrency).toBe('USD');
      expect(results[2].convertedAmount).toBeGreaterThan(20);
    });
  });
});
