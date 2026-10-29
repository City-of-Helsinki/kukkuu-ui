import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, IconInfoCircle, IconSize } from 'hds-react';

import { DEFAULT_TIME_FORMAT } from '../../../common/time/TimeConstants';
import {
  formatOccurrenceDateLong,
  formatOccurrenceTimeRange,
} from '../../../common/time/occurrenceTime';
import { formatTime, newDate } from '../../../common/time/utils';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from './EventOccurrencesTable';
import { EventOccurrenceActionButton } from './EventOccurrenceActionButton';
import { isOccurrenceFull, venueHasDetailedInfo } from '../EventUtils';
import styles from './eventOccurrencesTable.module.scss';

export type EventOccurrenceAccordionItemProps = {
  occurrence: EventOccurrencesTableOccurrence;
  event: EventOccurrencesTableEvent;
  childId: string;
  enrolledOccurrenceId?: string | null;
  initiallyOpen?: boolean;
  onEnrol: (occurrence: EventOccurrencesTableOccurrence) => void;
  onCancelEnrolment?: (occurrence: EventOccurrencesTableOccurrence) => void;
  onSubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onUnsubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onVenueInfoClick?: (
    venue: NonNullable<EventOccurrencesTableOccurrence['venue']>
  ) => void;
};

/**
 * Mobile HDS Accordion card representing an individual occurrence matching Figma designs:
 * 2-line header with date, start time, and remaining capacity badge;
 * expanded body displaying time range, language, venue with info icon, address, and action button.
 */
export const EventOccurrenceAccordionItem: React.FC<
  EventOccurrenceAccordionItemProps
> = ({
  occurrence,
  event,
  childId,
  enrolledOccurrenceId,
  initiallyOpen = false,
  onEnrol,
  onCancelEnrolment,
  onSubscribe,
  onUnsubscribe,
  onVenueInfoClick,
}) => {
  const { t, i18n } = useTranslation();

  const formattedDate = formatOccurrenceDateLong(
    occurrence.time,
    i18n.language
  );
  const startTime = formatTime(newDate(occurrence.time), DEFAULT_TIME_FORMAT);
  const formattedTimeRange = formatOccurrenceTimeRange(
    occurrence.time,
    event.duration
  );
  const isFull = isOccurrenceFull(occurrence.remainingCapacity);
  const timeSeparator = t('common.dateTimeSeparator');

  const venueName = occurrence.venue?.name;
  const venueAddress = occurrence.venue?.address;
  const showVenueInfoIcon = venueHasDetailedInfo(occurrence.venue);

  const languageText = occurrence.occurrenceLanguage
    ? t(`common.language.${occurrence.occurrenceLanguage.toLowerCase()}`)
    : null;

  const getCapacityText = () => {
    if (isFull) {
      return `(${t('event.occurrencesTable.fullBadge')})`;
    }
    if (typeof occurrence.remainingCapacity === 'number') {
      return t('event.occurrencesTable.remainingSpotsCount', {
        count: occurrence.remainingCapacity,
      });
    }
    return '';
  };

  const capacityText = getCapacityText();

  const heading = capacityText
    ? `${formattedDate} • ${timeSeparator} ${startTime}\n${capacityText}`
    : `${formattedDate} • ${timeSeparator} ${startTime}`;

  return (
    <Accordion
      card
      border
      closeButton
      initiallyOpen={initiallyOpen}
      heading={heading}
      headingLevel={3}
      language={getCurrentLanguage(i18n)}
      id={`occurrence-accordion-${occurrence.id}`}
    >
      <div className={styles.accordionBodyContent}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>
            {t('event.occurrencesTable.timeLabel')}:
          </span>{' '}
          <span className={styles.detailValue}>{formattedTimeRange}</span>
        </div>

        {languageText && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>
              {t('event.occurrencesTable.languageLabel')}:
            </span>{' '}
            <span className={styles.detailValue}>{languageText}</span>
          </div>
        )}

        {venueName && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>
              {t('event.occurrencesTable.venueLabel')}:
            </span>{' '}
            <span className={styles.detailValue}>{venueName}</span>
            {showVenueInfoIcon && occurrence.venue && (
              <button
                type="button"
                className={styles.venueInfoButton}
                onClick={() => {
                  if (occurrence.venue) {
                    onVenueInfoClick?.(occurrence.venue);
                  }
                }}
                aria-label={t('event.occurrencesTable.venueInfoAriaLabel', {
                  venue: venueName,
                })}
              >
                <IconInfoCircle
                  aria-hidden="true"
                  size={IconSize.ExtraSmall}
                  className={styles.venueInfoIcon}
                />
              </button>
            )}
          </div>
        )}

        {venueAddress && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>
              {t('event.occurrencesTable.addressLabel')}:
            </span>{' '}
            <span className={styles.detailValue}>{venueAddress}</span>
          </div>
        )}

        <div className={styles.accordionActionWrapper}>
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
    </Accordion>
  );
};

export default EventOccurrenceAccordionItem;
