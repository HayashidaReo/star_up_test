import { describe, it, expect } from 'vitest';
import {
  generateId,
  getCurrencySymbol,
  getInitials,
  formatAmount,
  isValidString,
  isValidNumber,
} from '../utils';
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

  describe('getCurrencySymbol', () => {
    it('should return correct currency symbols', () => {
      expect(getCurrencySymbol(CURRENCIES.JPY)).toBe('¥');
      expect(getCurrencySymbol(CURRENCIES.USD)).toBe('$');
      expect(getCurrencySymbol(CURRENCIES.EUR)).toBe('€');
    });

    it('should return JPY symbol for unknown currency', () => {
      expect(getCurrencySymbol('UNKNOWN')).toBe('¥');
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

  describe('formatAmount', () => {
    it('should format amount with JPY currency', () => {
      expect(formatAmount(1000)).toBe('¥1,000');
      expect(formatAmount(1000000)).toBe('¥1,000,000');
    });

    it('should format amount with specified currency', () => {
      expect(formatAmount(1000, CURRENCIES.USD)).toBe('$1,000');
      expect(formatAmount(1000, CURRENCIES.EUR)).toBe('€1,000');
    });

    it('should handle zero amount', () => {
      expect(formatAmount(0)).toBe('¥0');
    });

    it('should handle decimal amounts', () => {
      expect(formatAmount(1234.56)).toBe('¥1,235');
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

  describe('isValidNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isValidNumber(100)).toBe(true);
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber('100')).toBe(true);
      expect(isValidNumber('0')).toBe(true);
    });

    it('should return false for invalid numbers', () => {
      expect(isValidNumber(-1)).toBe(false);
      expect(isValidNumber('')).toBe(false);
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber(NaN)).toBe(false);
    });
  });
});
