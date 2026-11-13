import {
  Collection,
  Page,
  PageContent,
  PageType,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import { usePageQuery as useRhhcPageQuery } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import useGetPathname from '../../common/route/utils/useGetPathname';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import {
  CmsPageSkeleton,
  CmsPageSkeletonProps,
  SkeletonLoader,
} from '../../common/components/skeleton/CmsSkeleton';
import { useCmsLoadingState } from '../../hooks/useCmsLoadingState';
import {
  getCmsPageDescription,
  getCmsPageTitle,
  hasCmsCollections,
} from '../../utils/cmsUtils';
import { getCmsBreadcrumbs } from './breadcrumbUtils';
import styles from './headlessCmsPage.module.scss';
import NotFound from '../app/notFound/NotFound';
import PageMeta from '../app/layout/utilityComponents/PageMeta';

/**
 * Accessible skeleton placeholder for headless CMS pages during initial query loading.
 */
export const HeadlessCmsPageSkeleton: React.FC<CmsPageSkeletonProps> = (
  props
) => <CmsPageSkeleton data-testid="headless-cms-page-skeleton" {...props} />;

/**
 * Dynamic CMS page component rendered for arbitrary Headless CMS routes.
 *
 * Fetches page content dynamically using the current pathname, enhances hero presentation
 * with brand summer yellow background and koros wave, suppresses empty collections,
 * provides localized breadcrumbs, and renders NotFound for missing pages.
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
  const page = queryResult.data?.page;

  if (!isInitialLoading && !page) {
    return <NotFound />;
  }

  // Ensure hero properties default to page metadata so the full-width summer
  // hero section and bottom koros wave render properly without duplicating title in body.
  const enhancedPage: PageType | undefined = page
    ? {
        ...page,
        hero: {
          ...page.hero,
          title: page.hero?.title || page.title || '',
          description: page.hero?.description || page.lead || '',
          background_color: page.hero?.background_color || 'summer',
          wave_motif: page.hero?.wave_motif || 'basic',
        },
      }
    : undefined;

  // Only pass collections if the page actually contains collection modules.
  // An empty array in react-helsinki-headless-cms evaluates as truthy in JSX,
  // causing an empty PageSection with a stray bottom koros wave above the footer.
  const hasCollections = hasCmsCollections(page);

  const breadcrumbs = getCmsBreadcrumbs(enhancedPage, {
    locale: currentLocale,
    fallbackBreadcrumbs: [
      {
        title: t('common.breadcrumbs.home'),
        path: getPathname('/'),
      },
      {
        title: getCmsPageTitle(enhancedPage),
        path: null,
      },
    ],
  });

  return (
    <SkeletonLoader
      isLoading={isInitialLoading}
      skeleton={<HeadlessCmsPageSkeleton />}
      as={null}
    >
      {() => (
        <Page
          className={styles.cmsPageContainer}
          navigation={undefined}
          footer={undefined}
          content={
            <>
              <PageMeta
                title={getCmsPageTitle(enhancedPage)}
                description={getCmsPageDescription(enhancedPage)}
                page={enhancedPage}
              />
              <PageContent
                page={enhancedPage}
                breadcrumbs={breadcrumbs}
                collections={
                  hasCollections
                    ? undefined
                    : (() =>
                        null as unknown as React.ReactElement<
                          typeof Collection
                        >[])
                }
              />
            </>
          }
        />
      )}
    </SkeletonLoader>
  );
};

export default HeadlessCmsPage;
