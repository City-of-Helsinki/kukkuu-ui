import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { DocumentNode } from '@apollo/client';
import { toast } from 'react-toastify';
import {
  Accordion,
  Breadcrumb,
  Checkbox,
  Select,
  SupportedLanguage,
  TextInput,
} from 'hds-react';
import type { BreadcrumbListItem } from 'hds-react';
import {
  ContentContainer,
  PageSection,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import PageMeta from '../../app/layout/utilityComponents/PageMeta';
import Button from '../../../common/components/button/Button';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import ErrorMessage from '../../../common/components/error/Error';
import { useProfileContext } from '../../profile/hooks/useProfileContext';
import { DEFAULT_SEARCH_PAGE_SIZE } from './eventSearchUtils';
import { useEventsSearch } from './hooks/useEventsSearch';
import { useChildSelectOptions } from './hooks/useChildSelectOptions';
import { useStickyChildSelect } from './hooks/useStickyChildSelect';
import { useActiveChild } from './hooks/useActiveChild';
import EventSearchCard from './EventSearchCard';
import styles from './childEventsSearch.module.scss';

export type ChildEventsSearchProps = {
  title?: string;
  description?: string;
  pageSize?: number;
  eventsQuery?: DocumentNode;
};

export const ChildEventsSearch: React.FC<ChildEventsSearchProps> = ({
  title,
  description,
  pageSize = DEFAULT_SEARCH_PAGE_SIZE,
  eventsQuery,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const getPathname = useGetPathname();
  const {
    profile,
    isLoading: isProfileLoading,
    isFetchCalled: isProfileFetchCalled,
  } = useProfileContext();

  const location = useLocation();

  const { activeChildId, isInvalidChildInUrl, hasChildren } = useActiveChild({
    profile,
  });

  // Handle guardian without profile or with 0 registered children -> redirect
  useEffect(() => {
    if (
      isProfileFetchCalled &&
      !isProfileLoading &&
      !profile?.id &&
      !location.pathname.includes('/home')
    ) {
      navigate(getPathname('/home#register'), { replace: true });
    } else if (
      profile &&
      isProfileFetchCalled &&
      !isProfileLoading &&
      !hasChildren &&
      !location.pathname.includes('/profile')
    ) {
      navigate(getPathname('/profile'), { replace: true });
    }
  }, [
    profile,
    isProfileFetchCalled,
    isProfileLoading,
    hasChildren,
    location.pathname,
    getPathname,
    navigate,
  ]);

  // Handle invalid/foreign child ID in URL -> fallback to first child, clean URL, notify guardian
  useEffect(() => {
    if (isInvalidChildInUrl && hasChildren) {
      toast.info(
        t(
          'search.childNotFoundNotification',
          'Valittua lasta ei löytynyt profiilistasi. Näytetään ensimmäisen lapsen tapahtumat.'
        )
      );
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('child');
          next.delete('childId');
          return next;
        },
        { replace: true }
      );
    }
  }, [isInvalidChildInUrl, hasChildren, setSearchParams, t]);

  const breadcrumbs: BreadcrumbListItem[] = [
    {
      title: t('common.breadcrumbs.home'),
      path: getPathname('/'),
    },
    {
      title: t('common.breadcrumbs.events'),
      path: null,
    },
  ];

  const parsedPage = Number.parseInt(searchParams.get('page') || '1', 10);
  const currentPage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const availableOnly = searchParams.get('availableOnly') === 'true';

  const enrolledEventIds = React.useMemo(() => {
    const childNode = (profile?.children?.edges || [])
      .map((edge) => edge?.node)
      .find((c) => c?.id === activeChildId);
    const ids = new Set<string>();
    for (const edge of childNode?.enrolments?.edges || []) {
      const eventId = edge?.node?.occurrence?.event?.id;
      if (eventId) {
        ids.add(eventId);
      }
    }
    return ids;
  }, [profile, activeChildId]);

  const eventsSearch = useEventsSearch({
    childId: activeChildId,
    page: currentPage,
    pageSize,
    availableOnly,
    enrolledEventIds,
    query: eventsQuery,
    skip: !activeChildId,
  });

  const { childrenOptions, selectedOptions, handleChildChange } =
    useChildSelectOptions({ profile, childId: activeChildId });

  const { isSticky, childSelectRef } = useStickyChildSelect();

  const handleAvailableOnlyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (e.target.checked) {
        next.set('availableOnly', 'true');
      } else {
        next.delete('availableOnly');
      }
      next.delete('page');
      return next;
    });
  };

  const handleLoadMore = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(currentPage + 1));
      return next;
    });
  };

  if (eventsSearch.error) {
    return <ErrorMessage message={t('api.errorMessage')} />;
  }

  if (
    !profile ||
    (eventsSearch.loading && !eventsSearch.child) ||
    (profile && !hasChildren)
  ) {
    return <LoadingSpinner isLoading />;
  }

  if (!eventsSearch.child && activeChildId) {
    return <ErrorMessage message={t('api.errorMessage')} />;
  }

  const searchTitle =
    title || t('search.hero.title', t('search.title', 'Etsi tapahtumia'));
  const searchDescription =
    description !== undefined
      ? description
      : t(
          'search.hero.description',
          t('profile.common.message.serviceDescription')
        );

  return (
    <>
      <PageMeta title={searchTitle} />
      <div className={styles.searchPageWrapper}>
        {childrenOptions.length > 0 && (
          <div
            className={classNames(
              styles.stickyChildHeader,
              isSticky && styles.stickyChildHeaderVisible
            )}
            aria-hidden={!isSticky}
            data-testid="sticky-child-header"
          >
            <ContentContainer className={styles.stickyContentContainer}>
              <div className={styles.stickyChildSelectWrapper}>
                <Select
                  id="sticky-child-selector"
                  aria-describedby="sticky-child-selector-description"
                  aria-live="polite"
                  options={childrenOptions}
                  value={selectedOptions}
                  onChange={handleChildChange}
                  texts={{
                    label: t('search.hero.selectChild'),
                    placeholder: t('search.hero.selectChild'),
                    language: (i18n.language || 'fi') as SupportedLanguage,
                  }}
                  className={styles.childSelect}
                />
                <span
                  id="sticky-child-selector-description"
                  className="visually-hidden"
                >
                  {t('search.childSelector.description')}
                </span>
              </div>
            </ContentContainer>
          </div>
        )}

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
            <h1 className={styles.heroTitle}>{searchTitle}</h1>
            {searchDescription && (
              <p className={styles.heroDescription}>{searchDescription}</p>
            )}
          </ContentContainer>
        </PageSection>

        <ContentContainer className={styles.mainContentContainer}>
          {childrenOptions.length > 0 && (
            <div ref={childSelectRef} className={styles.childSelectWrapper}>
              <Select
                id="child-selector"
                aria-describedby="child-selector-description"
                aria-live="polite"
                options={childrenOptions}
                value={selectedOptions}
                onChange={handleChildChange}
                texts={{
                  label: t('search.hero.selectChild'),
                  placeholder: t('search.hero.selectChild'),
                  language: (i18n.language || 'fi') as SupportedLanguage,
                }}
                className={styles.childSelect}
              />
              <span
                id="child-selector-description"
                className="visually-hidden"
              >
                {t('search.childSelector.description')}
              </span>
            </div>
          )}

          <div className={styles.filterSection}>
            <Accordion
              heading={t('search.filter.title')}
              className={styles.filterAccordion}
            >
              <div className={styles.filterForm}>
                <div className={styles.filterFields}>
                  <TextInput
                    id="search-filter-text"
                    label={t('search.filter.searchLabel')}
                    placeholder={t('search.filter.searchPlaceholder')}
                    disabled
                  />
                  <TextInput
                    id="search-filter-date"
                    label={t('search.filter.dateLabel')}
                    placeholder={t('search.filter.datePlaceholder')}
                    disabled
                  />
                  <TextInput
                    id="search-filter-venue"
                    label={t('search.filter.venueLabel')}
                    placeholder={t('search.filter.venuePlaceholder')}
                    disabled
                  />
                </div>
                <div className={styles.filterToggles}>
                  <Checkbox
                    id="search-filter-available-only"
                    label={t('search.filter.availableOnlyLabel')}
                    checked={availableOnly}
                    onChange={handleAvailableOnlyChange}
                    className={styles.availableOnlyCheckbox}
                  />
                </div>
                <div className={styles.filterButtons}>
                  <Button variant="primary" disabled aria-disabled="true">
                    {t('search.filter.submitButton')}
                  </Button>
                  <Button variant="secondary" disabled aria-disabled="true">
                    {t('search.filter.clearButton')}
                  </Button>
                </div>
              </div>
            </Accordion>
          </div>

          <section className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsCount} aria-live="polite">
                {t('search.results.count', { count: eventsSearch.totalCount })}
              </h2>
            </div>

            {eventsSearch.totalCount > 0 ? (
              <>
                <div className={styles.occurrenceList}>
                  {eventsSearch.events.map((event) => (
                    <EventSearchCard
                      key={event.id}
                      childId={activeChildId || ''}
                      event={event}
                    />
                  ))}
                </div>

                {eventsSearch.hasMore && (
                  <div className={styles.loadMoreWrapper}>
                    <Button variant="secondary" onClick={handleLoadMore}>
                      {t('search.results.loadMore', {
                        count: eventsSearch.remainingCount,
                      })}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className={styles.noResults}>
                {t('search.results.noResults')}
              </p>
            )}
          </section>
        </ContentContainer>
      </div>
    </>
  );
};

export default ChildEventsSearch;
