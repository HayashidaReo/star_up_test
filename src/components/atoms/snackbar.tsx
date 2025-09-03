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
        'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
        'min-w-72 max-w-md px-4 py-3 rounded-lg shadow-lg border',
        'flex items-center justify-between gap-3',
        'animate-in slide-in-from-bottom-2 duration-200',
        getTypeStyles()
      )}
      role="alert"
    >
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="閉じる"
      >
        <X size={16} />
      </button>
    </div>
  );
}
