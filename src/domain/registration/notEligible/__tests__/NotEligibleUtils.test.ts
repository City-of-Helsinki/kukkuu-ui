import { getEligibleCities, isChildEligible } from '../NotEligibleUtils';
import { RegistrationFormValues } from '../../types/RegistrationTypes';

const values: RegistrationFormValues = {
  children: [
    {
      birthdate: '2020-01-02',
      firstName: 'cfn',
      lastName: 'cln',
      homeCity: 'Helsinki',
      postalCode: '00100',
    },
  ],
  preferLanguage: 'en',
  guardian: {
    phoneNumber: '040444444',
    firstName: 'gfn',
    lastName: 'gln',
    email: 'yomama@example.com',
    languagesSpokenAtHome: ['en'],
  },
  agree: false,
  verifyInformation: false,
};

describe('notEligibleUtils.test.ts', () => {
  test('A random city should not be eligible', () => {
    values.children[0].homeCity = 'Yokohama';
    expect(isChildEligible(values.children[0])).toEqual(false);
  });
  test('A random city should be eligible when editing a child', () => {
    values.children[0].homeCity = 'Yokohama';
    expect(isChildEligible(values.children[0], true)).toEqual(true);
  });
  test('Verify that all cities in REACT_APP_ELIGIBLE_CITIES are eligible', () => {
    const eligibleCities: string = process.env.REACT_APP_ELIGIBLE_CITIES || '';
    const cities = eligibleCities.split(',') || [];
    cities.forEach((city) => {
      values.children[0].homeCity = city;
      expect(isChildEligible(values.children[0])).toEqual(true);
    });
  });
  test('Verify that cities are eligible even when user adds whitespace', () => {
    const eligibleCities: string = process.env.REACT_APP_ELIGIBLE_CITIES || '';
    const cities = eligibleCities.split(',') || [];
    cities.forEach((city) => {
      values.children[0].homeCity = `${city} `;
      expect(isChildEligible(values.children[0])).toEqual(true);
    });
  });
  test('Verify that getEligibleCities returns an array of eligible cities', () => {
    const eligibleCitiesTest: string =
      process.env.REACT_APP_ELIGIBLE_CITIES || '';
    const citiesTest = eligibleCitiesTest.split(',') || [];
    const eligibleCities = getEligibleCities();
    expect(eligibleCities).toEqual(citiesTest);
  });
  test('Verify that all cities in REACT_APP_ELIGIBLE_CITIES in uppercase are eligible', () => {
    const eligibleCities: string = process.env.REACT_APP_ELIGIBLE_CITIES || '';
    const cities = eligibleCities.toUpperCase().split(',') || [];
    cities.forEach((city) => {
      values.children[0].homeCity = city;
      expect(isChildEligible(values.children[0])).toEqual(true);
    });
  });
  test('Verify that a date too far into the past is not eligible', () => {
    values.children[0].birthdate = '2019-10-31';
    expect(isChildEligible(values.children[0])).toEqual(false);
  });
  test('Verify that a date after supported start date is eligible', () => {
    values.children[0].birthdate = '2020-01-01';
    expect(isChildEligible(values.children[0])).toEqual(true);
  });
  test('Verify that an empty date is not eligible', () => {
    values.children[0].birthdate = '';
    expect(isChildEligible(values.children[0])).toEqual(false);
  });
  test('Verify that an invalid date is not eligible', () => {
    values.children[0].birthdate = 'Not so fast';
    expect(isChildEligible(values.children[0])).toEqual(false);
  });
});
