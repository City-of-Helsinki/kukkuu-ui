import { newMoment } from '../../time/utils';
import {
  SUPPORTED_START_BIRTHDAY,
  DEFAULT_DATE_FORMAT,
} from '../../time/TimeConstants';

/**
 * validateRequire()
 * Check if field is required.
 * @param value
 * @param customMessage
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateRequire = (value: any, customMessage?: string) => {
  if (!value) {
    return customMessage || 'validation.general.required';
  }
};

/** validateBirthday()
 * Validate user input child birthday.
 * This app only target recently born child, so we support child which born after 2019 only.
 * Input time which come from future is not accepted
 * @param value Input value.
 */
const validateBirthday = (value: string | number) => {
  if (!value) {
    return 'validation.general.required';
  }

  const inputMoment = newMoment(value, DEFAULT_DATE_FORMAT);
  const nowMoment = newMoment();

  if (!inputMoment.isValid()) {
    return 'validation.date.invalidFormat';
  }

  const supportedStart = newMoment(SUPPORTED_START_BIRTHDAY);

  if (inputMoment < supportedStart || inputMoment > nowMoment) {
    return 'validation.date.unSupported';
  }
};

/**
 * validateEqual()
 * Usually to check if user is located in supported area.
 * Can be used widely to check in many different case.
 * @param value Input value
 * @param comparedValue Value to compare
 * @param errorMessage Error message when not match
 */
const validateEqual = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparedValue: any,
  errorMessage: string
) => {
  let cloneValue = value;
  let cloneComparedValue = comparedValue;

  if (!value) {
    return 'validation.general.required';
  }

  if (typeof value === 'string' && typeof comparedValue === 'string') {
    cloneValue = value.toLowerCase();
    cloneComparedValue = comparedValue.toLowerCase();
  }

  if (cloneValue !== cloneComparedValue) {
    return errorMessage;
  }
};

export { validateBirthday, validateEqual, validateRequire };
