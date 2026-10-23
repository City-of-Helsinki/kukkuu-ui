import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router';
import { DocumentNode } from '@apollo/client';
import {
  Accordion,
  Breadcrumb,
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
  const { childId } = useParams<{ childId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const getPathname = useGetPathname();
  const { profile } = useProfileContext();

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

  const eventsSearch = useEventsSearch({
    childId,
    page: currentPage,
    pageSize,
    query: eventsQuery,
  });

  const { childrenOptions, selectedOptions, handleChildChange } =
    useChildSelectOptions({ profile, childId });

  const { isSticky, childSelectRef } = useStickyChildSelect();

  const handleLoadMore = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(currentPage + 1));
      return next;
    });
  };

  if (eventsSearch.loading) {
    return <LoadingSpinner isLoading />;
  }

  if (eventsSearch.error || !eventsSearch.child) {
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
                      childId={childId || ''}
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
