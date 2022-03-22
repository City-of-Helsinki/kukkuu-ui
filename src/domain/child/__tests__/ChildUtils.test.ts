import {
  getChildFormModalBirthdate,
  getChildFormModalValues,
} from '../ChildUtils';
import { defaultChildFormBirthdate } from '../ChildConstants';
import { defaultRegistrationData } from '../../registration/state/RegistrationReducers';

describe('ChildUtil', () => {
  describe('getChildFormModalBirthdate', () => {
    test('should return child birthdate in format for form by default', () => {
      const childForm = getChildFormModalBirthdate();

      expect(childForm).toEqual(defaultChildFormBirthdate);
    });

    test('should return child birthdate in format for form by default when birthdate is empty string', () => {
      const childForm = getChildFormModalBirthdate('');

      expect(childForm).toEqual(defaultChildFormBirthdate);
    });

    test('should return child birthdate in format for form by default if given wrong format date', () => {
      const childForm = getChildFormModalBirthdate('2020-02-31');

      expect(childForm).toEqual(defaultChildFormBirthdate);
    });

    test('should give a nice form format birthdate data when given valid birthdate string', () => {
      const childForm = getChildFormModalBirthdate('2020-02-27');

      expect(childForm).toEqual({
        day: 27,
        month: 2,
        year: 2020,
      });
    });
  });

  describe('getChildFormModalValues', () => {
    const defaultChild = defaultRegistrationData.formValues.children[0];

    test('return child birthdate with form format by default', () => {
      const formModalChild = getChildFormModalValues(defaultChild);

      expect(formModalChild.birthdate).toEqual(defaultChildFormBirthdate);
    });

    test('return same child data but birthdate is replaced with form format', () => {
      const fakeChildWithBirthdate = {
        ...defaultChild,
        ...{ birthdate: '2020-02-27' },
      };
      const formModalChild = getChildFormModalValues(fakeChildWithBirthdate);

      expect(formModalChild.birthdate).toEqual({
        day: 27,
        month: 2,
        year: 2020,
      });
    });

    test('does not return fields which are irrelevant', () => {
      const formModalChild = getChildFormModalValues({
        ...defaultChild,
      });

      [
        'firstName',
        'lastName',
        'homeCity',
        'postalCode',
        'relationship',
      ].forEach((field) => {
        expect(Object.keys(formModalChild).includes(field));
      });
    });
  });
});
