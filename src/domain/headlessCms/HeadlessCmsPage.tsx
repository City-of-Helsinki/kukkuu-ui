import {
  ArticleType,
  PageType,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  Page,
  PageContent,
  usePageQuery as useRhhcPageQuery,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import useGetPathname from '../../common/route/utils/useGetPathname';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import {
  SkeletonLine,
  SkeletonLoader,
} from '../../common/components/skeleton/CmsSkeleton';
import { useCmsLoadingState } from '../../hooks/useCmsLoadingState';
import { getCmsPageTitle } from '../../utils/cmsUtils';
import { getCmsBreadcrumbs } from './breadcrumbUtils';
import styles from './headlessCmsPage.module.scss';
import NotFound from '../app/notFound/NotFound';

/**
 * Accessible skeleton placeholder for headless CMS pages during initial query loading.
 */
export const HeadlessCmsPageSkeleton = () => (
  <div
    className={styles.skeletonContainer}
    aria-busy="true"
    data-testid="headless-cms-page-skeleton"
  >
    <div className={styles.skeletonBreadcrumb}>
      <SkeletonLine width="12rem" height="1.25rem" />
    </div>
    <div className={styles.skeletonHero}>
      <SkeletonLine
        width="60%"
        height="2.5rem"
        className={styles.skeletonTitle}
      />
      <SkeletonLine width="80%" height="1.5rem" />
    </div>
    <div className={styles.skeletonBody}>
      <SkeletonLine width="100%" height="1.25rem" />
      <SkeletonLine width="95%" height="1.25rem" />
      <SkeletonLine width="90%" height="1.25rem" />
      <SkeletonLine width="70%" height="1.25rem" />
    </div>
  </div>
);

/**
 * Dynamic CMS page component rendered for arbitrary Headless CMS routes.
 *
 * Fetches page content dynamically using the current pathname, provides localized
 * breadcrumbs with home and page fallbacks, and renders NotFound for missing pages.
 */
const HeadlessCmsPage = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const getPathname = useGetPathname();

  const queryResult = useRhhcPageQuery({
    variables: { id: location.pathname },
    skip: !location.pathname,
  });
  const { isInitialLoading } = useCmsLoadingState(queryResult);

  return (
    <SkeletonLoader
      isLoading={isInitialLoading}
      skeleton={<HeadlessCmsPageSkeleton />}
      as={null}
    >
      {() => (
        <Page
          uri={location.pathname}
          className={styles.cmsPageContainer}
          navigation={undefined}
          content={
            <PageContent
              notFoundPageContent={<NotFound />}
              breadcrumbs={(page?: PageType | ArticleType) =>
                getCmsBreadcrumbs(page, {
                  locale: currentLocale,
                  fallbackBreadcrumbs: [
                    {
                      title: t('common.breadcrumbs.home'),
                      path: getPathname('/'),
                    },
                    {
                      title: getCmsPageTitle(page),
                      path: null,
                    },
                  ],
                })
              }
            />
          }
          footer={undefined}
        />
      )}
    </SkeletonLoader>
  );
};

export default HeadlessCmsPage;
