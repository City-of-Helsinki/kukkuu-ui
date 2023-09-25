import { SUPPORT_LANGUAGES } from '../../translation/TranslationConstants';

export default function replaceLocaleInPathname(
  nextLanguage: string,
  pathname: string
) {
  const supportedLanguages = Object.values(SUPPORT_LANGUAGES);

  const currentLanguage = supportedLanguages.find((language) =>
    pathname.startsWith(`/${language}`)
  );

  // If no current language, but not Finnish, add language
  if (!currentLanguage) {
    return `/${nextLanguage}${pathname}`;
  }

  return pathname.replace(
    new RegExp(`^/${currentLanguage}`),
    `/${nextLanguage}`
  );
}
