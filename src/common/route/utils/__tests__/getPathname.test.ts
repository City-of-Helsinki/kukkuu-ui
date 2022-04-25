import { SUPPORT_LANGUAGES } from '../../../translation/TranslationConstants';
import getPathname from '../getPathname';

const languages = Object.values(SUPPORT_LANGUAGES);
const testCases = (language: string) => [
  ['/', language, `/${language === SUPPORT_LANGUAGES.FI ? '' : language}`],
  [
    '/profile',
    language,
    `${language === SUPPORT_LANGUAGES.FI ? '' : '/' + language}/profile`,
  ],
  [
    'profile',
    language,
    `${language === SUPPORT_LANGUAGES.FI ? '' : '/' + language}/profile`,
  ],
];

test.each(languages.flatMap((language) => testCases(language)))(
  'when pathname is %p and language is %p, yields %p',
  (pathname, language, result) => {
    expect(getPathname(pathname, language)).toEqual(result);
  }
);
