import { getChildFormModalValues } from '../ChildUtils';
import { defaultRegistrationData } from '../../registration/state/RegistrationReducers';

describe('ChildUtil', () => {
  describe('getChildFormModalValues', () => {
    const defaultChild = defaultRegistrationData.formValues.children[0];

    test('does not return fields which are irrelevant', () => {
      const formModalChild = getChildFormModalValues({
        ...defaultChild,
      });

      ['name', 'homeCity', 'postalCode', 'relationship'].forEach((field) => {
        expect(formModalChild).toHaveProperty(field);
      });
    });
  });
});
