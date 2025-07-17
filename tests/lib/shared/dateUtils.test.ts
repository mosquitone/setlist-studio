import { describe, it, expect } from 'vitest';
import {
  formatDateJST,
  formatDateTimeJST,
  formatEventDateJST,
  formatDateForInput,
} from '@/lib/shared/dateUtils';

describe('dateUtils', () => {
  describe('formatDateJST', () => {
    it('should format a valid date string to Japanese format', () => {
      const result = formatDateJST('2025-07-17T10:30:00Z');
      expect(result).toBe('2025年7月17日');
    });

    it('should handle ISO date string', () => {
      const result = formatDateJST('2025-12-25T00:00:00Z');
      expect(result).toBe('2025年12月25日');
    });

    it('should return empty string for null', () => {
      const result = formatDateJST(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined', () => {
      const result = formatDateJST(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = formatDateJST('');
      expect(result).toBe('');
    });
  });

  describe('formatDateTimeJST', () => {
    it('should format a valid date string to Japanese datetime format', () => {
      const result = formatDateTimeJST('2025-07-17T10:30:00Z');
      expect(result).toBe('2025年7月17日 19:30');
    });

    it('should handle different times', () => {
      const result = formatDateTimeJST('2025-12-25T15:45:00Z');
      expect(result).toBe('2025年12月26日 00:45');
    });

    it('should return empty string for null', () => {
      const result = formatDateTimeJST(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined', () => {
      const result = formatDateTimeJST(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = formatDateTimeJST('');
      expect(result).toBe('');
    });
  });

  describe('formatEventDateJST', () => {
    it('should format a valid date string to Japanese event date format', () => {
      const result = formatEventDateJST('2025-07-17T10:30:00Z');
      expect(result).toBe('2025/7/17');
    });

    it('should handle different dates', () => {
      const result = formatEventDateJST('2025-12-25T00:00:00Z');
      expect(result).toBe('2025/12/25');
    });

    it('should return empty string for null', () => {
      const result = formatEventDateJST(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined', () => {
      const result = formatEventDateJST(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = formatEventDateJST('');
      expect(result).toBe('');
    });
  });

  describe('formatDateForInput', () => {
    it('should format a valid date string to YYYY-MM-DD format', () => {
      const result = formatDateForInput('2025-07-17T10:30:00Z');
      expect(result).toBe('2025-07-17');
    });

    it('should handle different dates', () => {
      const result = formatDateForInput('2025-12-25T15:45:00Z');
      expect(result).toBe('2025-12-25');
    });

    it('should handle date only strings', () => {
      const result = formatDateForInput('2025-07-17');
      expect(result).toBe('2025-07-17');
    });

    it('should return empty string for null', () => {
      const result = formatDateForInput(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined', () => {
      const result = formatDateForInput(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = formatDateForInput('');
      expect(result).toBe('');
    });

    it('should return empty string for invalid date string', () => {
      const result = formatDateForInput('invalid-date');
      expect(result).toBe('');
    });

    it('should return empty string for malformed date', () => {
      const result = formatDateForInput('2025-13-32');
      expect(result).toBe('');
    });
  });

  // Edge cases and error handling
  describe('Edge cases', () => {
    it('should handle very old dates', () => {
      const result = formatDateForInput('1900-01-01T00:00:00Z');
      expect(result).toBe('1900-01-01');
    });

    it('should handle future dates', () => {
      const result = formatDateForInput('2099-12-31T23:59:59Z');
      expect(result).toBe('2099-12-31');
    });

    it('should handle leap year dates', () => {
      const result = formatDateForInput('2024-02-29T00:00:00Z');
      expect(result).toBe('2024-02-29');
    });

    it('should handle timezone differences correctly', () => {
      // Test with a specific UTC time that might cross date boundaries
      const result = formatDateForInput('2025-07-17T00:00:00Z');
      expect(result).toBe('2025-07-17');
    });
  });
});
