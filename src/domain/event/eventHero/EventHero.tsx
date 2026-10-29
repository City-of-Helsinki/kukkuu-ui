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
import AnchorButton from '../../../common/components/button/AnchorButton';
import UnenrolModal from '../modal/UnenrolModal';
import { useChildEnrolment } from '../hooks/useChildEnrolment';
import {
  extractUniqueLanguages,
  extractUniqueVenues,
  findEnrolledOccurrence,
  formatEventHeroDateTime,
  shouldAllowUnenrolment,
} from '../EventUtils';
import {
  EnrolmentDeniedReason,
  TicketSystem,
} from '../../api/generatedTypes/graphql';
import { externalTicketSystems } from '../constants/ExternalTicketSystemConstants';
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
  enrolmentDeniedReason?: EnrolmentDeniedReason | null;
  registrationOpensAt?: string | null;
  ticketSystem?: {
    type: TicketSystem;
    childPassword?: string | null;
    url?: string | null;
  } | null;
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

  const isExternal = Boolean(
    event.ticketSystem?.type &&
      externalTicketSystems.includes(event.ticketSystem.type)
  );
  const isEnrolled = isExternal
    ? Boolean(event.ticketSystem?.childPassword)
    : enrolmentInfo.isEnrolledInEvent;

  const isEnrolledInSeasonSibling =
    !isEnrolled &&
    (event.enrolmentDeniedReason ===
      EnrolmentDeniedReason.AlreadyJoinedEventGroup ||
      event.enrolmentDeniedReason ===
        EnrolmentDeniedReason.AlreadyHasPasswordToEventGroup);

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
    return t('event.hero.multipleVenues');
  }, [allOccurrences, t]);

  const languageText = React.useMemo(() => {
    const uniqueLangs = extractUniqueLanguages(null, allOccurrences);
    if (uniqueLangs.length === 0) return null;
    const formattedLangs = uniqueLangs
      .map((lang) => t(`common.language.${lang}`))
      .join(', ');

    if (uniqueLangs.length === 1) {
      return t('event.hero.languageSingle', {
        languages: formattedLangs,
      });
    }

    return t('event.hero.languagesMultiple', {
      languages: formattedLangs,
    });
  }, [allOccurrences, t]);

  const DateIcon = IconCalendar;

  const renderExternalActions = () => {
    if (isEnrolled) {
      return (
        <div className={styles.enrolledActionGroup}>
          <Button
            variant="primary"
            onClick={() => {
              document
                .getElementById('ticket-system-section')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={styles.enrolButton}
          >
            {t('event.hero.viewPasswordButton')}
          </Button>
          {event.ticketSystem?.url && (
            <AnchorButton
              href={event.ticketSystem.url}
              openInNewTab
              className={styles.continueButton}
            >
              {t('externalTicketSystemEvent.continueButton')}
            </AnchorButton>
          )}
        </div>
      );
    }

    return (
      <Button
        variant="primary"
        role="link"
        iconEnd={<IconArrowDown aria-hidden="true" />}
        onClick={() => {
          document
            .getElementById('ticket-system-section')
            ?.scrollIntoView({ behavior: 'smooth' });
        }}
        className={styles.enrolButton}
      >
        {t('event.hero.claimPasswordButton')}
      </Button>
    );
  };

  const renderInternalActions = () => {
    if (enrolmentInfo.isEnrolledInEvent) {
      return (
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
      );
    }

    return (
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
    );
  };

  const renderHeroActions = () => {
    return isExternal ? renderExternalActions() : renderInternalActions();
  };

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
              {isEnrolled && (
                <StatusLabel
                  type="alert"
                  iconStart={<IconCheck aria-hidden="true" />}
                  className={styles.enrolledBadge}
                  data-testid="hero-enrolled-badge"
                >
                  {t('event.hero.enrolledBadge')}
                </StatusLabel>
              )}
              {isEnrolledInSeasonSibling && (
                <StatusLabel
                  type="neutral"
                  className={styles.seasonEnrolledBadge}
                  data-testid="hero-season-enrolled-badge"
                >
                  {t('search.card.alreadyEnrolledSeasonBadge')}
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
              {renderHeroActions()}
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
          extraChildrenCount={enrolmentInfo.extraChildrenCount}
          extraGuardiansCount={enrolmentInfo.extraGuardiansCount}
        />
      )}
    </PageSection>
  );
};

export default EventHero;
