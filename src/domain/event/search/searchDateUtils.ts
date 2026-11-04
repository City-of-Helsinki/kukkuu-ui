/**
 * Date parsing and formatting utilities for event search filters.
 */

/**
 * Creates a Date instance representing the start of the specified day (00:00:00.000 local time),
 * ensuring the date components are valid (e.g. rejects non-existent dates like February 30).
 *
 * @param year - Full 4-digit calendar year.
 * @param monthIndex - Zero-based month index (0 for January, 11 for December).
 * @param day - Day of the month (1-31).
 * @returns A validated local Date object, or null if the date is invalid.
 */
export const createValidDate = (
  year: number,
  monthIndex: number,
  day: number
): Date | null => {
  const date = new Date(year, monthIndex, day, 0, 0, 0, 0);
  if (
    date.getFullYear() === year &&
    date.getMonth() === monthIndex &&
    date.getDate() === day
  ) {
    return date;
  }
  return null;
};

/**
 * Parses a Finnish date string ('DD.MM.YYYY' or 'D.M.YYYY') into a local start-of-day Date.
 * Validates calendar correctness (e.g., leap years and month lengths).
 *
 * @param dateStr - Finnish date string to parse.
 * @returns Valid Date object representing start of the day, or null if invalid or malformed.
 */
export const parseFinnishDate = (dateStr?: string | null): Date | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  const fiMatch = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(trimmed);
  if (!fiMatch) return null;

  const day = Number.parseInt(fiMatch[1], 10);
  const monthIndex = Number.parseInt(fiMatch[2], 10) - 1;
  const year = Number.parseInt(fiMatch[3], 10);

  return createValidDate(year, monthIndex, day);
};

/**
 * Parses an ISO 8601 date string ('YYYY-MM-DD') into a local start-of-day Date.
 * Validates calendar correctness (e.g., leap years and month lengths).
 *
 * @param dateStr - ISO date string to parse.
 * @returns Valid Date object representing start of the day, or null if invalid or malformed.
 */
export const parseIsoDate = (dateStr?: string | null): Date | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!isoMatch) return null;

  const year = Number.parseInt(isoMatch[1], 10);
  const monthIndex = Number.parseInt(isoMatch[2], 10) - 1;
  const day = Number.parseInt(isoMatch[3], 10);

  return createValidDate(year, monthIndex, day);
};

/**
 * Parses a date string formatted as either Finnish 'DD.MM.YYYY' or ISO 'YYYY-MM-DD'
 * into a local start-of-day Date object. Returns null if invalid.
 *
 * Evaluates Finnish format first, falling back to ISO format.
 *
 * @param dateStr - Date string in either Finnish or ISO format.
 * @returns Valid Date object, or null if neither matcher matches or the date is invalid.
 */
export const parseFilterStartDate = (dateStr?: string | null): Date | null => {
  return parseFinnishDate(dateStr) ?? parseIsoDate(dateStr);
};

/**
 * Converts an ISO date string (YYYY-MM-DD) into Finnish format (DD.MM.YYYY).
 */
export const formatIsoDateToFinnish = (isoStr?: string | null): string => {
  const d = parseFilterStartDate(isoStr);
  if (!d) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * Converts a Finnish date string (DD.MM.YYYY) into ISO format (YYYY-MM-DD).
 */
export const formatFinnishDateToIso = (fiStr?: string | null): string => {
  const d = parseFilterStartDate(fiStr);
  if (!d) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};
