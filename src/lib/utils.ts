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
 */
export function generateId(): string {
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
  return `${symbol}${amount.toLocaleString()}`;
}

/**
 * 文字列をトリムして空でないかチェックする
 */
export function isValidString(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * 数値が有効かチェックする
 */
export function isValidNumber(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
}
