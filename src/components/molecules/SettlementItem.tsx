import React from 'react';
import { Badge } from '@/components/atoms/badge';
import { Settlement } from '@/types';
import { formatCurrencyAmount } from '@/lib/utils';

interface SettlementItemProps {
  settlement: Settlement;
  currency?: string; // 精算通貨（propsで受け取る）
}

/**
 * 精算結果のアイテムコンポーネント
 */
export function SettlementItem({ settlement, currency = 'JPY' }: SettlementItemProps) {
  // 精算アイテム自体の通貨情報、または親から渡された通貨を使用
  const displayCurrency = settlement.currency || currency;
  
  return (
    <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-white">
          {settlement.from}
        </Badge>
        <span className="text-gray-500">→</span>
        <Badge variant="outline" className="bg-white">
          {settlement.to}
        </Badge>
      </div>
      <div className="font-semibold text-gray-900">
        {formatCurrencyAmount(settlement.amount, displayCurrency)}
      </div>
    </div>
  );
}
