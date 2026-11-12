import {
  getTextFromHtml,
  ModuleItemTypeEnum,
  type ArticleType,
  type PageType,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import AppConfig from '../domain/app/AppConfig';

/**
 * Strips language locale prefix (/fi, /sv, /en) from the beginning of a URI.
 *
 * @param uri - The raw URI string.
 * @returns URI without leading locale prefix.
 */
export const stripLocaleFromUri = (uri: string): string => {
  return uri.replace(/^\/(en|sv|fi)(?![a-z0-9])/i, '');
};

/**
 * Remove a single slash from given path's beginning and from its end.
 * @param path
 * @returns Input path with single slash, if present, removed from its beginning
 * and similarly from its end.
 * */
export const removeSurroundingSlashes = (path: string) => {
  return path.replace(/(^\/|\/$)/g, '');
};

/**
 * Normalizes a CMS URI by decoding URI components and removing locale prefix and surrounding slashes.
 *
 * @param uri - The raw CMS URI.
 * @returns Normalized CMS URI slug.
 */
export const normalizeCmsUri = (uri: string) => {
  return decodeURIComponent(removeSurroundingSlashes(stripLocaleFromUri(uri)));
};

/**
 * Replaces HTML entity `&#x2d;` with a standard dash `-`.
 *
 * @param str - The raw string.
 * @returns String with dashes unescaped.
 */
export const unescapeDash = (str?: string | null): string => {
  if (!str) {
    return str ?? '';
  }
  return str.replace(/&#x2d;/g, '-');
};

/**
 * Resolves the display title for a CMS page or article, prioritizing hero title over page title.
 *
 * @param page - The CMS page or article.
 * @returns Trimmed title string or empty string.
 */
export const getCmsPageTitle = (
  page?: PageType | ArticleType | null
): string => {
  if (!page) {
    return '';
  }
  if ('hero' in page && page.hero?.title?.trim()) {
    return page.hero.title.trim();
  }
  return page.title?.trim() || '';
};

/**
 * Resolves the description for a CMS page or article, converted to plain text.
 * Prioritizes hero description, then lead, then page content.
 *
 * @param page - The CMS page or article.
 * @returns Plain-text description or empty string.
 */
export const getCmsPageDescription = (
  page?: PageType | ArticleType | null
): string => {
  if (!page) {
    return '';
  }
  if ('hero' in page && page.hero?.description?.trim()) {
    return getTextFromHtml(page.hero.description).trim();
  }
  if ('lead' in page && page.lead?.trim()) {
    return getTextFromHtml(page.lead).trim();
  }
  if (page.content?.trim()) {
    return getTextFromHtml(page.content).trim();
  }
  return '';
};

/**
 * Extracts the primary image URL and metadata from a CMS page or article.
 *
 * @param page - The CMS page or article.
 * @returns Image URL, alt text, and photographer name.
 */
export const getCmsPageImage = (
  page?: PageType | ArticleType | null
): {
  url: string;
  altText: string;
  photographerName: string;
} => {
  const featuredNode = page?.featuredImage?.node;
  const heroBgUrl =
    page && 'hero' in page ? page.hero?.background_image_url : '';
  return {
    url:
      featuredNode?.large ||
      featuredNode?.mediaItemUrl ||
      heroBgUrl ||
      '',
    altText: featuredNode?.altText || '',
    photographerName: featuredNode?.photographerName || '',
  };
};

/**
 * Resolves the CMS URI for a dynamic page route.
 * Ensures the configured CMS pages context path (e.g. '/pages') is handled cleanly.
 */
export const withCmsPagesContextPath = (uri: string): string => {
  const stripped = stripLocaleFromUri(uri);
  const contextPath = AppConfig.cmsPagesContextPath;
  if (!stripped || stripped === '/') {
    return uri;
  }
  if (stripped.startsWith(contextPath)) {
    return uri;
  }
  const localeMatch = uri.match(/^\/(en|sv|fi)(?![a-z0-9])/i);
  const localePrefix = localeMatch ? localeMatch[0] : '';
  const normalizedSlug = stripped.startsWith('/') ? stripped : `/${stripped}`;
  return `${localePrefix}${contextPath}${normalizedSlug}`;
};

/**
 * Returns origins considered internal to the application and CMS.
 *
 * @returns Array of internal origin URL strings.
 */
export const getInternalHrefOrigins = (): string[] => [
  new URL(AppConfig.origin).origin,
  new URL(AppConfig.apiUrl).origin,
  new URL(AppConfig.cmsUri).origin,
];

/**
 * Resolves an internal CMS or application link into a localized routed path.
 *
 * Strips internal origins, handles search and profile redirects to `/events` and `/profile`,
 * formats article links with configured article prefix, and ensures target locale.
 *
 * @param link - The raw target link.
 * @param type - The module item type (e.g. Article).
 * @param language - Fallback language code.
 * @returns Resolved application route path.
 */
export const getRoutedInternalHref = (
  link?: string | null,
  type?: ModuleItemTypeEnum,
  language = 'fi'
): string => {
  if (!link) {
    return '#';
  }
  let uri = link;
  const origins = getInternalHrefOrigins();
  for (const origin of origins) {
    if (uri.includes(origin)) {
      uri = uri.replace(origin, '');
      break;
    }
  }
  if (!uri.startsWith('/')) {
    return uri;
  }

  const localeMatch = /^\/(fi|sv|en)(\/.*|$)/i.exec(uri);
  const targetLocale = localeMatch
    ? localeMatch[1].toLowerCase()
    : language;
  const strippedUri = stripLocaleFromUri(uri).replace(/\/$/, '');

  if (
    strippedUri === AppConfig.cmsSearchContextPath ||
    strippedUri === '/events'
  ) {
    return `/${targetLocale}/events`;
  }

  if (
    strippedUri === AppConfig.cmsProfileContextPath ||
    strippedUri === '/profile'
  ) {
    return `/${targetLocale}/profile`;
  }

  if (type === ModuleItemTypeEnum.Article) {
    const articlesPrefix = AppConfig.cmsArticlesContextPath.replace(
      /\/$/,
      ''
    );
    const rawSlug = strippedUri.startsWith(`${articlesPrefix}/`)
      ? strippedUri.slice(articlesPrefix.length)
      : strippedUri;
    const articleSlug = rawSlug.replace(/^\/+|\/+$/g, '');
    return articleSlug
      ? `/${targetLocale}${articlesPrefix}/${articleSlug}`
      : `/${targetLocale}${articlesPrefix}`;
  }

  if (localeMatch) {
    return uri;
  }

  return `/${targetLocale}${strippedUri}`;
};

