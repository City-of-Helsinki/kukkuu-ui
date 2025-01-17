import { parse } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';

import { BACKEND_DATE_FORMAT, DEFAULT_TIME_ZONE } from './TimeConstants';

/**
 * Return new instance of Date, same with new Date()
 * Use this util function to keep all date-fns import in single place.
 * @param inp
 * @param formatStr
 */
export const newDate = (
  inp?: string | number | Date | null,
  formatStr?: string
) => {
  if (formatStr) {
    return parse(inp as string, formatStr, new Date());
  }
  return toZonedTime(inp ? new Date(inp) : new Date(), DEFAULT_TIME_ZONE);
};

/**
 * Format input date to backend time format by default. Can use custom format as 2nd params
 * @param inputDate
 * @param formatStr
 */
export const formatTime = (inputDate: Date, formatStr?: string) =>
  format(inputDate, formatStr || BACKEND_DATE_FORMAT, {
    timeZone: DEFAULT_TIME_ZONE,
  });

/**
 * Format month to zero indexed for date-fns
 * @param input
 */
export const toZeroBasedMonth = (input: number | string) => {
  return Number(input) - 1;
};
