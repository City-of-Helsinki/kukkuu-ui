import { SUPPORT_LANGUAGES } from '../../translation/TranslationConstants';

export default function replaceLocaleInPathname(
  nextLanguage: string,
  pathname: string
) {
  const supportedLanguages = Object.values(SUPPORT_LANGUAGES);

  const currentLanguage = supportedLanguages.find((language) =>
    pathname.includes(`/${language}`)
  );

  // If next language is Finnish and the path does not have a language, do
  // nothing
  if (!currentLanguage && nextLanguage === SUPPORT_LANGUAGES.FI) {
    return;
  }

  // If next language is Finnish and the path does have a language, remove the
  // existing language
  if (currentLanguage && nextLanguage === SUPPORT_LANGUAGES.FI) {
    return pathname.replace(`/${currentLanguage}`, '');
  }

  // If no current language, but not Finnish, add language
  if (!currentLanguage) {
    return `/${nextLanguage}${pathname}`;
  }

  return pathname.replace(`/${currentLanguage}`, `/${nextLanguage}`);
}
