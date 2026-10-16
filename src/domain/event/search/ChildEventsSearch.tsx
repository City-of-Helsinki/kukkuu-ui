import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link } from 'react-router';
import { useQuery } from '@apollo/client';
import {
  Accordion,
  IconArrowLeft,
  IconSize,
  Select,
  SupportedLanguage,
  TextInput,
} from 'hds-react';
import {
  ContentContainer,
  PageSection,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import PageMeta from '../../app/layout/utilityComponents/PageMeta';
import Button from '../../../common/components/button/Button';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import ErrorMessage from '../../../common/components/error/Error';
import { useProfileContext } from '../../profile/hooks/useProfileContext';
import { childAvailableOccurrencesQuery } from '../queries/childAvailableOccurrencesQuery';
import type {
  ChildAvailableOccurrencesQuery,
  ChildAvailableOccurrencesQueryVariables,
} from '../types/ChildAvailableOccurrencesTypes';
import { flattenAvailableOccurrences } from './occurrenceSearchUtils';
import OccurrenceCard from './OccurrenceCard';
import { OccurrenceCardProvider } from './OccurrenceCardContext';
import styles from './childEventsSearch.module.scss';

export const ChildEventsSearch: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { profile } = useProfileContext();

  const { data, loading, error } = useQuery<
    ChildAvailableOccurrencesQuery,
    ChildAvailableOccurrencesQueryVariables
  >(childAvailableOccurrencesQuery, {
    skip: !childId,
    variables: {
      id: childId || '',
    },
  });

  const [currentYear] = useState(() => new Date().getFullYear());

  const childrenOptions = useMemo(() => {
    return (profile?.children?.edges || [])
      .map((edge) => edge?.node)
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c) => {
        const age = currentYear - c.birthyear;
        return {
          label: `${c.name} (${t('search.hero.childAge', { age })})`,
          value: c.id,
        };
      });
  }, [profile?.children?.edges, currentYear, t]);

  const selectedOptions = useMemo(() => {
    const match = childrenOptions.find((opt) => opt.value === childId);
    return match ? [match] : [];
  }, [childrenOptions, childId]);

  if (loading) {
    return <LoadingSpinner isLoading />;
  }

  if (error || !data?.child) {
    return <ErrorMessage message={t('api.errorMessage')} />;
  }

  const child = data.child;
  const occurrences = flattenAvailableOccurrences(child);

  return (
    <>
      <PageMeta title={t('search.title')} />
      <div className={styles.searchPageWrapper}>
        <PageSection
          korosBottom
          korosBottomClassName={styles.heroKoros}
          className={styles.heroSection}
        >
          <ContentContainer className={styles.heroContentContainer}>
            <div className={styles.backButtonWrapper}>
              <Link
                to={`/profile/child/${childId}`}
                className={styles.backButton}
                aria-label={t('common.backButton.label')}
              >
                <IconArrowLeft size={IconSize.Small} />
              </Link>
            </div>

            <h1 className={styles.heroTitle}>
              {t('search.hero.greeting', { name: child.name })}
            </h1>

            {childrenOptions.length > 1 && (
              <div className={styles.childSelectWrapper}>
                <Select
                  id="child-selector"
                  options={childrenOptions}
                  value={selectedOptions}
                  onChange={(selected) => {
                    const first = Array.isArray(selected) ? selected[0] : selected;
                    const val = typeof first === 'string' ? first : first?.value;
                    if (val) {
                      navigate(`/profile/child/${val}/events`);
                    }
                  }}
                  texts={{
                    label: t('search.hero.selectChild'),
                    placeholder: t('search.hero.selectChild'),
                    language: (i18n.language || 'fi') as SupportedLanguage,
                  }}
                  className={styles.childSelect}
                />
              </div>
            )}
          </ContentContainer>
        </PageSection>

        <ContentContainer className={styles.mainContentContainer}>
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
            <h2 className={styles.resultsCount}>
              {t('search.results.count', { count: occurrences.length })}
            </h2>

            {occurrences.length > 0 ? (
              <OccurrenceCardProvider value={{ dateBadgePosition: 'top-right' }}>
                <div className={styles.occurrenceList}>
                  {occurrences.map((item) => (
                    <OccurrenceCard
                      key={item.occurrence.id}
                      childId={childId || ''}
                      item={item}
                    />
                  ))}
                </div>
              </OccurrenceCardProvider>
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
