import { describe, it, expect } from 'vitest';
import {
  generateId,
  getInitials,
  formatCurrencyAmount,
  getCurrencyDisplayFormat,
  formatCurrencyOption,
} from '../utils';
import { isValidString, isValidNumberIncludingZero } from '../schemas';
import { CURRENCIES } from '../constants';

describe('utils', () => {
  describe('generateId', () => {
    it('should generate a unique string ID', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toBeTypeOf('string');
      expect(id2).toBeTypeOf('string');
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('getCurrencyDisplayFormat', () => {
    it('should return correct currency display formats', () => {
      const jpy = getCurrencyDisplayFormat(CURRENCIES.JPY);
      expect(jpy.symbol).toBe('¥');
      expect(jpy.isMajor).toBe(true);

      const usd = getCurrencyDisplayFormat(CURRENCIES.USD);
      expect(usd.symbol).toBe('$');
      expect(usd.isMajor).toBe(true);

      const eur = getCurrencyDisplayFormat(CURRENCIES.EUR);
      expect(eur.symbol).toBe('€');
      expect(eur.isMajor).toBe(true);
    });

    it('should handle minor currencies', () => {
      const unknown = getCurrencyDisplayFormat('THB');
      expect(unknown.symbol).toBe('THB');
      expect(unknown.isMajor).toBe(false);
    });
  });

  describe('getInitials', () => {
    it('should return initials for single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should return initials for multiple words', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('John Michael Doe')).toBe('JM');
    });

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('');
    });

    it('should handle single character', () => {
      expect(getInitials('A')).toBe('A');
    });

    it('should convert to uppercase', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });

  describe('formatCurrencyAmount', () => {
    it('should format amount with major currencies', () => {
      expect(formatCurrencyAmount(1000, CURRENCIES.JPY)).toBe('¥1,000');
      expect(formatCurrencyAmount(1000000, CURRENCIES.JPY)).toBe('¥1,000,000');
      expect(formatCurrencyAmount(1000, CURRENCIES.KRW)).toBe('₩1,000');
      expect(formatCurrencyAmount(1000, CURRENCIES.CNY)).toBe('¥1,000');
      expect(formatCurrencyAmount(1000, CURRENCIES.USD)).toBe('$1,000.00');
      expect(formatCurrencyAmount(1000, CURRENCIES.EUR)).toBe('€1,000.00');
    });

    it('should format amount with minor currencies', () => {
      expect(formatCurrencyAmount(1000, 'THB')).toBe('THB 1,000.00');
      expect(formatCurrencyAmount(25000000, 'VND')).toBe('VND 25,000,000.00');
    });

    it('should handle zero amount', () => {
      expect(formatCurrencyAmount(0, CURRENCIES.JPY)).toBe('¥0');
      expect(formatCurrencyAmount(0, CURRENCIES.KRW)).toBe('₩0');
      expect(formatCurrencyAmount(0, CURRENCIES.CNY)).toBe('¥0');
      expect(formatCurrencyAmount(0, CURRENCIES.USD)).toBe('$0.00');
    });

    it('should handle decimal amounts correctly', () => {
      expect(formatCurrencyAmount(1234.56, CURRENCIES.JPY)).toBe('¥1,235'); // JPY rounds to integer
      expect(formatCurrencyAmount(1234.56, CURRENCIES.KRW)).toBe('₩1,235'); // KRW rounds to integer
      expect(formatCurrencyAmount(1234.56, CURRENCIES.CNY)).toBe('¥1,235'); // CNY rounds to integer
      expect(formatCurrencyAmount(1234.56, CURRENCIES.USD)).toBe('$1,234.56');
    });

    it('should support showDecimals option', () => {
      expect(
        formatCurrencyAmount(1000, CURRENCIES.JPY, { showDecimals: true }),
      ).toBe('¥1,000.00');
      expect(
        formatCurrencyAmount(1000, CURRENCIES.KRW, { showDecimals: true }),
      ).toBe('₩1,000.00');
      expect(
        formatCurrencyAmount(1000, CURRENCIES.CNY, { showDecimals: true }),
      ).toBe('¥1,000.00');
      expect(
        formatCurrencyAmount(1000, CURRENCIES.USD, { showDecimals: false }),
      ).toBe('$1,000');
    });
  });

  describe('isValidString', () => {
    it('should return true for valid strings', () => {
      expect(isValidString('hello')).toBe(true);
      expect(isValidString('  hello  ')).toBe(true);
    });

    it('should return false for empty or whitespace strings', () => {
      expect(isValidString('')).toBe(false);
      expect(isValidString('   ')).toBe(false);
      expect(isValidString('\t\n')).toBe(false);
    });
  });

  describe('isValidNumberIncludingZero', () => {
    it('should return true for valid numbers', () => {
      expect(isValidNumberIncludingZero(100)).toBe(true);
      expect(isValidNumberIncludingZero(0)).toBe(true);
      expect(isValidNumberIncludingZero('100')).toBe(true);
      expect(isValidNumberIncludingZero('0')).toBe(true);
    });

    it('should return false for invalid numbers', () => {
      expect(isValidNumberIncludingZero(-1)).toBe(false);
      expect(isValidNumberIncludingZero('')).toBe(false);
      expect(isValidNumberIncludingZero('abc')).toBe(false);
      expect(isValidNumberIncludingZero(NaN)).toBe(false);
    });
  });

  describe('formatCurrencyOption', () => {
    it('should format currency code and description correctly', () => {
      expect(formatCurrencyOption('USD', 'US Dollar')).toBe('USD - US Dollar');
      expect(formatCurrencyOption('JPY', 'Japanese Yen')).toBe('JPY - Japanese Yen');
      expect(formatCurrencyOption('EUR', 'Euro')).toBe('EUR - Euro');
    });

    it('should handle empty description', () => {
      expect(formatCurrencyOption('USD', '')).toBe('USD - ');
    });

    it('should handle special characters in description', () => {
      expect(formatCurrencyOption('USD', 'United States Dollar (USD)')).toBe('USD - United States Dollar (USD)');
    });
  });
});
