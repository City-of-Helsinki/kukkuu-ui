import { LanguagesDocument } from 'react-helsinki-headless-cms/apollo';
import { LanguageCodeEnum } from 'react-helsinki-headless-cms';
import { MockedResponse } from '@apollo/client/testing';

/**
 * This is a mock of the response from the languages query.
 * Data taken from production CMS query response.
 */
export const languagesQueryResponse = {
  data: {
    languages: [
      {
        code: LanguageCodeEnum.Fi,
        id: 'TGFuZ3VhZ2U6Zmk=',
        locale: 'fi',
        name: 'Suomi',
        slug: 'fi',
        __typename: 'Language',
      },
      {
        code: LanguageCodeEnum.En,
        id: 'TGFuZ3VhZ2U6ZW4=',
        locale: 'en_US',
        name: 'English',
        slug: 'en',
        __typename: 'Language',
      },
      {
        code: LanguageCodeEnum.Sv,
        id: 'TGFuZ3VhZ2U6c3Y=',
        locale: 'sv_SE',
        name: 'Svenska',
        slug: 'sv',
        __typename: 'Language',
      },
    ],
  },
} as const;

export const languagesMock: MockedResponse = {
  request: {
    query: LanguagesDocument,
  },
  result: languagesQueryResponse,
};
