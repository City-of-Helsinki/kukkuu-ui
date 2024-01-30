import isEmail from 'validator/lib/isEmail';

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

/** validatePostalCode()
 * Validate postal code. We allow Finnish format: Five numbers that
 * can have leading zeroes. Example: 00100.
 * @param {string} value Input value.
 * @returns {string} translation key
 * @returns {void} if postal code fulfill the condition
 */
const validatePostalCode = (value: string) => {
  const valid: boolean = /^\d{5}$/.test(value);
  if (!value || !valid) return 'validation.postalCode.invalidFormat';
};

const validateEmail = (value: string) => {
  if (!isEmail(value)) return 'registration.form.guardian.email.input.error';
};

export { validatePostalCode, validateRequire, validateEmail };
