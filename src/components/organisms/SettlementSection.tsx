'use client';

import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { EmptyState } from '@/components/molecules/EmptyState';
import { SettlementItem } from '@/components/molecules/SettlementItem';
import { CurrencySelectApi } from '@/components/molecules/CurrencySelectApi';
import { Button } from '@/components/atoms/button';
import { ErrorDisplay } from '@/components/molecules/ErrorDisplay';
import {
  useAppStore,
  participantsSelector,
  expensesSelector,
  settlementsSelector,
} from '@/store/useAppStore';
import { useCurrency, useSettlementWithCurrency } from '@/hooks/useCurrency';
import { MESSAGES } from '@/lib/constants';
import { formatAmount } from '@/lib/utils';

export function SettlementSection() {
  const participants = useAppStore(participantsSelector);
  const expenses = useAppStore(expensesSelector);
  const settlements = useAppStore(settlementsSelector);

  // 通貨関連のフック
  const {
    currencies,
    isLoading: isCurrenciesLoading,
    error: currenciesError,
    selectedCurrency,
    setSelectedCurrency,
  } = useCurrency();

  // 精算計算関連のフック
  const {
    settlements: currencySettlements,
    convertedExpenses,
    settlementCurrency,
    isCalculating,
    error: calculationError,
    calculateWithCurrency,
  } = useSettlementWithCurrency();

  // 精算計算の実行
  const handleCalculateWithCurrency = async () => {
    if (participants.length === 0 || expenses.length === 0) return;

    await calculateWithCurrency(participants, expenses, selectedCurrency);
  };

  // 通貨変更時の自動再計算
  useEffect(() => {
    const handleCalculation = async () => {
      if (participants.length > 0 && expenses.length > 0 && selectedCurrency) {
        await calculateWithCurrency(participants, expenses, selectedCurrency);
      }
    };
    handleCalculation();
  }, [selectedCurrency, participants, expenses, calculateWithCurrency]);

  // 合計金額を計算（変換済み費用ベース）
  const totalAmount =
    convertedExpenses.length > 0
      ? convertedExpenses.reduce(
          (sum, expense) => sum + expense.convertedAmount,
          0,
        )
      : expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // 一人当たりの金額を計算
  const perPersonAmount =
    participants.length > 0 ? totalAmount / participants.length : 0;

  // 実際に表示する精算リスト（通貨変換済みがあれば優先）
  const displaySettlements =
    currencySettlements.length > 0 ? currencySettlements : settlements;

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
        {/* 通貨選択セクション */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="settlement-currency"
              className="text-sm font-medium text-gray-700"
            >
              精算通貨
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <CurrencySelectApi
                  value={selectedCurrency}
                  onValueChange={setSelectedCurrency}
                  currencies={currencies}
                  isLoading={isCurrenciesLoading}
                  error={currenciesError ?? undefined}
                />
              </div>
              <Button
                onClick={handleCalculateWithCurrency}
                disabled={
                  isCalculating ||
                  participants.length === 0 ||
                  expenses.length === 0
                }
                className="whitespace-nowrap"
              >
                {isCalculating ? '計算中...' : '精算計算'}
              </Button>
            </div>
          </div>

          {/* 計算エラーの表示 */}
          {calculationError && <ErrorDisplay message={calculationError} />}
        </div>

        {/* 概要表示 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-sm font-medium text-blue-600">
              合計金額
              {settlementCurrency && settlementCurrency !== 'JPY' && (
                <span className="ml-1 text-xs">({settlementCurrency})</span>
              )}
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {settlementCurrency === 'JPY'
                ? formatAmount(totalAmount)
                : `${settlementCurrency} ${Math.round(totalAmount * 100) / 100}`}
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-sm font-medium text-green-600">
              一人当たりの金額
              {settlementCurrency && settlementCurrency !== 'JPY' && (
                <span className="ml-1 text-xs">({settlementCurrency})</span>
              )}
            </div>
            <div className="text-2xl font-bold text-green-900">
              {settlementCurrency === 'JPY'
                ? formatAmount(Math.round(perPersonAmount))
                : `${settlementCurrency} ${Math.round(perPersonAmount * 100) / 100}`}
            </div>
          </div>
        </div>

        {/* 変換詳細の表示（複数通貨がある場合） */}
        {convertedExpenses.length > 0 &&
          convertedExpenses.some(
            (expense) => expense.originalCurrency !== expense.targetCurrency,
          ) && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">通貨変換詳細</h3>
              <div className="text-sm text-gray-600">
                <div className="grid grid-cols-1 gap-2">
                  {convertedExpenses
                    .filter(
                      (expense) =>
                        expense.originalCurrency !== expense.targetCurrency,
                    )
                    .map((expense, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded bg-gray-50 px-2 py-1"
                      >
                        <span>
                          {expense.originalCurrency} {expense.originalAmount} →{' '}
                          {expense.targetCurrency} {expense.convertedAmount}
                        </span>
                        <span className="text-xs text-gray-500">
                          レート: {expense.rate.toFixed(4)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

        {/* 精算リスト */}
        {displaySettlements.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">精算リスト</h3>
            <div className="space-y-2">
              {displaySettlements.map((settlement, index) => (
                <SettlementItem
                  key={index}
                  settlement={{
                    ...settlement,
                    // 通貨情報を含める（後でSettlementItemコンポーネントも更新が必要）
                  }}
                />
              ))}
            </div>
            {settlementCurrency && settlementCurrency !== 'JPY' && (
              <p className="mt-2 text-xs text-gray-500">
                ※金額は {settlementCurrency} 建てで表示されています
              </p>
            )}
          </div>
        ) : (
          <EmptyState message={getEmptyMessage()} />
        )}
      </CardContent>
    </Card>
  );
}
