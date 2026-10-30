import { addMinutes } from 'date-fns/addMinutes';

import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  DEFAULT_TIME_ZONE,
} from './TimeConstants';
import { formatTime, newDate } from './utils';

export const getOccurrenceEndTime = (
  time: string | Date,
  durationMinutes?: number | null
): Date | null => {
  if (!durationMinutes || durationMinutes <= 0) {
    return null;
  }
  return addMinutes(newDate(time), durationMinutes);
};

export const formatOccurrenceTimeRange = (
  time: string | Date,
  durationMinutes?: number | null
): string => {
  const startTime = formatTime(newDate(time), DEFAULT_TIME_FORMAT);
  if (!durationMinutes || durationMinutes <= 0) {
    return startTime;
  }
  const endTime = formatTime(
    addMinutes(newDate(time), durationMinutes),
    DEFAULT_TIME_FORMAT
  );
  return `${startTime}–${endTime}`;
};

/**
 * Formats a duration in minutes into a human-readable string (e.g. "1 h 30 min", "2 h", or "45 min").
 * Returns null if minutes is null, undefined, or less than or equal to 0.
 *
 * @param minutes - Total duration in minutes.
 * @returns Formatted duration string, or null if duration is invalid or non-positive.
 */
export const formatDuration = (minutes?: number | null): string | null => {
  if (!minutes || minutes <= 0) return null;

  // Calculate full hours and leftover minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // When both hours and remaining minutes are present (e.g. "1 h 30 min")
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} h ${remainingMinutes} min`;
  }
  // When duration is in exact hours (e.g. "2 h")
  if (hours > 0) {
    return `${hours} h`;
  }
  // When duration is strictly under an hour (e.g. "45 min")
  return `${remainingMinutes} min`;
};

/**
 * Formats an occurrence start–end time range with explicit duration in parentheses
 * (e.g. "17:00–18:30 (1 h 30 min)"), or falls back to start time ("17:00") when duration is absent.
 */
export const formatOccurrenceTimeRangeWithDuration = (
  time: string | Date,
  durationMinutes?: number | null
): string => {
  const timeRange = formatOccurrenceTimeRange(time, durationMinutes);
  const formattedDuration = formatDuration(durationMinutes);
  if (formattedDuration) {
    return `${timeRange} (${formattedDuration})`;
  }
  return timeRange;
};

export const formatOccurrenceDateLong = (
  time?: string | Date | null,
  locale = 'fi'
): string => {
  if (!time) {
    return '';
  }
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    timeZone: DEFAULT_TIME_ZONE,
  }).format(date);
  const capitalizedWeekday =
    weekday.charAt(0).toUpperCase() + weekday.slice(1).replace('.', '');
  const formattedDate = formatTime(newDate(date), DEFAULT_DATE_FORMAT);
  return `${capitalizedWeekday} ${formattedDate}`;
};

export const formatOccurrenceDateRange = (
  startTime: string | Date,
  endTime: string | Date
): string => {
  const startDate = formatTime(newDate(startTime), DEFAULT_DATE_FORMAT);
  const endDate = formatTime(newDate(endTime), DEFAULT_DATE_FORMAT);
  return startDate === endDate ? startDate : `${startDate} – ${endDate}`;
};

export const getDateBadgeParts = (
  time: string | Date,
  locale = 'fi'
): { weekday: string; day: number; month: string } => {
  const date = new Date(time);
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    timeZone: DEFAULT_TIME_ZONE,
  })
    .format(date)
    .toUpperCase()
    .replace('.', '');

  const dayStr = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    timeZone: DEFAULT_TIME_ZONE,
  }).format(date);

  const month = new Intl.DateTimeFormat(locale, {
    month: 'long',
    timeZone: DEFAULT_TIME_ZONE,
  })
    .format(date)
    .toLowerCase();

  return {
    weekday,
    day: Number(dayStr),
    month,
  };
};
