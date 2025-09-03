import { CurrencyRepository } from '@/repository/CurrencyRepository';
import { CurrencyApiRepositoryImpl } from './CurrencyApiRepositoryImpl';
import { MockCurrencyRepository } from './MockCurrencyRepository';

/**
 * 環境に応じて適切なリポジトリインスタンスを作成するファクトリー
 */
export class CurrencyRepositoryFactory {
  /**
   * 環境変数に基づいて適切なリポジトリを作成
   */
  static create(): CurrencyRepository {
    const isTest = process.env.NODE_ENV === 'test';
    const isStorybook = process.env.STORYBOOK === 'true';
    const forceMock = process.env.FORCE_MOCK_API === 'true';

    if (isTest || isStorybook || forceMock) {
      return new MockCurrencyRepository({
        simulateDelay: !isTest, // テスト時は遅延なし
        simulateErrors: false, // 基本的にエラーはシミュレートしない
      });
    }

    return new CurrencyApiRepositoryImpl();
  }

  /**
   * テスト専用: モックリポジトリを強制作成
   */
  static createMock(options?: {
    simulateDelay?: boolean;
    simulateErrors?: boolean;
  }): MockCurrencyRepository {
    return new MockCurrencyRepository(options);
  }

  /**
   * 本番専用: 実際のAPIリポジトリを強制作成
   */
  static createApi(): CurrencyApiRepositoryImpl {
    return new CurrencyApiRepositoryImpl();
  }
}
