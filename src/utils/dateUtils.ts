/**
 * Formats a date to "MMM DD, YYYY" (e.g. "Jan 05, 2025").
 * @param date - A Date object or ISO date string.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formats a date to an ISO string suitable for database storage.
 * @param date - The Date object to format.
 */
export function formatDateForDB(date: Date): string {
  return date.toISOString();
}

/**
 * Returns true if the given due date is in the past.
 * @param dueDate - ISO date string or null.
 */
export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) {
    return false;
  }
  return new Date(dueDate) < new Date();
}

/**
 * Returns the number of days until the due date, or null if there is no due date.
 * Negative values indicate the date has already passed.
 * @param dueDate - ISO date string or null.
 */
export function getDaysUntilDue(dueDate: string | null): number | null {
  if (!dueDate) {
    return null;
  }
  const now = new Date();
  const due = new Date(dueDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((due.getTime() - now.getTime()) / msPerDay);
}
