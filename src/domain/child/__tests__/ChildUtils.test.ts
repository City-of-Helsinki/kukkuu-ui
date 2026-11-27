import {
  getChildFormModalValues,
  getSupportedChildData,
} from '../ChildUtils';
import { defaultRegistrationData } from '../../registration/state/RegistrationReducers';
import { fakeThemePath } from '../../../utils/eventMockDataUtils';

describe('ChildUtil', () => {
  describe('getChildFormModalValues', () => {
    const defaultChild = defaultRegistrationData.formValues.children[0];

    test('does not return fields which are irrelevant', () => {
      const formModalChild = getChildFormModalValues({
        ...defaultChild,
      });

      ['name', 'homeCity', 'postalCode', 'themePathId', 'relationship'].forEach(
        (field) => {
          expect(formModalChild).toHaveProperty(field);
        }
      );
    });
  });

  describe('getSupportedChildData', () => {
    test('omits themePath object and normalizes empty themePathId to null', () => {
      const payload = getSupportedChildData(
        {
          birthyear: 2020,
          homeCity: 'Helsinki',
          name: 'Eveliina',
          postalCode: '00100',
          themePathId: '',
          themePath: fakeThemePath(),
        } as Parameters<typeof getSupportedChildData>[0],
        true
      );

      expect(payload).not.toHaveProperty('themePath');
      expect(payload).not.toHaveProperty('homeCity');
      expect(payload).not.toHaveProperty('birthyear');
      expect(payload).toHaveProperty('themePathId', null);
    });
  });
});
