import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Settlement } from '@/types';
import { formatAmount } from '@/lib/utils';

interface SettlementItemProps {
  settlement: Settlement;
}

/**
 * 精算結果のアイテムコンポーネント
 */
export function SettlementItem({ settlement }: SettlementItemProps) {
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
        {formatAmount(settlement.amount)}
      </div>
    </div>
  );
}
