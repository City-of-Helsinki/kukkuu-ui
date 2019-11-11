import {
  validateBirthday,
  validateEqual,
  validateRequire,
} from '../validationUtils';

describe('Form validation utilities - ', () => {
  describe('validateBirthday', () => {
    test('return require text if value is empty', () => {
      const error = validateBirthday('');

      expect(error).toEqual('validation.general.required');
    });

    test('return wrong format error if user try to input number, or general text', () => {
      const error = validateBirthday('foo');
      expect(error).toEqual('validation.date.invalidFormat');
    });

    test('return wrong format error if user try to wrong format date', () => {
      const error = validateBirthday('1f10.149.13');
      expect(error).toEqual('validation.date.invalidFormat');
    });

    test('return wrong unsupported message if kid birthday is in future or before supported year', () => {
      const error = validateBirthday('12.12.2100');
      expect(error).toEqual('validation.date.unSupported');
    });
  });

  describe('validateEqual', () => {
    test('return require text if value is empty', () => {
      const error = validateEqual('', 'foo', 'bar');

      expect(error).toEqual('validation.general.required');
    });

    test('return error text if value is not equal', () => {
      const error = validateEqual('ble', 'foo', 'bar');

      expect(error).toEqual('bar');
    });

    test('return error text if value is not equal in type', () => {
      const error = validateEqual('31', 31, 'bar');

      expect(error).toEqual('bar');
    });

    test('return error text if value is not equal in type', () => {
      const error = validateEqual('31', 31, 'bar');

      expect(error).toEqual('bar');
    });

    test('will not return error text if value and compared value is different in lower/uppercase', () => {
      const error = validateEqual('foo', 'fOo', 'bar');

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
