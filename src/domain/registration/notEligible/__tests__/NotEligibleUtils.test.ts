import { getEligibleCities, isChildEligible } from '../NotEligibleUtils';
import { RegistrationFormValues } from '../../types/RegistrationTypes';
import { Language } from '../../../api/generatedTypes/graphql';

const values: RegistrationFormValues = {
  children: [
    {
      birthyear: 2020,
      name: 'cfn cln',
      homeCity: 'Helsinki',
      postalCode: '00100',
    },
  ],
  preferLanguage: Language.En,
  guardian: {
    phoneNumber: '040444444',
    firstName: 'gfn',
    lastName: 'gln',
    email: 'yomama@example.com',
    languagesSpokenAtHome: ['en'],
    hasAcceptedMarketing: false,
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
  test('Verify that all cities in VITE_ELIGIBLE_CITIES are eligible', () => {
    const eligibleCities: string = import.meta.env.VITE_ELIGIBLE_CITIES || '';
    const cities = eligibleCities.split(',') || [];
    cities.forEach((city) => {
      values.children[0].homeCity = city;
      expect(isChildEligible(values.children[0])).toEqual(true);
    });
  });
  test('Verify that cities are eligible even when user adds whitespace', () => {
    const eligibleCities: string = import.meta.env.VITE_ELIGIBLE_CITIES || '';
    const cities = eligibleCities.split(',') || [];
    cities.forEach((city) => {
      values.children[0].homeCity = `${city} `;
      expect(isChildEligible(values.children[0])).toEqual(true);
    });
  });
  test('Verify that getEligibleCities returns an array of eligible cities', () => {
    const eligibleCitiesTest: string =
      import.meta.env.VITE_ELIGIBLE_CITIES || '';
    const citiesTest = eligibleCitiesTest.split(',') || [];
    const eligibleCities = getEligibleCities();
    expect(eligibleCities).toEqual(citiesTest);
  });
  test('Verify that all cities in VITE_ELIGIBLE_CITIES in uppercase are eligible', () => {
    const eligibleCities: string = import.meta.env.VITE_ELIGIBLE_CITIES || '';
    const cities = eligibleCities.toUpperCase().split(',') || [];
    cities.forEach((city) => {
      values.children[0].homeCity = city;
      expect(isChildEligible(values.children[0])).toEqual(true);
    });
  });
  test('Verify that a date too far into the past is not eligible', () => {
    values.children[0].birthyear = 2019;
    expect(isChildEligible(values.children[0])).toEqual(false);
  });
  test('Verify that a date after supported start date is eligible', () => {
    values.children[0].birthyear = 2020;
    expect(isChildEligible(values.children[0])).toEqual(true);
  });
  test('Verify that an invalid date is not eligible', () => {
    values.children[0].birthyear = 0;
    expect(isChildEligible(values.children[0])).toEqual(false);
  });
});
