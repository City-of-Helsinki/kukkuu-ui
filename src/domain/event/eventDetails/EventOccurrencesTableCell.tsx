import React from 'react';

import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from './EventOccurrencesTable';
import type {
  EventOccurrencesTableCellContext,
  EventOccurrencesTableColumn,
} from './eventOccurrencesTableColumns';
import { OccurrenceStatus } from './occurrenceStatus';
import { useOccurrenceFeatures } from '../hooks/useOccurrenceFeatures';
import { OccurrenceVenueLink } from './components/OccurrenceVenueLink';
import { OccurrenceSpecialIcons } from './components/OccurrenceSpecialIcons';
import { OccurrenceStatusBadge } from './components/OccurrenceStatusBadge';
import { EventOccurrenceActionButton } from './EventOccurrenceActionButton';
import styles from './eventOccurrencesTable.module.scss';

export type EventOccurrencesTableCellProps = {
  column: EventOccurrencesTableColumn;
  occurrence: EventOccurrencesTableOccurrence;
  event: EventOccurrencesTableEvent;
  childId: string;
  enrolledOccurrenceId?: string | null;
  formattedDate: string;
  formattedStartTime: string;
  formattedDateTime: string;
  status: OccurrenceStatus;
  formatCapacityText: (remaining: number | null | undefined) => string;
  onEnrol: (occurrence: EventOccurrencesTableOccurrence) => void;
  onCancelEnrolment?: (occurrence: EventOccurrencesTableOccurrence) => void;
  onSubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onUnsubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onVenueInfoClick?: (
    venue: NonNullable<EventOccurrencesTableOccurrence['venue']>
  ) => void;
};

/**
 * Renders a single `<td>` cell in the occurrences table according to the column definition,
 * delegating cell presentation cleanly to focused subcomponents.
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
  formattedStartTime,
  formattedDateTime,
  status,
  formatCapacityText,
  onEnrol,
  onCancelEnrolment,
  onSubscribe,
  onUnsubscribe,
  onVenueInfoClick,
}) => {
  const { languageText, accessibilities, isSpeechless } =
    useOccurrenceFeatures(occurrence);

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
    formattedStartTime,
    formattedDateTime,
    isFull: status === OccurrenceStatus.Full,
    status,
    renderActionButton: () => actionButton,
  };

  const renderCellContent = (): React.ReactNode => {
    if (column.renderCell) {
      return column.renderCell(occurrence, cellContext);
    }

    switch (column.id) {
      case 'dateTime':
        return formattedDateTime;

      case 'venueName':
        return (
          <OccurrenceVenueLink
            venue={occurrence.venue}
            onVenueInfoClick={onVenueInfoClick}
          />
        );

      case 'language':
        return languageText;

      case 'specialFeatures':
        return (
          <OccurrenceSpecialIcons
            accessibilities={accessibilities}
            speechless={isSpeechless}
          />
        );

      case 'capacity':
        if (
          status === OccurrenceStatus.Enrolled ||
          status === OccurrenceStatus.Full
        ) {
          return <OccurrenceStatusBadge status={status} />;
        }
        return formatCapacityText(occurrence.remainingCapacity);

      case 'action':
        return actionButton;
    }
  };

  return (
    <td className={column.cellClassName ?? styles.cell}>
      {renderCellContent()}
    </td>
  );
};

export default EventOccurrencesTableCell;
