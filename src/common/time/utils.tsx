import moment from 'moment';

import { BACKEND_DATE_FORMAT } from './TimeConstants';

/**
 * Return new instance of moment, same with moment()
 * Use this util function to keep all moment import in single place.
 * @param inp
 * @param format
 * @param strict
 */
export const newMoment = (
  inp?: moment.MomentInput,
  format?: moment.MomentFormatSpecification,
  strict?: boolean
) => moment(inp, format, strict);

/**
 * Format input moment to backend time format by default. Can use custom format as 2nd params
 * @param inputMoment
 * @param format
 */
export const formatTime = (inputMoment: moment.Moment, format?: string) =>
  inputMoment.format(format || BACKEND_DATE_FORMAT);

/**
 * Format month to zero indexed for Moment
 * @param input
 */
export const toZeroBasedMonth = (input: number | string) => {
  return Number(input) - 1;
};
