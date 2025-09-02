import { CurrencyRepository } from '@/repository/CurrencyRepository';
import { CurrencySymbol, ExchangeRate } from '@/types';

/**
 * ExchangeRate.host APIからのレスポンス型定義
 */
interface CurrencySymbolsResponse {
  success: boolean;
  symbols: Record<string, string>;
}

interface ExchangeRatesResponse {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
}

/**
 * ExchangeRate.host APIを利用した通貨リポジトリの実装
 * APIエンドポイントを叩いて通貨情報を取得する具体的な処理を担当
 */
export class CurrencyApiRepositoryImpl implements CurrencyRepository {
  private readonly baseUrl = 'https://api.exchangerate.host';
  private readonly timeout = 10000; // 10秒タイムアウト

  /**
   * HTTPリクエストを実行する共通メソッド
   * @param url - リクエストURL
   * @returns Promise<T> - パースされたJSONレスポンス
   */
  private async fetchWithTimeout<T>(url: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('リクエストがタイムアウトしました');
        }
        throw new Error(`API通信エラー: ${error.message}`);
      }

      throw new Error('不明なエラーが発生しました');
    }
  }

  /**
   * 利用可能な通貨のリストを取得する
   * @returns Promise<CurrencySymbol[]> - 通貨シンボルのリスト
   */
  async getCurrencySymbols(): Promise<CurrencySymbol[]> {
    try {
      const response = await this.fetchWithTimeout<CurrencySymbolsResponse>(
        `${this.baseUrl}/symbols`,
      );

      if (!response.success) {
        throw new Error('通貨リストの取得に失敗しました');
      }

      // APIレスポンスをドメイン型にマッピング
      return Object.entries(response.symbols).map(([code, description]) => ({
        code,
        description,
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`通貨リスト取得エラー: ${error.message}`);
      }
      throw new Error('通貨リストの取得に失敗しました');
    }
  }

  /**
   * 指定した基準通貨に対する最新の為替レートを取得する
   * @param base - 基準通貨コード（デフォルト: 'EUR'）
   * @param symbols - 取得対象の通貨コードのリスト
   * @returns Promise<ExchangeRate> - 為替レート情報
   */
  async getExchangeRates(
    base: string = 'EUR',
    symbols?: string[],
  ): Promise<ExchangeRate> {
    try {
      // URLパラメータを構築
      const params = new URLSearchParams();
      params.set('base', base);

      if (symbols && symbols.length > 0) {
        params.set('symbols', symbols.join(','));
      }

      const response = await this.fetchWithTimeout<ExchangeRatesResponse>(
        `${this.baseUrl}/latest?${params.toString()}`,
      );

      if (!response.success) {
        throw new Error('為替レートの取得に失敗しました');
      }

      // APIレスポンスをドメイン型にマッピング
      return {
        base: response.base,
        date: response.date,
        rates: response.rates,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`為替レート取得エラー: ${error.message}`);
      }
      throw new Error('為替レートの取得に失敗しました');
    }
  }
}
