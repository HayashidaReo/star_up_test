'use client';

import React from 'react';
import { ParticipantsSection } from '../components/organisms/ParticipantsSection';
import { ExpensesSection } from '../components/organisms/ExpensesSection';
import { SettlementSection } from '../components/organisms/SettlementSection';
import { useCurrency } from '../hooks/useCurrency';

export default function Home() {
  // ページレベルで通貨データを取得
  const { currencies, isLoading: currenciesLoading, error: currenciesError } = useCurrency();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* アプリタイトル */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            star_up_test
          </h1>
          <p className="text-gray-600">
            友人との旅行で発生した費用を簡単に精算
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="space-y-6">
          {/* 参加者セクション */}
          <ParticipantsSection />

          {/* 費用セクション */}
          <ExpensesSection 
            currencies={currencies}
            currenciesLoading={currenciesLoading}
            currenciesError={currenciesError}
          />

          {/* 精算結果セクション */}
          <SettlementSection 
            currencies={currencies}
            currenciesLoading={currenciesLoading}
            currenciesError={currenciesError}
          />
        </div>
      </div>
    </div>
  );
}
