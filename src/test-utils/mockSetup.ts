import { beforeEach, vi } from 'vitest';
import { CurrencyRepositoryFactory } from '@/data/CurrencyRepositoryFactory';

// テスト環境でのモック設定
beforeEach(() => {
  // 環境変数をモック
  vi.stubEnv('NODE_ENV', 'test');
  vi.stubEnv('FORCE_MOCK_API', 'true');

  // CurrencyRepositoryFactoryをモック
  vi.clearAllMocks();
});

// グローバルなfetchをモック（API呼び出しのテスト用）
global.fetch = vi.fn();

export const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
