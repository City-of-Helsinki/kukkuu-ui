import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconCalendarClock,
  IconGlobe,
  IconLocation,
} from 'hds-react';
import {
  ContentContainer,
  PageSection,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import PlaceholderImage from '../../../common/components/placeholderImage/PlaceholderImage';
import LinkButton from '../../../common/components/button/LinkButton';
import Button from '../../../common/components/button/Button';
import {
  formatOccurrenceDateLong,
  formatOccurrenceTimeRange,
} from '../../../common/time/occurrenceTime';
import styles from './eventHero.module.scss';

export interface EventHeroOccurrence {
  id: string;
  time: string;
  remainingCapacity?: number | null;
  occurrenceLanguage?: string | null;
  venue?: {
    id?: string;
    name?: string | null;
    address?: string | null;
  } | null;
}

export interface EventHeroEvent {
  id: string;
  name?: string | null;
  shortDescription?: string | null;
  image?: string | null;
  imageAltText?: string | null;
  duration?: number | null;
  canChildEnroll?: boolean | null;
}

export interface EventHeroProps {
  event: EventHeroEvent;
  selectedOccurrence?: EventHeroOccurrence | null;
  childId: string;
  backTo?: string;
}

export const EventHero: React.FC<EventHeroProps> = ({
  event,
  selectedOccurrence,
  childId,
}) => {
  const { t, i18n } = useTranslation();

  const formattedDateTime = selectedOccurrence
    ? [
        formatOccurrenceDateLong(selectedOccurrence.time, i18n.language),
        formatOccurrenceTimeRange(selectedOccurrence.time, event.duration),
      ].join(', ')
    : null;

  const venueText = selectedOccurrence?.venue
    ? [selectedOccurrence.venue.name, selectedOccurrence.venue.address]
        .filter(Boolean)
        .join(', ')
    : null;

  const languageText = selectedOccurrence?.occurrenceLanguage
    ? t('search.card.languages', {
        languages: t(
          `common.language.${selectedOccurrence.occurrenceLanguage.toLowerCase()}`
        ),
      })
    : null;

  const canEnroll = Boolean(
    event.canChildEnroll &&
      selectedOccurrence &&
      selectedOccurrence.remainingCapacity !== 0
  );

  const enrolUrl = selectedOccurrence
    ? `/profile/child/${childId}/event/${event.id}/occurrence/${selectedOccurrence.id}/enrol`
    : '#';

  return (
    <PageSection
      korosBottom
      korosBottomClassName={styles.heroKoros}
      className={styles.heroSection}
    >
      <ContentContainer className={styles.contentContainer}>
        <div className={styles.heroGrid}>
          {/* Left Column: Image (full height, under koros) */}
          <div className={styles.imageColumn}>
            {event.image ? (
              <img
                src={event.image}
                alt={event.imageAltText || event.name || ''}
                className={styles.image}
              />
            ) : (
              <PlaceholderImage />
            )}
          </div>

          {/* Right Column: Title, metadata, badges, and enrolment button */}
          <div className={styles.detailsColumn}>
            <h1 className={styles.title}>{event.name}</h1>

            {event.shortDescription && (
              <p className={styles.shortDescription}>
                {event.shortDescription}
              </p>
            )}

            <div className={styles.metaList}>
              {formattedDateTime && (
                <div className={styles.metaRow}>
                  <IconCalendarClock
                    aria-hidden="true"
                    className={styles.metaIcon}
                  />
                  <span>{formattedDateTime}</span>
                </div>
              )}

              {venueText && (
                <div className={styles.metaRow}>
                  <IconLocation
                    aria-hidden="true"
                    className={styles.metaIcon}
                  />
                  <span>{venueText}</span>
                </div>
              )}

              {languageText && (
                <div className={styles.metaRow}>
                  <IconGlobe
                    aria-hidden="true"
                    className={styles.metaIcon}
                  />
                  <span>{languageText}</span>
                </div>
              )}
            </div>

            <div className={styles.badgeList}>
              <span className={styles.pill}>
                {t('search.card.badgeExample1')}
              </span>
              <span className={styles.pill}>
                {t('search.card.badgeExample2')}
              </span>
            </div>

            <div className={styles.actionWrapper}>
              {canEnroll ? (
                <LinkButton
                  to={enrolUrl}
                  variant="primary"
                  className={styles.enrolButton}
                >
                  {t('event.hero.enrolButton')}
                </LinkButton>
              ) : (
                <Button
                  variant="disabled"
                  disabled
                  aria-disabled="true"
                  className={styles.enrolButtonDisabled}
                >
                  {t('event.hero.enrolButton')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </ContentContainer>
    </PageSection>
  );
};

export default EventHero;
