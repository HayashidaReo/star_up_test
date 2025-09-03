import { CurrencySymbol, ExchangeRate } from '@/types';

/**
 * 通貨関連データアクセスのインターフェース
 * このインターフェースを実装することで、データ取得元（API、ローカルストレージなど）を抽象化
 */
export interface CurrencyRepository {
  /**
   * 利用可能な通貨のリストを取得する
   * @returns Promise<CurrencySymbol[]> - 通貨シンボルのリスト
   * @throws {Error} - データ取得に失敗した場合
   */
  getCurrencySymbols(): Promise<CurrencySymbol[]>;

  /**
   * 指定した基準通貨に対する最新の為替レートを取得する
   * @param base - 基準通貨コード（例: 'USD', 'JPY'）
   * @param symbols - 取得対象の通貨コードのリスト（省略時は全通貨）
   * @returns Promise<ExchangeRate> - 為替レート情報
   * @throws {Error} - データ取得に失敗した場合
   */
  getExchangeRates(base?: string, symbols?: string[]): Promise<ExchangeRate>;
}
