import { useCallback } from 'react';

export interface ErrorHandler {
  handleError: (error: Error | string) => void;
}

export function useErrorHandler(): ErrorHandler {
  const handleError = useCallback((error: Error | string) => {
    const message = typeof error === 'string' ? error : error.message;
    console.error('Error:', message);
    // ここで実際のエラーハンドリング（ログ送信、通知表示など）を実装できます
  }, []);

  return { handleError };
}
