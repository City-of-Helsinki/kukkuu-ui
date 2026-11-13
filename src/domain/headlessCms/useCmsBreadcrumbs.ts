import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  ArticleType,
  PageType,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import type { BreadcrumbListItem } from 'hds-react';

import useGetPathname from '../../common/route/utils/useGetPathname';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import { getCmsPageTitle } from '../../utils/cmsUtils';
import { getCmsBreadcrumbs } from './breadcrumbUtils';

export type UseCmsBreadcrumbsOptions = {
  /**
   * Title used for the current page in the default fallback when the page title is missing or empty.
   */
  fallbackTitle?: string;
  /**
   * Intermediate breadcrumb items inserted between the Home crumb and the current page crumb in fallback breadcrumbs.
   */
  middleBreadcrumbs?: BreadcrumbListItem[];
  /**
   * Custom fallback breadcrumbs. When specified, overrides the default Home + middle + current crumb structure.
   */
  fallbackBreadcrumbs?: BreadcrumbListItem[];
  /**
   * Whether to disable the link on the last breadcrumb item (default: true).
   */
  disableLastLink?: boolean;
};

/**
 * Custom React hook for generating localized CMS breadcrumbs with sensible default fallbacks.
 *
 * Automatically resolves the current locale, the localized Home breadcrumb, and formats the breadcrumbs
 * via `getCmsBreadcrumbs`.
 */
export const useCmsBreadcrumbs = (
  page: PageType | ArticleType | null | undefined,
  options: UseCmsBreadcrumbsOptions = {}
): BreadcrumbListItem[] => {
  const { t, i18n } = useTranslation();
  const getPathname = useGetPathname();
  const locale = getCurrentLanguage(i18n);

  const {
    fallbackTitle,
    middleBreadcrumbs,
    fallbackBreadcrumbs: customFallbackBreadcrumbs,
    disableLastLink = true,
  } = options;

  const resolvedFallbackBreadcrumbs = useMemo((): BreadcrumbListItem[] => {
    if (customFallbackBreadcrumbs) {
      return customFallbackBreadcrumbs;
    }

    const homeItem: BreadcrumbListItem = {
      title: t('common.breadcrumbs.home'),
      path: getPathname('/'),
    };

    const currentItemTitle = getCmsPageTitle(page) || fallbackTitle || '';
    const currentItem: BreadcrumbListItem = {
      title: currentItemTitle,
      path: null,
    };

    return [homeItem, ...(middleBreadcrumbs ?? []), currentItem];
  }, [
    customFallbackBreadcrumbs,
    t,
    getPathname,
    page,
    fallbackTitle,
    middleBreadcrumbs,
  ]);

  return useMemo(
    () =>
      getCmsBreadcrumbs(page, {
        locale,
        fallbackBreadcrumbs: resolvedFallbackBreadcrumbs,
        middleBreadcrumbs,
        disableLastLink,
      }),
    [page, locale, resolvedFallbackBreadcrumbs, middleBreadcrumbs, disableLastLink]
  );
};

export default useCmsBreadcrumbs;
