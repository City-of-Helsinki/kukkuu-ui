import replaceLocaleInPathname from '../replaceLocaleInPathname';
import { SUPPORT_LANGUAGES } from '../../../translation/TranslationConstants';

const languages = Object.values(SUPPORT_LANGUAGES);

describe('replaceLocaleInPathname', () => {
  it.each([
    ['en', '/fi/profile', '/en/profile'],
    ['sv', '/en/profile', '/sv/profile'],
    ['fi', '/sv/profile', '/fi/profile'],
  ])(
    'should replace the current locale (%s) with the next locale in the pathname (%s)',
    (nextLanguage, pathname, expected) => {
      expect(replaceLocaleInPathname(nextLanguage, pathname)).toBe(expected);
    }
  );

  it.each([
    ['en', '/profile', '/en/profile'],
    ['sv', '/profile', '/sv/profile'],
    ['fi', '/profile', '/fi/profile'],
  ])(
    'should add the next locale (%s) to the pathname (%s) if no locale is present',
    (nextLanguage, pathname, expected) => {
      expect(replaceLocaleInPathname(nextLanguage, pathname)).toBe(expected);
    }
  );

  it.each([
    ['en', '/', '/en/'],
    ['sv', '/', '/sv/'],
    ['fi', '/', '/fi/'],
  ])(
    'should return the locale added to the root path if it is the root path and no locale is present (%s)',
    (nextLanguage, pathname, expected) => {
      expect(replaceLocaleInPathname(nextLanguage, pathname)).toBe(expected);
    }
  );

  it.each([
    ['en', '/fi/profile/edit', '/en/profile/edit'],
    ['sv', '/en/profile/edit', '/sv/profile/edit'],
    ['fi', '/sv/profile/edit', '/fi/profile/edit'],
    ['en', '/profile/edit', '/en/profile/edit'],
  ])(
    'should handle multiple path segments (%s, %s)',
    (nextLanguage, pathname, expected) => {
      expect(replaceLocaleInPathname(nextLanguage, pathname)).toBe(expected);
    }
  );

  it('should work with different supported languages using path without locale', () => {
    languages.forEach((nextLanguage) => {
      const expected = `/${nextLanguage}/path`;
      expect(replaceLocaleInPathname(nextLanguage, '/path')).toBe(expected);
    });
  });

  it('should work with different supported languages using paths with locale', () => {
    languages.forEach((nextLanguage) => {
      languages.forEach((currentLanguage) => {
        const basePath = `/${currentLanguage}/path`;
        const expected = `/${nextLanguage}/path`;
        expect(replaceLocaleInPathname(nextLanguage, basePath)).toBe(expected);
      });
    });
  });

  it.each([
    ['en', '', '/en'],
    ['sv', '', '/sv'],
    ['fi', '', '/fi'],
  ])(
    'should handle empty pathname (%s, %s)',
    (nextLanguage, pathname, expected) => {
      expect(replaceLocaleInPathname(nextLanguage, pathname)).toBe(expected);
    }
  );
});
