import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SnackbarProps {
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  isVisible: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

/**
 * スナックバーコンポーネント
 * エラーメッセージや通知を表示するためのトースト風UI
 */
export function Snackbar({
  message,
  type = 'error',
  isVisible,
  onClose,
  autoHideDuration = 5000,
}: SnackbarProps) {
  React.useEffect(() => {
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDuration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-600 text-white border-red-700';
      case 'warning':
        return 'bg-yellow-500 text-black border-yellow-600';
      case 'info':
        return 'bg-blue-600 text-white border-blue-700';
      case 'success':
        return 'bg-green-600 text-white border-green-700';
      default:
        return 'bg-gray-600 text-white border-gray-700';
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform',
        'min-w-72 max-w-md rounded-lg border px-4 py-3 shadow-lg',
        'flex items-center justify-between gap-3',
        'duration-200 animate-in slide-in-from-bottom-2',
        getTypeStyles(),
      )}
      role="alert"
    >
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 transition-opacity hover:opacity-70"
        aria-label="閉じる"
      >
        <X size={16} />
      </button>
    </div>
  );
}
