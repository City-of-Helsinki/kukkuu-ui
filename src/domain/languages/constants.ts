import { type Language, LanguageCodeEnum } from 'react-helsinki-headless-cms';

export const CMS_FINNISH_LANGUAGE_ENTRY = {
  code: LanguageCodeEnum.Fi,
  id: 'TGFuZ3VhZ2U6Zmk=',
  locale: 'fi',
  name: 'Suomi',
  slug: 'fi',
  __typename: 'Language',
} as const satisfies Language;

export const CMS_ENGLISH_LANGUAGE_ENTRY = {
  code: LanguageCodeEnum.En,
  id: 'TGFuZ3VhZ2U6ZW4=',
  locale: 'en_US',
  name: 'English',
  slug: 'en',
  __typename: 'Language',
} as const satisfies Language;

export const CMS_SWEDISH_LANGUAGE_ENTRY = {
  code: LanguageCodeEnum.Sv,
  id: 'TGFuZ3VhZ2U6c3Y=',
  locale: 'sv_SE',
  name: 'Svenska',
  slug: 'sv',
  __typename: 'Language',
} as const satisfies Language;

export const HARDCODED_CMS_LANGUAGES = [
  { ...CMS_FINNISH_LANGUAGE_ENTRY },
  { ...CMS_ENGLISH_LANGUAGE_ENTRY },
  { ...CMS_SWEDISH_LANGUAGE_ENTRY },
] as const;

/** Data taken from production CMS languages query response. */
export const HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE = {
  data: {
    languages: [...HARDCODED_CMS_LANGUAGES],
  },
} as const;
