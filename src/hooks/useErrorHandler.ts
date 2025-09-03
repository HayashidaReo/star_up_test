import { useCallback, useState } from 'react';

export interface ErrorHandler {
  handleError: (error: Error | string) => void;
  snackbar: {
    message: string;
    isVisible: boolean;
  };
  hideSnackbar: () => void;
}

/**
 * エラーハンドリングフック
 */
export function useErrorHandler(): ErrorHandler {
  const [snackbar, setSnackbar] = useState({
    message: '',
    isVisible: false,
  });

  const handleError = useCallback((error: Error | string) => {
    const message = typeof error === 'string' ? error : error.message;
    setSnackbar({
      message: `エラーが発生しました: ${message}`,
      isVisible: true,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar({ message: '', isVisible: false });
  }, []);

  return { handleError, snackbar, hideSnackbar };
}
