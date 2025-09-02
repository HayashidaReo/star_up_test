import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CURRENCY_SYMBOLS, CURRENCIES } from './constants';

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
  console.warn(
    'No secure random number generator available, using Math.random() as fallback',
  );
  return Math.random().toString(36).substr(2, 9);
}

/**
 * 通貨記号を取得する関数
 */
export function getCurrencySymbol(currency: string): string {
  return (
    CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] ||
    CURRENCY_SYMBOLS[CURRENCIES.JPY]
  );
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
 * 金額をフォーマットする関数
 */
export function formatAmount(
  amount: number,
  currency: string = CURRENCIES.JPY,
): string {
  const symbol = getCurrencySymbol(currency);
  const roundedAmount = Math.round(amount);
  return `${symbol}${roundedAmount.toLocaleString()}`;
}

// バリデーション関数は schemas.ts から再エクスポート
export {
  isValidString,
  isValidNumberIncludingZero as isValidNumber,
} from './schemas';
