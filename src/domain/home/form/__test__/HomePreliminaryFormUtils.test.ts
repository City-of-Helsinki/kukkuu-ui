import { RegistrationFormValues } from '../../../registration/types/RegistrationTypes';
import { HomeFormValues } from '../types/HomeFormTypes';
import { convertFormValues } from '../HomePreliminaryFormUtils';
import { Language } from '../../../api/generatedTypes/graphql';

const convertFrom: RegistrationFormValues = {
  children: [
    {
      birthyear: 2019,
      name: 'cfn cln',
      homeCity: 'Helsinki',
      postalCode: '00100',
    },
  ],
  guardian: {
    phoneNumber: '040444444',
    firstName: 'gfn gln',
    lastName: 'gln',
    email: 'yomama@example.com',
    languagesSpokenAtHome: ['fi'],
    hasAcceptedMarketing: false,
  },
  preferLanguage: Language.En,
  agree: false,
  verifyInformation: false,
};

const converted: HomeFormValues = {
  child: {
    birthyear: 2019,
    homeCity: 'Helsinki',
  },
  verifyInformation: false,
};

describe('HomePreliminaryFormUtils', () => {
  test('Verify conversion from RegistrationFormValues to HomeFormValues', () => {
    const result: HomeFormValues = convertFormValues(convertFrom);
    expect(result).toEqual(converted);
  });
});
