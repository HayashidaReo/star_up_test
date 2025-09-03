import { useState, useEffect, useCallback } from 'react';
import { ConvertCurrencyUseCase } from '@/domain/ConvertCurrencyUseCase';
import { CurrencyRepositoryFactory } from '@/data/CurrencyRepositoryFactory';
import {
  CurrencySymbol,
  ConvertedAmount,
  Expense,
  Participant,
  Settlement,
} from '@/types';
import { SettlementUseCase } from '@/domain/SettlementUseCase';

// シングルトンインスタンスを作成（依存性注入パターンの簡素化版）
console.log('🚀 useCurrency: Creating repository instance');
const currencyRepository = CurrencyRepositoryFactory.create();
const convertCurrencyUseCase = new ConvertCurrencyUseCase(currencyRepository);
const settlementUseCase = new SettlementUseCase(convertCurrencyUseCase);

interface UseCurrencyState {
  currencies: CurrencySymbol[];
  isLoading: boolean;
  error: string | null;
  selectedCurrency: string;
}

interface UseCurrencyActions {
  setSelectedCurrency: (currency: string) => void;
  refreshCurrencies: () => Promise<void>;
}

/**
 * 通貨管理に関するカスタムフック
 * 通貨リストの取得・キャッシュ・選択状態の管理を担当
 */
export function useCurrency(): UseCurrencyState & UseCurrencyActions {
  const [currencies, setCurrencies] = useState<CurrencySymbol[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('JPY');

  const refreshCurrencies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const currencyList =
        await convertCurrencyUseCase.getAvailableCurrencies();
      setCurrencies(currencyList);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '通貨リストの取得に失敗しました';
      setError(errorMessage);
      console.error('通貨リスト取得エラー:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初回ロード時に通貨リストを取得
  useEffect(() => {
    refreshCurrencies();
  }, [refreshCurrencies]);

  return {
    currencies,
    isLoading,
    error,
    selectedCurrency,
    setSelectedCurrency,
    refreshCurrencies,
  };
}

interface UseSettlementWithCurrencyState {
  settlements: Settlement[];
  convertedExpenses: ConvertedAmount[];
  settlementCurrency: string;
  isCalculating: boolean;
  error: string | null;
}

interface UseSettlementWithCurrencyActions {
  calculateWithCurrency: (
    participants: Participant[],
    expenses: Expense[],
    targetCurrency?: string,
  ) => Promise<void>;
}

/**
 * 通貨変換を含む精算計算に関するカスタムフック
 * 精算計算・通貨変換・結果の管理を担当
 */
export function useSettlementWithCurrency(): UseSettlementWithCurrencyState &
  UseSettlementWithCurrencyActions {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [convertedExpenses, setConvertedExpenses] = useState<ConvertedAmount[]>(
    [],
  );
  const [settlementCurrency, setSettlementCurrency] = useState<string>('JPY');
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateWithCurrency = useCallback(
    async (
      participants: Participant[],
      expenses: Expense[],
      targetCurrency?: string,
    ) => {
      try {
        setIsCalculating(true);
        setError(null);

        const result = await settlementUseCase.calculateSettlementsWithCurrency(
          participants,
          expenses,
          targetCurrency,
        );

        setSettlements(result.settlements);
        setConvertedExpenses(result.convertedExpenses);
        setSettlementCurrency(result.settlementCurrency);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '精算計算に失敗しました';
        setError(errorMessage);
        console.error('精算計算エラー:', err);

        // エラー時は空の結果をセット
        setSettlements([]);
        setConvertedExpenses([]);
      } finally {
        setIsCalculating(false);
      }
    },
    [],
  );

  return {
    settlements,
    convertedExpenses,
    settlementCurrency,
    isCalculating,
    error,
    calculateWithCurrency,
  };
}
