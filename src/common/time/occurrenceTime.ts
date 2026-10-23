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
