import { useCallback } from 'react';

export interface ErrorHandler {
  handleError: (error: Error | string) => void;
}

/**
 * エラーハンドリングフック
 */
export function useErrorHandler(): ErrorHandler {
  const handleError = useCallback((error: Error | string) => {
    const message = typeof error === 'string' ? error : error.message;

    // ユーザーに対してvisualなフィードバックを提供
    alert(`エラーが発生しました: ${message}`);

    // 開発環境でのみコンソールにログを出力
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', message);
    }
  }, []);

  return { handleError };
}
