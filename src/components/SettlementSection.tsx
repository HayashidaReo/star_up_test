'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { Calculator } from 'lucide-react';

export function SettlementSection() {
  const { participants, expenses, settlements, calculateSettlements } =
    useAppStore();

  // 合計金額を計算
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  // 一人当たりの金額を計算
  const perPersonAmount =
    participants.length > 0 ? totalAmount / participants.length : 0;

  // 精算を実行する関数
  const handleSettle = () => {
    calculateSettlements();
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
              ¥{totalAmount.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-sm font-medium text-green-600">
              一人当たりの金額
            </div>
            <div className="text-2xl font-bold text-green-900">
              ¥{Math.round(perPersonAmount).toLocaleString()}
            </div>
          </div>
        </div>

        {/* 精算リスト */}
        {settlements.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">精算リスト</h3>
            <div className="space-y-2">
              {settlements.map((settlement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-gray-50 p-3"
                >
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
                    ¥{settlement.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            {participants.length === 0
              ? '参加者を追加してください'
              : expenses.length === 0
                ? '費用を追加してください'
                : '精算を計算してください'}
          </div>
        )}

        {/* 精算ボタン */}
        <div className="flex justify-center">
          <Button
            onClick={handleSettle}
            disabled={participants.length === 0 || expenses.length === 0}
            className="px-8"
          >
            <Calculator className="mr-2 h-4 w-4" />
            精算する
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
