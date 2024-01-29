import { validatePostalCode, validateRequire } from '../validationUtils';

describe('Form validation utilities - ', () => {
  describe('validatePostalCode', () => {
    test('postal code has characters', () => {
      const error = validatePostalCode('a111b');
      expect(error).toEqual('validation.postalCode.invalidFormat');
    });

    test('postal code is of wrong length', () => {
      const error = validatePostalCode('001100');
      expect(error).toEqual('validation.postalCode.invalidFormat');
    });

    test('postal code should not be empty', () => {
      const error = validatePostalCode('');
      expect(error).toEqual('validation.postalCode.invalidFormat');
    });

    test('valid postal code', () => {
      const error = validatePostalCode('00100');
      expect(error).toBeUndefined();
    });
  });

  describe('validateRequire', () => {
    test('will show error if field is empty', () => {
      const error = validateRequire('');
      expect(error).toBeDefined();
    });

    test('will show custom error message if field is empty and custom message is defined', () => {
      const error = validateRequire('', 'foo');
      expect(error).toEqual('foo');
    });
  });
});
