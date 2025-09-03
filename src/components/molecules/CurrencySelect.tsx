import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../atoms/select';
import { CURRENCIES } from '@/lib/constants';
import { Currency, CurrencySymbol } from '@/types';

interface CurrencySelectProps {
  value: Currency;
  onValueChange: (value: Currency) => void;
  placeholder?: string;
  currencies?: CurrencySymbol[];
  currenciesLoading?: boolean;
  currenciesError?: string | null;
}

/**
 * 通貨選択用のコンポーネント
 * propsから受け取った通貨データを使用してリストを表示
 */
export function CurrencySelect({
  value,
  onValueChange,
  placeholder = '通貨を選択',
  currencies = [],
  currenciesLoading = false,
  currenciesError = null,
}: CurrencySelectProps) {
  // フォールバック用の通貨データ
  const fallbackCurrencies = Object.values(CURRENCIES).map((code) => ({
    code,
    description: code,
  }));

  // 使用する通貨データを決定
  const availableCurrencies =
    currencies.length > 0 ? currencies : fallbackCurrencies;

  // ローディング中の場合
  if (currenciesLoading && currencies.length === 0) {
    return (
      <Select disabled value={value}>
        <SelectTrigger>
          <SelectValue placeholder="読み込み中..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="loading" disabled>
            読み込み中...
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {availableCurrencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.code} - {currency.description}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
