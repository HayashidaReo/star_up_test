import React from 'react';

interface EmptyStateProps {
  message: string;
  className?: string;
}

/**
 * 空の状態を表示するコンポーネント
 */
export function EmptyState({ message, className = '' }: EmptyStateProps) {
  return (
    <div className={`py-8 text-center text-gray-500 ${className}`}>
      {message}
    </div>
  );
}
