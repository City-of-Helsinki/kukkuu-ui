import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonPresetTheme,
  IconCalendar,
  IconGlobe,
  IconLocation,
  Notification,
  NotificationSize,
} from 'hds-react';

import PlaceholderImage from '../../../common/components/placeholderImage/PlaceholderImage';
import LinkButton from '../../../common/components/button/LinkButton';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import {
  getEventLanguageText,
  getEventTimeText,
  getEventVenueText,
  getSortedEventOccurrences,
} from './eventSearchUtils';
import { getEnrolmentDeniedNotice } from '../EventUtils';
import { EventBadges } from '../components/EventBadges';
import { useChildEnrolment } from '../hooks/useChildEnrolment';
import { EnrolmentDeniedReason } from '../../api/generatedTypes/graphql';
import type { AvailableEvent } from '../types/EventsSearchTypes';
import styles from './occurrenceCard.module.scss';

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

  const sortedOccurrences = React.useMemo(
    () => getSortedEventOccurrences(event),
    [event]
  );
  const formattedTime = getEventTimeText(event, t, i18n.language);
  const venueText = getEventVenueText(event, t);
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

  const registrationNotOpenNotice =
    event.enrolmentDeniedReason === EnrolmentDeniedReason.RegistrationNotOpen
      ? getEnrolmentDeniedNotice({
          t,
          enrolmentDeniedReason: event.enrolmentDeniedReason,
          registrationOpensAt: event.registrationOpensAt,
        })
      : null;

  const notificationAriaLabel = t('consent.texts.ui.notificationAriaLabel');

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

        <EventBadges
          event={event}
          occurrences={sortedOccurrences}
          isEnrolled={isEnrolledInThisEvent}
          isEnrolledInSeasonSibling={isEnrolledInSeasonSibling}
          showCount={false}
          className={styles.badgeList}
        />

        {isEnrolledInThisEvent && (
          <Notification
            type="info"
            size={NotificationSize.Small}
            notificationAriaLabel={notificationAriaLabel}
            className={styles.notice}
          >
            {t('search.card.alreadyEnrolledNotice')}
          </Notification>
        )}
        {isEnrolledInSeasonSibling && (
          <Notification
            type="info"
            size={NotificationSize.Small}
            notificationAriaLabel={notificationAriaLabel}
            className={styles.notice}
          >
            {t('search.card.alreadyEnrolledSeasonNotice')}
          </Notification>
        )}
        {isYearlyLimitReached && (
          <Notification
            type="info"
            size={NotificationSize.Small}
            notificationAriaLabel={notificationAriaLabel}
            className={styles.notice}
          >
            {t('search.card.yearlyLimitReachedNotice')}
          </Notification>
        )}
        {registrationNotOpenNotice && (
          <Notification
            type="info"
            size={NotificationSize.Small}
            notificationAriaLabel={notificationAriaLabel}
            className={styles.notice}
          >
            {registrationNotOpenNotice}
          </Notification>
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
