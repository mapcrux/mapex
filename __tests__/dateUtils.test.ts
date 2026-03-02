import {formatDate, formatDateForDB, isOverdue, getDaysUntilDue} from '../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats a Date object to "MMM DD, YYYY"', () => {
      const date = new Date('2025-01-05T12:00:00.000Z');
      const result = formatDate(date);
      expect(result).toMatch(/Jan/);
      expect(result).toMatch(/2025/);
    });

    it('formats an ISO string the same as a Date object', () => {
      const isoString = '2025-06-15T00:00:00.000Z';
      const fromString = formatDate(isoString);
      const fromDate = formatDate(new Date(isoString));
      expect(fromString).toBe(fromDate);
    });
  });

  describe('formatDateForDB', () => {
    it('returns an ISO string', () => {
      const date = new Date('2025-03-20T10:30:00.000Z');
      const result = formatDateForDB(date);
      expect(result).toBe(date.toISOString());
    });
  });

  describe('isOverdue', () => {
    it('returns false when dueDate is null', () => {
      expect(isOverdue(null)).toBe(false);
    });

    it('returns true for a past date', () => {
      expect(isOverdue('2000-01-01T00:00:00.000Z')).toBe(true);
    });

    it('returns false for a future date', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      expect(isOverdue(future.toISOString())).toBe(false);
    });
  });

  describe('getDaysUntilDue', () => {
    it('returns null when dueDate is null', () => {
      expect(getDaysUntilDue(null)).toBeNull();
    });

    it('returns a negative number for a past date', () => {
      const past = new Date();
      past.setDate(past.getDate() - 5);
      expect(getDaysUntilDue(past.toISOString())).toBeLessThan(0);
    });

    it('returns a positive number for a future date', () => {
      const future = new Date();
      future.setDate(future.getDate() + 10);
      const days = getDaysUntilDue(future.toISOString());
      expect(days).toBeGreaterThan(0);
    });
  });
});
