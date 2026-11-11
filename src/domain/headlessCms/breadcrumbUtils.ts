import {
  getBreadcrumbsFromPage,
  type ArticleType,
  type PageType,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import type { BreadcrumbListItem } from 'hds-react';

import getPathname from '../../common/route/utils/getPathname';
import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import {
  removeSurroundingSlashes,
  stripLocaleFromUri,
} from '../../utils/cmsUtils';
import AppConfig from '../app/AppConfig';

export const getExcludedBreadcrumbPaths = (): string[] => {
  const basePaths = [AppConfig.cmsPagesContextPath];
  const locales = Object.values(SUPPORT_LANGUAGES);
  return [
    ...basePaths,
    ...basePaths.flatMap((pathname) =>
      locales.map((lang) => `/${lang}${pathname}`)
    ),
  ];
};

export const getFilteredBreadcrumbs = (
  breadcrumbs: BreadcrumbListItem[],
  excludedPaths: string[] = getExcludedBreadcrumbPaths()
): BreadcrumbListItem[] => {
  const normalizedExcluded = excludedPaths.map((p) => p.replace(/\/$/, ''));
  return breadcrumbs.filter((breadcrumb) => {
    if (!breadcrumb.path) {
      return true;
    }
    const cleanPath = breadcrumb.path.replace(/\/$/, '');
    return !normalizedExcluded.includes(cleanPath);
  });
};

export const mapCmsBreadcrumbPath = (
  rawPath: string,
  locale: string
): string => {
  if (!rawPath) {
    return getPathname('/', locale);
  }
  const stripped = stripLocaleFromUri(rawPath).replace(/\/$/, '');
  if (!stripped || stripped === '/') {
    return getPathname('/', locale);
  }
  if (stripped === AppConfig.cmsSearchContextPath) {
    return getPathname('/events', locale);
  }
  return getPathname(stripped, locale);
};

export type GetCmsBreadcrumbsOptions = {
  locale: string;
  fallbackBreadcrumbs?: BreadcrumbListItem[];
  disableLastLink?: boolean;
};

/**
 * Extracts, filters, and localizes breadcrumbs from a CMS page or article.
 * Falls back to `fallbackBreadcrumbs` when CMS breadcrumbs are not available.
 */
export const getCmsBreadcrumbs = (
  page: PageType | ArticleType | null | undefined,
  {
    locale,
    fallbackBreadcrumbs = [],
    disableLastLink = true,
  }: GetCmsBreadcrumbsOptions
): BreadcrumbListItem[] => {
  if (!page?.breadcrumbs || page.breadcrumbs.length === 0) {
    return fallbackBreadcrumbs;
  }

  const rawBreadcrumbs = getBreadcrumbsFromPage(page) ?? [];
  const filtered = getFilteredBreadcrumbs(rawBreadcrumbs);

  if (filtered.length === 0) {
    return fallbackBreadcrumbs;
  }

  const pageUriNorm = removeSurroundingSlashes(
    stripLocaleFromUri(page.uri ?? '')
  );
  const lastBreadcrumb = filtered[filtered.length - 1];
  const lastPathNorm = removeSurroundingSlashes(
    stripLocaleFromUri(lastBreadcrumb?.path ?? '')
  );

  const items = [...filtered];
  if (
    page.title &&
    lastBreadcrumb &&
    lastPathNorm !== pageUriNorm &&
    lastBreadcrumb.title !== page.title
  ) {
    items.push({
      title: page.title,
      path: page.uri ?? null,
    });
  }

  return items.map((item, index) => {
    const isLast = index === items.length - 1;
    return {
      title: item.title ?? '',
      path:
        isLast && disableLastLink
          ? null
          : item.path
            ? mapCmsBreadcrumbPath(item.path, locale)
            : null,
    };
  });
};

export {
  default as useCmsBreadcrumbs,
  type UseCmsBreadcrumbsOptions,
} from './useCmsBreadcrumbs';

