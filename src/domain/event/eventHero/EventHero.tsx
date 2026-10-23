import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconArrowDown,
  IconCalendar,
  IconCheck,
  IconGlobe,
  IconLocation,
  IconTrash,
  StatusLabel,
} from 'hds-react';
import {
  BackgroundImage,
  ContentContainer,
  PageSection,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import PlaceholderImage from '../../../common/components/placeholderImage/PlaceholderImage';
import Button from '../../../common/components/button/Button';
import UnenrolModal from '../modal/UnenrolModal';
import { useChildEnrolment } from '../hooks/useChildEnrolment';
import {
  extractUniqueLanguages,
  extractUniqueVenues,
  findEnrolledOccurrence,
  formatEventHeroDateTime,
  shouldAllowUnenrolment,
} from '../EventUtils';
import styles from './eventHero.module.scss';

export type EventHeroOccurrence = {
  id: string;
  time: string;
  remainingCapacity?: number | null;
  occurrenceLanguage?: string | null;
  venue?: {
    id?: string;
    name?: string | null;
    address?: string | null;
  } | null;
};

export type EventHeroEvent = {
  id: string;
  name?: string | null;
  shortDescription?: string | null;
  image?: string | null;
  imageAltText?: string | null;
  duration?: number | null;
  canChildEnroll?: boolean | null;
};

export type EventHeroProps = {
  event: EventHeroEvent;
  allOccurrences?: EventHeroOccurrence[];
  childId: string;
};

export const EventHero: React.FC<EventHeroProps> = ({
  event,
  allOccurrences = [],
  childId,
}) => {
  const { t, i18n } = useTranslation();
  const [isUnenrolModalOpen, setIsUnenrolModalOpen] = useState(false);
  const enrolmentInfo = useChildEnrolment(childId, event.id);

  const enrolledOccurrence = findEnrolledOccurrence(
    enrolmentInfo.enrolledOccurrenceId,
    allOccurrences
  );

  const enrolledOccurrenceTime =
    enrolledOccurrence?.time || enrolmentInfo.enrolledOccurrenceTime;
  const canUnenrol = enrolledOccurrenceTime
    ? shouldAllowUnenrolment(enrolledOccurrenceTime)
    : true;

  const formattedDateTime = formatEventHeroDateTime({
    allOccurrences,
    duration: event.duration,
    locale: i18n.language,
    t,
  });

  const venueText = React.useMemo(() => {
    const uniqueVenues = extractUniqueVenues(null, allOccurrences);
    if (uniqueVenues.length === 0) return null;
    if (uniqueVenues.length === 1) {
      return (
        [uniqueVenues[0].name, uniqueVenues[0].address]
          .filter(Boolean)
          .join(', ') || null
      );
    }
    const venueNames = uniqueVenues
      .map((v) => v.name || v.address)
      .filter((v): v is string => Boolean(v));
    return venueNames.length > 0 ? venueNames.join(', ') : null;
  }, [allOccurrences]);

  const languageText = React.useMemo(() => {
    const uniqueLangs = extractUniqueLanguages(null, allOccurrences);
    if (uniqueLangs.length === 0) return null;
    return t('search.card.languages', {
      languages: uniqueLangs
        .map((lang) => t(`common.language.${lang}`))
        .join(', '),
    });
  }, [allOccurrences, t]);

  const DateIcon = IconCalendar;

  return (
    <PageSection
      korosBottom
      korosBottomClassName={styles.heroKoros}
      className={styles.heroSection}
    >
      <ContentContainer className={styles.contentContainer}>
        <div className={styles.heroGrid}>
          {/* Left Column: Background Image (does not dictate hero height) */}
          <div className={styles.imageColumn}>
            <div className={styles.imageCard}>
              {event.image ? (
                <BackgroundImage
                  className={styles.image}
                  id={`event-background-${event.id}`}
                  url={event.image}
                  role="img"
                  aria-label={event.imageAltText || event.name || ''}
                />
              ) : (
                <PlaceholderImage />
              )}
            </div>
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
                  <DateIcon
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
              {enrolmentInfo.isEnrolledInEvent && (
                <StatusLabel
                  type="alert"
                  iconStart={<IconCheck aria-hidden="true" />}
                  className={styles.enrolledBadge}
                >
                  {t('event.hero.enrolledBadge', 'Ilmoittautunut')}
                </StatusLabel>
              )}
              <span className={styles.pill}>
                {t('search.card.badgeExample1')}
              </span>
              <span className={styles.pill}>
                {t('search.card.badgeExample2')}
              </span>
            </div>

            <div className={styles.actionWrapper}>
              {enrolmentInfo.isEnrolledInEvent ? (
                <div className={styles.enrolledActionGroup}>
                  <Button
                    variant="danger"
                    iconStart={<IconTrash aria-hidden="true" />}
                    disabled={!canUnenrol}
                    onClick={() => setIsUnenrolModalOpen(true)}
                    className={styles.cancelButton}
                  >
                    {t(
                      'event.hero.cancelEnrolmentButton',
                      'Peruuta ilmoittautuminen'
                    )}
                  </Button>
                  <a
                    href="#occurrences-table"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById('occurrences-table')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={styles.viewAllLink}
                  >
                    {t(
                      'event.hero.viewAllOccurrencesLink',
                      'Katso kaikki ajankohdat'
                    )}
                  </a>
                </div>
              ) : (
                <Button
                  variant="primary"
                  role="link"
                  iconEnd={<IconArrowDown aria-hidden="true" />}
                  onClick={() => {
                    document
                      .getElementById('occurrences-table')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={styles.enrolButton}
                >
                  {t('event.hero.viewOccurrencesButton')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </ContentContainer>

      {isUnenrolModalOpen && (
        <UnenrolModal
          isOpen={isUnenrolModalOpen}
          setIsOpen={setIsUnenrolModalOpen}
          childId={childId}
          occurrenceId={enrolmentInfo.enrolledOccurrenceId || ''}
          eventId={event.id}
          occurrence={enrolledOccurrence}
          event={{
            ...event,
            name: event.name || '',
          }}
          childName={enrolmentInfo.childName}
        />
      )}
    </PageSection>
  );
};

export default EventHero;
