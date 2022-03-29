import { SUPPORT_LANGUAGES } from '../../translation/TranslationConstants';

export default function getPathname(pathname: string, locale: string) {
  if (locale === SUPPORT_LANGUAGES.FI) {
    return pathname;
  }

  return `/${locale}${pathname}`;
}
