import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
  ButtonPresetTheme,
  IconCalendar,
  IconCheck,
  IconGlobe,
  IconLocation,
  StatusLabel,
} from 'hds-react';

import PlaceholderImage from '../../../common/components/placeholderImage/PlaceholderImage';
import LinkButton from '../../../common/components/button/LinkButton';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import {
  getEventLanguageText,
  getEventTimeText,
  getEventVenueText,
} from './eventSearchUtils';
import { getEnrolmentDeniedNotice } from '../EventUtils';
import { useChildEnrolment } from '../hooks/useChildEnrolment';
import {
  EnrolmentDeniedReason,
  TicketSystem,
} from '../../api/generatedTypes/graphql';
import { externalTicketSystems } from '../constants/ExternalTicketSystemConstants';
import type { AvailableEvent } from '../types/EventsSearchTypes';
import styles from './occurrenceCard.module.scss';

/**
 * Resolves the localized display label for an external ticket system provider.
 */
const getTicketSystemLabel = (type: TicketSystem, t: TFunction): string => {
  switch (type) {
    case TicketSystem.Ticketmaster:
      return t('event.ticketSystem.ticketmaster', 'Ticketmaster');
    case TicketSystem.Lippupiste:
      return t('event.ticketSystem.lippupiste', 'Lippupiste');
    case TicketSystem.Tixly:
      return t('event.ticketSystem.tixly', 'Tixly');
    default:
      return '';
  }
};

export type EventSearchCardProps = {
  childId: string;
  event: AvailableEvent;
};

/**
 * Renders an individual event card in the search results list, including image,
 * summary metadata (date/time, venue, languages), enrolment status badges/notices,
 * and a link to the event details page.
 */
export const EventSearchCard: React.FC<EventSearchCardProps> = ({
  childId,
  event,
}) => {
  const { t, i18n } = useTranslation();
  const getPathname = useGetPathname();

  const formattedTime = getEventTimeText(event, t, i18n.language);
  const venueText = getEventVenueText(event);
  const languageText = getEventLanguageText(event, t);
  const detailsUrl = getPathname(`/profile/child/${childId}/event/${event.id}`);
  const enrolmentInfo = useChildEnrolment(childId, event.id);

  const isEnrolledInThisEvent =
    enrolmentInfo.isEnrolledInEvent ||
    Boolean(event.ticketSystem?.childPassword) ||
    event.enrolmentDeniedReason === EnrolmentDeniedReason.AlreadyJoinedEvent ||
    event.enrolmentDeniedReason ===
      EnrolmentDeniedReason.AlreadyHasPasswordToEvent;

  const isEnrolledInSeasonSibling =
    !isEnrolledInThisEvent &&
    (event.enrolmentDeniedReason ===
      EnrolmentDeniedReason.AlreadyJoinedEventGroup ||
      event.enrolmentDeniedReason ===
        EnrolmentDeniedReason.AlreadyHasPasswordToEventGroup);

  const isYearlyLimitReached =
    !isEnrolledInThisEvent &&
    event.enrolmentDeniedReason ===
      EnrolmentDeniedReason.YearlyEnrolmentLimitReached;

  const isExternal = Boolean(
    event.ticketSystem?.type &&
      externalTicketSystems.includes(event.ticketSystem.type)
  );
  const ticketSystemLabel =
    isExternal && event.ticketSystem?.type
      ? getTicketSystemLabel(event.ticketSystem.type, t)
      : null;

  const registrationNotOpenNotice =
    event.enrolmentDeniedReason === EnrolmentDeniedReason.RegistrationNotOpen
      ? getEnrolmentDeniedNotice({
          t,
          enrolmentDeniedReason: event.enrolmentDeniedReason,
          registrationOpensAt: event.registrationOpensAt,
        })
      : null;

  return (
    <article className={styles.occurrenceCard}>
      <div className={styles.imageWrapper}>
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

      <div className={styles.contentWrapper}>
        <div className={styles.topRow}>
          <div className={styles.header}>
            <h3 className={styles.title}>{event.name}</h3>
            {event.shortDescription && (
              <p className={styles.shortDescription}>
                {event.shortDescription}
              </p>
            )}
          </div>
        </div>

        <div className={styles.metadata}>
          {formattedTime && (
            <div className={styles.metaRow}>
              <IconCalendar aria-hidden="true" className={styles.icon} />
              <span>{formattedTime}</span>
            </div>
          )}
          {venueText && (
            <div className={styles.metaRow}>
              <IconLocation aria-hidden="true" className={styles.icon} />
              <span>{venueText}</span>
            </div>
          )}
          {languageText && (
            <div className={styles.metaRow}>
              <IconGlobe aria-hidden="true" className={styles.icon} />
              <span>{languageText}</span>
            </div>
          )}
        </div>

        <div className={styles.badgeList}>
          {isEnrolledInThisEvent && (
            <StatusLabel
              type="alert"
              iconStart={<IconCheck aria-hidden="true" />}
            >
              {t('search.card.enrolledBadge')}
            </StatusLabel>
          )}
          {isEnrolledInSeasonSibling && (
            <StatusLabel type="neutral">
              {t('search.card.alreadyEnrolledSeasonBadge')}
            </StatusLabel>
          )}
          {ticketSystemLabel && (
            <span className={styles.pill}>
              {ticketSystemLabel}
            </span>
          )}
        </div>

        {isEnrolledInThisEvent && (
          <div className={styles.notice}>
            {t('search.card.alreadyEnrolledNotice')}
          </div>
        )}
        {isEnrolledInSeasonSibling && (
          <div className={styles.notice}>
            {t('search.card.alreadyEnrolledSeasonNotice')}
          </div>
        )}
        {isYearlyLimitReached && (
          <div className={styles.notice}>
            {t('search.card.yearlyLimitReachedNotice')}
          </div>
        )}
        {registrationNotOpenNotice && (
          <div className={styles.notice}>{registrationNotOpenNotice}</div>
        )}

        <div className={styles.actions}>
          <LinkButton to={detailsUrl} variant="primary" theme={ButtonPresetTheme.Black} fullWidth>
            {t('search.card.readMoreButton')}
          </LinkButton>
        </div>
      </div>
    </article>
  );
};

export default EventSearchCard;
