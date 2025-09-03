import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CURRENCY_SYMBOLS, CURRENCIES, MAJOR_CURRENCIES } from './constants';

/**
 * クラス名をマージする関数
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ユニークIDを生成する関数
 * crypto.randomUUID()を使用してより安全なID生成を行う
 */
export function generateId(): string {
  // ブラウザ環境とNode.js環境の両方でcrypto APIを使用
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // フォールバック: Crypto APIを使った安全な文字列生成
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, (byte: number) =>
      byte.toString(16).padStart(2, '0'),
    ).join('');
  }

  // 最終フォールバック（非推奨だが、エラーを避けるため）
  return Math.random().toString(36).slice(2, 11);
}

/**
 * 通貨が主要通貨かどうかを判定する関数
 */
export function isMajorCurrency(currency: string): boolean {
  return MAJOR_CURRENCIES.has(currency);
}

/**
 * 通貨の表示形式を決定する関数
 * 主要通貨は記号、その他はISO 4217コードを使用
 */
export function getCurrencyDisplayFormat(currency: string): {
  symbol: string;
  isMajor: boolean;
} {
  const isMajor = isMajorCurrency(currency);
  const symbol = isMajor 
    ? CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]
    : currency; // ISO 4217コード
  
  return {
    symbol: symbol || currency,
    isMajor,
  };
}

/**
 * 参加者のイニシャルを取得する関数
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * 通貨表示用のフォーマット関数（より柔軟）
 * 精算結果や詳細表示で使用
 */
export function formatCurrencyAmount(
  amount: number,
  currency: string,
  options?: {
    showDecimals?: boolean;
    compact?: boolean;
  }
): string {
  const { compact = false } = options || {};
  const { symbol, isMajor } = getCurrencyDisplayFormat(currency);
  
  // デフォルトの小数点表示を通貨に応じて決定
  let { showDecimals } = options || {};
  if (showDecimals === undefined) {
    // JPY、KRW、CNYは通常整数表示、その他は小数点2桁
    showDecimals = !['JPY', 'KRW', 'CNY'].includes(currency);
  }
  
  // 数値の処理
  const processedAmount = showDecimals 
    ? Math.round(amount * 100) / 100 
    : Math.round(amount);
  
  // フォーマット
  const formattedAmount = showDecimals 
    ? processedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : processedAmount.toLocaleString('en-US');
  
  if (isMajor) {
    // 主要通貨: 記号 + 数値
    return compact ? `${symbol}${formattedAmount}` : `${symbol}${formattedAmount}`;
  } else {
    // その他通貨: コード + 数値
    return compact ? `${symbol}${formattedAmount}` : `${symbol} ${formattedAmount}`;
  }
}

// バリデーション関数は schemas.ts から再エクスポート
export {
  isValidString,
  isValidNumberIncludingZero as isValidNumber,
} from './schemas';
