import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { CURRENCIES, CURRENCY_SYMBOLS } from '@/lib/constants';
import { Currency } from '@/types';

interface CurrencySelectProps {
  value: Currency;
  onValueChange: (value: Currency) => void;
  placeholder?: string;
}

/**
 * 通貨選択用のコンポーネント
 */
export function CurrencySelect({
  value,
  onValueChange,
  placeholder = '通貨を選択',
}: CurrencySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {Object.values(CURRENCIES).map((currency) => (
          <SelectItem key={currency} value={currency}>
            {currency} ({CURRENCY_SYMBOLS[currency]})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
