'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SettlementItem } from '@/components/SettlementItem';
import { useAppStore } from '@/store/useAppStore';
import { Calculator } from 'lucide-react';
import { MESSAGES } from '@/lib/constants';
import {
  calculateTotalAmount,
  calculatePerPersonAmount,
} from '@/lib/settlement';
import { formatAmount } from '@/lib/utils';

export function SettlementSection() {
  const { participants, expenses, settlements, calculateSettlements } =
    useAppStore();

  // 合計金額を計算
  const totalAmount = calculateTotalAmount(expenses);

  // 一人当たりの金額を計算
  const perPersonAmount = calculatePerPersonAmount(
    totalAmount,
    participants.length,
  );

  // 精算を実行する関数
  const handleSettle = () => {
    calculateSettlements();
  };

  // 空の状態のメッセージを取得
  const getEmptyMessage = () => {
    if (participants.length === 0) return MESSAGES.NO_PARTICIPANTS;
    if (expenses.length === 0) return MESSAGES.NO_EXPENSES_FOR_SETTLEMENT;
    return MESSAGES.CALCULATE_SETTLEMENT;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>精算結果</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 概要表示 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-sm font-medium text-blue-600">合計金額</div>
            <div className="text-2xl font-bold text-blue-900">
              {formatAmount(totalAmount)}
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-sm font-medium text-green-600">
              一人当たりの金額
            </div>
            <div className="text-2xl font-bold text-green-900">
              {formatAmount(Math.round(perPersonAmount))}
            </div>
          </div>
        </div>

        {/* 精算リスト */}
        {settlements.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">精算リスト</h3>
            <div className="space-y-2">
              {settlements.map((settlement, index) => (
                <SettlementItem key={index} settlement={settlement} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState message={getEmptyMessage()} />
        )}

        {/* 精算ボタン */}
        <div className="flex justify-center">
          <Button
            onClick={handleSettle}
            disabled={participants.length === 0 || expenses.length === 0}
            className="px-8"
          >
            <Calculator className="mr-2 h-4 w-4" />
            {MESSAGES.SETTLE}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
