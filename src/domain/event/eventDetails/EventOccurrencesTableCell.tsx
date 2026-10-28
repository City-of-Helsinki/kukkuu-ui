import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconAlertCircle, IconInfoCircle, IconSize } from 'hds-react';

import { venueHasDetailedInfo } from '../EventUtils';
import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from './EventOccurrencesTable';
import type {
  EventOccurrencesTableCellContext,
  EventOccurrencesTableColumn,
} from './eventOccurrencesTableColumns';
import { EventOccurrenceActionButton } from './EventOccurrenceActionButton';
import styles from './eventOccurrencesTable.module.scss';

export type EventOccurrencesTableCellProps = {
  column: EventOccurrencesTableColumn;
  occurrence: EventOccurrencesTableOccurrence;
  event: EventOccurrencesTableEvent;
  childId: string;
  enrolledOccurrenceId?: string | null;
  formattedDate: string;
  formattedTime: string;
  isFull: boolean;
  formatCapacityText: (remaining: number | null | undefined) => string;
  onEnrol: (occurrence: EventOccurrencesTableOccurrence) => void;
  onCancelEnrolment?: (occurrence: EventOccurrencesTableOccurrence) => void;
  onSubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onUnsubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onVenueInfoClick?: (venue: NonNullable<EventOccurrencesTableOccurrence['venue']>) => void;
};

/**
 * Renders a single `<td>` cell in the occurrences table according to the column definition,
 * supporting custom renderCell overrides and default formatting for the 7 Figma columns.
 */
export const EventOccurrencesTableCell: React.FC<
  EventOccurrencesTableCellProps
> = ({
  column,
  occurrence,
  event,
  childId,
  enrolledOccurrenceId,
  formattedDate,
  formattedTime,
  isFull,
  formatCapacityText,
  onEnrol,
  onCancelEnrolment,
  onSubscribe,
  onUnsubscribe,
  onVenueInfoClick,
}) => {
  const { t } = useTranslation();

  const actionButton = (
    <EventOccurrenceActionButton
      occurrence={occurrence}
      event={event}
      childId={childId}
      enrolledOccurrenceId={enrolledOccurrenceId}
      onEnrol={onEnrol}
      onCancelEnrolment={onCancelEnrolment}
      onSubscribe={onSubscribe}
      onUnsubscribe={onUnsubscribe}
    />
  );

  const cellContext: EventOccurrencesTableCellContext = {
    formattedDate,
    formattedTime,
    isFull,
    renderActionButton: () => actionButton,
  };

  const renderCellContent = (): React.ReactNode => {
    if (column.renderCell) {
      return column.renderCell(occurrence, cellContext);
    }

    switch (column.id) {
      case 'date':
        return formattedDate;

      case 'time':
        return formattedTime;

      case 'venueName': {
        const venueName = occurrence.venue?.name || '–';
        const showInfoIcon = venueHasDetailedInfo(occurrence.venue);

        return (
          <div className={styles.venueNameWrapper}>
            <span>{venueName}</span>
            {showInfoIcon && occurrence.venue && (
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
        );
      }

      case 'address':
        return occurrence.venue?.address || '–';

      case 'language': {
        if (!occurrence.occurrenceLanguage) return '–';
        return t(
          `common.language.${occurrence.occurrenceLanguage.toLowerCase()}`
        );
      }

      case 'capacity':
        if (isFull) {
          return (
            <span className={styles.fullBadge}>
              <IconAlertCircle
                aria-hidden="true"
                size={IconSize.ExtraSmall}
                className={styles.alertIcon}
              />
              <span>{t('event.occurrencesTable.fullBadge')}</span>
            </span>
          );
        }
        return formatCapacityText(occurrence.remainingCapacity);

      case 'action':
        return actionButton;
    }
  };

  return (
    <td className={column.cellClassName}>
      {renderCellContent()}
    </td>
  );
};

export default EventOccurrencesTableCell;
