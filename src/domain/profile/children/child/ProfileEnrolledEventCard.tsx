import React, { useState, useId } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  IconCheck,
  IconClock,
  IconGlobe,
  IconLocation,
  IconTrash,
  IconSize,
  StatusLabel,
} from 'hds-react';

import Button from '../../../../common/components/button/Button';
import LinkButton from '../../../../common/components/button/LinkButton';
import PlaceholderImage from '../../../../common/components/placeholderImage/PlaceholderImage';
import {
  formatOccurrenceDateLong,
  formatOccurrenceTimeRange,
} from '../../../../common/time/occurrenceTime';
import { shouldAllowUnenrolment } from '../../../event/EventUtils';
import UnenrolModal from '../../../event/modal/UnenrolModal';
import useGetPathname from '../../../../common/route/utils/useGetPathname';
import { InternalOrTicketSystemEnrolment } from '../../../child/types/ChildByIdQueryTypes';
import styles from './profileEnrolledEventCard.module.scss';

export interface ProfileEnrolledEventCardProps {
  childId: string;
  enrolment: InternalOrTicketSystemEnrolment;
}

const getFormattedDateTime = (
  time: string | undefined,
  duration: number | null | undefined,
  language: string,
  separator: string
) => {
  if (!time) return '';
  const date = formatOccurrenceDateLong(time, language);
  const timeStr = formatOccurrenceTimeRange(time, duration);
  if (date && timeStr) {
    return `${date} ${separator} ${timeStr}`;
  }
  return date || timeStr;
};

const getVenueText = (
  venue?: { name?: string | null; address?: string | null } | null
) => {
  if (!venue) return '';
  return [venue.name, venue.address].filter(Boolean).join(', ');
};

const getLanguageText = (
  occurrence: unknown,
  t: (key: string, options?: { defaultValue?: string }) => string
) => {
  if (
    occurrence &&
    typeof occurrence === 'object' &&
    'occurrenceLanguage' in occurrence
  ) {
    const lang = (occurrence as { occurrenceLanguage?: string }).occurrenceLanguage;
    if (lang) {
      return t(`common.language.${lang.toLowerCase()}`, { defaultValue: lang });
    }
  }
  return null;
};

const EnrolledEventMetadata: React.FC<{
  formattedDateTime?: string;
  venueText?: string;
  languageText?: string | null;
  t: (key: string, options?: Record<string, unknown>) => string;
}> = ({ formattedDateTime, venueText, languageText, t }) => (
  <div className={styles.metadataList}>
    {formattedDateTime && (
      <div className={styles.metaItem}>
        <IconClock size={IconSize.Small} aria-hidden="true" />
        <span>{formattedDateTime}</span>
      </div>
    )}
    {venueText && (
      <div className={styles.metaItem}>
        <IconLocation size={IconSize.Small} aria-hidden="true" />
        <span>{venueText}</span>
      </div>
    )}
    {languageText && (
      <div className={styles.metaItem}>
        <IconGlobe size={IconSize.Small} aria-hidden="true" />
        <span>
          {t('search.card.languages', {
            languages: languageText,
            defaultValue: `Kielet: ${languageText}`,
          })}
        </span>
      </div>
    )}
  </div>
);

const ProfileEnrolledEventCard: React.FC<ProfileEnrolledEventCardProps> = ({
  childId,
  enrolment,
}) => {
  const { t, i18n } = useTranslation();
  const getPathname = useGetPathname();
  const [isUnenrolModalOpen, setIsUnenrolModalOpen] = useState(false);
  const cancellationTooltipId = useId();

  const isInternal = enrolment.__typename === 'EnrolmentNode';
  const event = isInternal ? enrolment.occurrence.event : enrolment.event;
  const occurrence = isInternal ? enrolment.occurrence : null;

  const eventImage = event.image ? (
    <img src={event.image} alt={event.imageAltText || event.name || ''} />
  ) : (
    <PlaceholderImage />
  );

  const formattedDateTime = getFormattedDateTime(
    occurrence?.time,
    event.duration,
    i18n.language,
    t('common.dateTimeSeparator', 'klo')
  );

  const venueText = getVenueText(occurrence?.venue);
  const languageText = getLanguageText(occurrence, t);
  const canUnenrol = occurrence ? shouldAllowUnenrolment(occurrence.time) : false;

  const readMoreUrl = isInternal && occurrence
    ? getPathname(`/profile/child/${childId}/event/${event.id}`)
    : getPathname(
        `/profile/child/${childId}/event/${event.id}/external-enrolment`
      );

  // Event group ID if available
  const eventGroupId = event && 'eventGroup' in event
    ? (event as unknown as { eventGroup?: { id: string } }).eventGroup?.id
    : undefined;

  return (
    <Card
      border
      className={styles.enrolledCard}
      aria-labelledby={`enrolled-event-title-${enrolment.id}`}
    >
      <div className={styles.imageWrapper}>{eventImage}</div>
      <div className={styles.contentWrapper}>
        <div className={styles.headerRow}>
          <h5 id={`enrolled-event-title-${enrolment.id}`} className={styles.title}>
            {event.name}
          </h5>
          <div className={styles.badgeContainer}>
            <StatusLabel
              type="alert"
              iconStart={<IconCheck aria-hidden="true" />}
              className={styles.enrolledBadge}
            >
              {t('profile.events.enrolledBadge')}
            </StatusLabel>
          </div>
        </div>

        {event.shortDescription && (
          <p className={styles.shortDescription}>{event.shortDescription}</p>
        )}

        {occurrence && (
          <EnrolledEventMetadata
            formattedDateTime={formattedDateTime}
            venueText={venueText}
            languageText={languageText}
            t={t}
          />
        )}

        <div className={styles.actions}>
          {isInternal && occurrence && (
            <div className={styles.cancelButtonWrapper}>
              <Button
                variant="danger"
                iconStart={<IconTrash aria-hidden="true" />}
                disabled={!canUnenrol}
                aria-haspopup="dialog"
                aria-describedby={!canUnenrol ? cancellationTooltipId : undefined}
                aria-label={t('profile.events.cancelEnrolmentAriaLabel', {
                  eventName: event.name,
                })}
                onClick={() => setIsUnenrolModalOpen(true)}
                className={styles.cancelButton}
              >
                {t('profile.events.cancelEnrolmentButton')}
              </Button>
              {!canUnenrol && (
                <p id={cancellationTooltipId} className={styles.cancelDisabledText}>
                  {t('profile.events.cancelDisabledTooltip')}
                </p>
              )}
            </div>
          )}

          <LinkButton
            to={readMoreUrl}
            variant="secondary"
            className={styles.readMoreButton}
          >
            {t('profile.events.readMoreButton')}
          </LinkButton>
        </div>
      </div>

      {isInternal && occurrence && isUnenrolModalOpen && (
        <UnenrolModal
          isOpen={isUnenrolModalOpen}
          setIsOpen={setIsUnenrolModalOpen}
          childId={childId}
          occurrenceId={occurrence.id}
          eventId={event.id}
          eventGroupId={eventGroupId}
          occurrence={occurrence}
          event={event}
        />
      )}
    </Card>
  );
};

export default ProfileEnrolledEventCard;
