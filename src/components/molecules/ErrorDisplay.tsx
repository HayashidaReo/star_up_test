import React from 'react';

interface ErrorDisplayProps {
  message?: string;
}

export function ErrorDisplay({ message = 'エラーが発生しました' }: ErrorDisplayProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {message}
          </h3>
        </div>
      </div>
    </div>
  );
}
