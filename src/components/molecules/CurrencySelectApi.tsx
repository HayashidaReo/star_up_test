import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../atoms/select';
import { CurrencySymbol } from '@/types';

interface CurrencySelectApiProps {
  value: string;
  onValueChange: (value: string) => void;
  currencies: CurrencySymbol[];
  placeholder?: string;
  isLoading?: boolean;
  error?: string;
}

/**
 * APIから取得した通貨リストを表示する通貨選択コンポーネント
 * 精算通貨の選択など、動的な通貨リストが必要な場合に使用
 */
export function CurrencySelectApi({
  value,
  onValueChange,
  currencies,
  placeholder = '精算通貨を選択',
  isLoading = false,
  error,
}: CurrencySelectApiProps) {
  if (error) {
    return (
      <div className="rounded border border-red-200 p-2 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded border p-2">
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">
          通貨リストを取得中...
        </span>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem 
            key={currency.code} 
            value={currency.code}
            title={`${currency.code} - ${currency.description}`}
          >
            {currency.code} - {currency.description}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
