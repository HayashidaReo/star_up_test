import { CurrencyRepository } from '@/repository/CurrencyRepository';
import { CurrencySymbol, ExchangeRate } from '@/types';
import {
  mockCurrencies,
  mockExchangeRates,
  generateRandomRates,
  simulateDelay,
} from './mockData';

/**
 * テスト・Storybook用のモック通貨リポジトリ
 * 実際のAPIを呼び出さずにダミーデータを返す
 */
export class MockCurrencyRepository implements CurrencyRepository {
  private readonly shouldSimulateDelay: boolean;
  private readonly shouldSimulateErrors: boolean;

  constructor(options: {
    simulateDelay?: boolean;
    simulateErrors?: boolean;
  } = {}) {
    this.shouldSimulateDelay = options.simulateDelay ?? true;
    this.shouldSimulateErrors = options.simulateErrors ?? false;
    
    console.log('🎭 MockCurrencyRepository: インスタンス作成完了', {
      simulateDelay: this.shouldSimulateDelay,
      simulateErrors: this.shouldSimulateErrors
    });
  }

  /**
   * モック通貨リストを返す（インターフェース準拠）
   */
  async getCurrencySymbols(): Promise<CurrencySymbol[]> {
    if (this.shouldSimulateDelay) {
      await simulateDelay(Math.random() * 800 + 200); // 200-1000ms
    }

    if (this.shouldSimulateErrors && Math.random() < 0.1) {
      throw new Error('Mock error: Failed to fetch currencies');
    }

    return mockCurrencies;
  }

  /**
   * モック為替レートを返す
   */
  async getExchangeRates(
    base: string = 'USD',
    symbols?: string[],
  ): Promise<ExchangeRate> {
    if (this.shouldSimulateDelay) {
      await simulateDelay(Math.random() * 800 + 200); // 200-1000ms
    }

    if (this.shouldSimulateErrors && Math.random() < 0.1) {
      throw new Error('モック為替レート取得エラー: APIエラーをシミュレート');
    }

    // ベースレートから少し変動させたレートを生成
    const allRates = generateRandomRates();

    // 指定された通貨のみをフィルタ
    const filteredRates = symbols
      ? Object.entries(allRates)
          .filter(([currency]) => symbols.includes(currency))
          .reduce(
            (acc, [currency, rate]) => {
              acc[currency] = rate;
              return acc;
            },
            {} as Record<string, number>,
          )
      : allRates;

    return {
      base,
      date: new Date().toISOString().split('T')[0],
      rates: filteredRates,
    };
  }
}
