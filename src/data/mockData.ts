import { CurrencySymbol, ExchangeRate } from '@/types';

/**
 * テスト・Storybook用のモック通貨データ
 */
export const mockCurrencies: CurrencySymbol[] = [
  { code: 'JPY', description: 'Japanese Yen' },
  { code: 'USD', description: 'United States Dollar' },
  { code: 'EUR', description: 'Euro' },
  { code: 'GBP', description: 'British Pound Sterling' },
  { code: 'CNY', description: 'Chinese Yuan' },
  { code: 'KRW', description: 'South Korean Won' },
  { code: 'CAD', description: 'Canadian Dollar' },
  { code: 'AUD', description: 'Australian Dollar' },
  { code: 'CHF', description: 'Swiss Franc' },
  { code: 'SGD', description: 'Singapore Dollar' },
  { code: 'THB', description: 'Thai Baht' },
  { code: 'INR', description: 'Indian Rupee' },
  { code: 'BTC', description: 'Bitcoin' },
  { code: 'ETH', description: 'Ethereum' },
];

/**
 * テスト・Storybook用のモック為替レートデータ
 */
export const mockExchangeRates: ExchangeRate = {
  base: 'USD',
  date: '2025-01-15',
  rates: {
    JPY: 155.42,
    EUR: 0.85,
    GBP: 0.73,
    CNY: 7.25,
    KRW: 1380.5,
    CAD: 1.35,
    AUD: 1.42,
    CHF: 0.92,
    SGD: 1.38,
    THB: 35.2,
    INR: 83.15,
    BTC: 0.000023,
    ETH: 0.00031,
  },
};

/**
 * ランダムな為替レート変動をシミュレート
 */
export function generateRandomRates(
  baseRates = mockExchangeRates.rates,
): Record<string, number> {
  const fluctuation = 0.02; // ±2%の変動

  return Object.entries(baseRates).reduce(
    (acc, [currency, rate]) => {
      const randomFactor = 1 + (Math.random() - 0.5) * 2 * fluctuation;
      acc[currency] = Number((rate * randomFactor).toFixed(6));
      return acc;
    },
    {} as Record<string, number>,
  );
}

/**
 * 遅延をシミュレートする関数
 */
export function simulateDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
