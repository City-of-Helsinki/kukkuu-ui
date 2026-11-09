import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from '../EventOccurrencesTable';
import { OccurrenceVenueLink } from './OccurrenceVenueLink';
import { EventOccurrenceActionButton } from '../EventOccurrenceActionButton';
import styles from './occurrenceDetailsList.module.scss';

export type OccurrenceDetailsListProps = {
  occurrence: EventOccurrencesTableOccurrence;
  event: EventOccurrencesTableEvent;
  childId: string;
  enrolledOccurrenceId?: string | null;
  formattedTimeRange: string;
  languageText: string;
  accessibilities?: string[] | null;
  onEnrol: (occurrence: EventOccurrencesTableOccurrence) => void;
  onCancelEnrolment?: (occurrence: EventOccurrencesTableOccurrence) => void;
  onSubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onUnsubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onVenueInfoClick?: (
    venue: NonNullable<EventOccurrencesTableOccurrence['venue']>
  ) => void;
  className?: string;
};

/**
 * Definition list `<dl>` rendering occurrence details for the mobile view:
 * Time range, Venue (interactive link), Address, Languages, and Accessibilities,
 * followed by the full-width action button.
 */
export const OccurrenceDetailsList: React.FC<OccurrenceDetailsListProps> = ({
  occurrence,
  event,
  childId,
  enrolledOccurrenceId,
  formattedTimeRange,
  languageText,
  accessibilities,
  onEnrol,
  onCancelEnrolment,
  onSubscribe,
  onUnsubscribe,
  onVenueInfoClick,
  className,
}) => {
  const { t } = useTranslation();
  const venue = occurrence.venue;
  const address = venue?.address?.trim();
  const accessibilitiesText =
    accessibilities && accessibilities.length > 0
      ? accessibilities.join(', ')
      : null;

  return (
    <div className={classNames(styles.detailsContainer, className)}>
      <dl className={styles.detailsList}>
        <dt>{t('event.occurrencesTable.timeLabel')}:</dt>
        <dd>{formattedTimeRange}</dd>

        {venue?.name && (
          <>
            <dt>{t('event.occurrencesTable.venueLabel')}:</dt>
            <dd>
              <OccurrenceVenueLink
                venue={venue}
                onVenueInfoClick={onVenueInfoClick}
                showLocationTooltip={false}
              />
            </dd>
          </>
        )}

        {address && (
          <>
            <dt>{t('event.occurrencesTable.addressLabel')}:</dt>
            <dd>{address}</dd>
          </>
        )}

        {languageText && languageText !== '–' && (
          <>
            <dt>{t('event.occurrencesTable.languagesLabel')}:</dt>
            <dd>{languageText}</dd>
          </>
        )}

        {accessibilitiesText && (
          <>
            <dt>{t('event.occurrencesTable.accessibilityLabel')}:</dt>
            <dd>{accessibilitiesText}</dd>
          </>
        )}
      </dl>

      <div className={styles.actionWrapper}>
        <EventOccurrenceActionButton
          occurrence={occurrence}
          event={event}
          childId={childId}
          enrolledOccurrenceId={enrolledOccurrenceId}
          onEnrol={onEnrol}
          onCancelEnrolment={onCancelEnrolment}
          onSubscribe={onSubscribe}
          onUnsubscribe={onUnsubscribe}
          fullWidth
        />
      </div>
    </div>
  );
};

export default OccurrenceDetailsList;
