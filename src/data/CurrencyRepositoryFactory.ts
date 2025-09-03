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

    // デバッグ用ログ（一時的）
    console.log('🔍 CurrencyRepositoryFactory Debug:');
    console.log('  NODE_ENV:', process.env.NODE_ENV);
    console.log('  STORYBOOK:', process.env.STORYBOOK);
    console.log('  FORCE_MOCK_API:', process.env.FORCE_MOCK_API);
    console.log('  isTest:', isTest);
    console.log('  isStorybook:', isStorybook);
    console.log('  forceMock:', forceMock);

    if (isTest || isStorybook || forceMock) {
      console.log('🎭 Using MockCurrencyRepository');
      return new MockCurrencyRepository({
        simulateDelay: !isTest, // テスト時は遅延なし
        simulateErrors: false, // 基本的にエラーはシミュレートしない
      });
    }

    console.log('🌐 Using CurrencyApiRepositoryImpl');
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
