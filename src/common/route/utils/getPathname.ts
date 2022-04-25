import { SUPPORT_LANGUAGES } from '../../translation/TranslationConstants';

export default function getPathname(pathname: string, locale: string) {
  const needsSlash = pathname.length > 0 && !pathname.startsWith('/');
  const basePathname = `${needsSlash ? '/' : ''}${pathname}`;

  if (locale === SUPPORT_LANGUAGES.FI) {
    return basePathname;
  }

  return `/${locale}${basePathname === '/' ? '' : basePathname}`;
}
