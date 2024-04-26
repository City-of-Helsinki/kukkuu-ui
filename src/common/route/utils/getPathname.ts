import { SUPPORT_LANGUAGES } from '../../translation/TranslationConstants';

export default function getPathname(pathname: string, locale: string) {
  const needsSlash = pathname.length > 0 && !pathname.startsWith('/');
  const basePathname = `${needsSlash ? '/' : ''}${pathname}`;

  // NOTE: When using new React-Router v6,
  // having the locale in the pathname is highly recommended.
  // Using the WithLocaleRoute HOC this is also overridden
  // in the browserRouter creation.
  if (locale === SUPPORT_LANGUAGES.FI) {
    return basePathname;
  }

  return `/${locale}${basePathname === '/' ? '' : basePathname}`;
}
