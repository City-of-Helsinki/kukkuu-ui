import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { Breadcrumb, ButtonPresetTheme } from 'hds-react';
import {
  ContentContainer,
  getTextFromHtml,
  PageSection,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import usePageQuery from '../../../hooks/usePageQuery';
import { useCmsLoadingState } from '../../../hooks/useCmsLoadingState';
import {
  SkeletonLoader,
  SkeletonText,
} from '../../../common/components/skeleton/CmsSkeleton';
import { getCmsPageTitle } from '../../../utils/cmsUtils';
import AppConfig from '../../app/AppConfig';
import PageMeta from '../../app/layout/utilityComponents/PageMeta';
import { useCmsBreadcrumbs } from '../../headlessCms/breadcrumbUtils';
import Button from '../../../common/components/button/Button';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import ErrorMessage from '../../../common/components/error/Error';
import { useProfileContext } from '../../profile/hooks/useProfileContext';
import EventSearchProviders from './context/EventSearchProviders';
import { useEventSearchUrlContext } from './context/EventSearchUrlContext';
import { useEventSearchResultsUiContext } from './context/EventSearchResultsUiContext';
import StickySearchHeader from './StickySearchHeader';
import EventSearchFilterForm from './EventSearchFilterForm';
import ChildThemePathNotification from './ChildThemePathNotification';
import EventSearchEmptyResults from './EventSearchEmptyResults';
import EventSearchCard from './EventSearchCard';
import styles from './childEventsSearch.module.scss';

export type ChildEventsSearchProps = {
  title?: string;
  description?: string;
};

export type ChildEventsSearchViewProps = {
  title?: string;
  description?: string;
};

/**
 * Handles guardian redirection rules based on authentication and registered children.
 *
 * Redirects:
 * - Users with no profile to `/home#register`
 * - Guardians with 0 children to `/profile`
 */
const useChildEventsSearchRedirect = (): {
  isLoading: boolean;
  hasChildren: boolean;
} => {
  const navigate = useNavigate();
  const getPathname = useGetPathname();
  const location = useLocation();
  const { profile, isLoading: isProfileLoading, isFetchCalled } =
    useProfileContext();

  const isProfileLoaded = isFetchCalled && !isProfileLoading;
  const hasProfile = Boolean(profile);
  const childrenEdges = profile?.children?.edges || [];
  const hasChildren = childrenEdges.length > 0;

  useEffect(() => {
    if (!isProfileLoaded) return;

    if (!hasProfile) {
      if (!location.pathname.includes('/home')) {
        navigate(getPathname('/home#register'), { replace: true });
      }
      return;
    }

    if (!hasChildren && !location.pathname.includes('/profile')) {
      navigate(getPathname('/profile'), { replace: true });
    }
  }, [
    isProfileLoaded,
    hasProfile,
    hasChildren,
    location.pathname,
    navigate,
    getPathname,
  ]);

  return {
    isLoading: isProfileLoading,
    hasChildren,
  };
};

/**
 * Renders the search results list, event count, and empty state.
 */
const ChildEventsSearchResults: React.FC = () => {
  const { t } = useTranslation();
  const { activeChildId } = useEventSearchUrlContext();
  const {
    activeChildName,
    events,
    totalCount,
    remainingCount,
    hasMore,
    loadMore,
    resultsAnnouncement,
  } = useEventSearchResultsUiContext();

  return (
    <section
      className={styles.resultsSection}
      aria-label={t('search.results.sectionLabel', 'Hakutulokset')}
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
      >
        {resultsAnnouncement}
      </div>

      {totalCount > 0 ? (
        <>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsCount}>
              {t('search.results.count', { count: totalCount })}
            </h2>
            <p className={styles.childSubheading}>
              {t('search.results.childHeading', {
                name: activeChildName,
              })}
            </p>
          </div>

          <ChildThemePathNotification />

          <div className={styles.occurrenceList}>
            {events.map((event) => (
              <EventSearchCard
                key={event.id}
                childId={activeChildId || ''}
                event={event}
              />
            ))}
          </div>

          {hasMore && (
            <div className={styles.loadMoreWrapper}>
              <Button
                variant="secondary"
                theme={ButtonPresetTheme.Black}
                onClick={loadMore}
              >
                {t('search.results.loadMore', {
                  count: remainingCount,
                })}
              </Button>
            </div>
          )}
        </>
      ) : (
        <EventSearchEmptyResults />
      )}
    </section>
  );
};

/**
 * View presentation component for the child events search page.
 *
 * Consumes search and profile contexts to render the sticky header, breadcrumbs,
 * hero section, filter form, and event card list.
 */
export const ChildEventsSearchView: React.FC<ChildEventsSearchViewProps> = ({
  title,
  description,
}) => {
  const { t } = useTranslation();
  const cmsQueryResult = usePageQuery(AppConfig.cmsSearchContextPath);
  const { data: cmsPageData } = cmsQueryResult;
  const { isInitialLoading: isCmsLoading } = useCmsLoadingState(cmsQueryResult);
  const page = cmsPageData?.page;
  const breadcrumbs = useCmsBreadcrumbs(page, {
    fallbackTitle: t('common.breadcrumbs.events'),
  });
  const { isLoading: isRedirectLoading, hasChildren } =
    useChildEventsSearchRedirect();
  const { isLoading: isEventsLoading, error } =
    useEventSearchResultsUiContext();

  if (isRedirectLoading || (hasChildren && isEventsLoading)) {
    return <LoadingSpinner isLoading />;
  }

  if (error) {
    return <ErrorMessage message={t('search.error.failedToLoadEvents')} />;
  }

  const searchTitle =
    title ||
    (page ? getCmsPageTitle(page) : '') ||
    t('search.hero.title', t('search.title'));
  const rawHeroDescription =
    (page && 'hero' in page && page.hero?.description?.trim()) ||
    page?.lead?.trim() ||
    '';
  const cmsHeroDescription = rawHeroDescription
    ? getTextFromHtml(rawHeroDescription).trim()
    : '';
  const searchDescription =
    description !== undefined
      ? description
      : page !== null && page !== undefined
        ? cmsHeroDescription
        : t(
            'search.hero.description',
            t('profile.common.message.serviceDescription')
          );

  const isHeroLoading = isCmsLoading && (!title || description === undefined);

  return (
    <>
      <PageMeta
        title={searchTitle}
        description={searchDescription}
        page={page}
      />
      <div className={styles.searchPageWrapper}>
        <StickySearchHeader />

        <div className={styles.breadcrumbsWrapper}>
          <Breadcrumb
            aria-label={t('common.breadcrumbNavigationLabel')}
            list={breadcrumbs}
            className={styles.breadcrumbs}
          />
        </div>

        <PageSection
          korosBottom
          korosBottomClassName={styles.heroKoros}
          className={styles.heroSection}
        >
          <ContentContainer className={styles.heroContentContainer}>
            <SkeletonLoader
              isLoading={isHeroLoading}
              skeleton={
                <SkeletonText
                  titleWidth="50%"
                  lineWidths={['75%']}
                />
              }
            >
              <h1 className={styles.heroTitle}>{searchTitle}</h1>
              {searchDescription && (
                <p className={styles.heroDescription}>{searchDescription}</p>
              )}
            </SkeletonLoader>
          </ContentContainer>
        </PageSection>

        <ContentContainer className={styles.mainContentContainer}>
          <EventSearchFilterForm />
          <ChildEventsSearchResults />
        </ContentContainer>
      </div>
    </>
  );
};

/**
 * Root container component for the child events search page.
 *
 * Wraps {@link ChildEventsSearchView} within {@link EventSearchProviders}
 * to supply URL search params, form filter state, and GraphQL query contexts.
 */
export const ChildEventsSearch: React.FC<ChildEventsSearchProps> = ({
  title,
  description,
}) => {
  return (
    <EventSearchProviders>
      <ChildEventsSearchView title={title} description={description} />
    </EventSearchProviders>
  );
};

export default ChildEventsSearch;
