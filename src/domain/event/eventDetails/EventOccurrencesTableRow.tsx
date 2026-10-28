import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  formatOccurrenceDateLong,
  formatOccurrenceTimeRange,
} from '../../../common/time/occurrenceTime';
import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from './EventOccurrencesTable';
import {
  type EventOccurrencesTableColumn,
  getEventOccurrencesTableColumns,
} from './eventOccurrencesTableColumns';
import { EventOccurrencesTableCell } from './EventOccurrencesTableCell';
import styles from './eventOccurrencesTable.module.scss';

export type {
  EventOccurrencesTableCellContext,
  EventOccurrencesColumnId,
} from './eventOccurrencesTableColumns';

/**
 * Props for {@link EventOccurrencesTableRow}.
 */
export type EventOccurrencesTableRowProps = {
  occurrence: EventOccurrencesTableOccurrence;
  event: EventOccurrencesTableEvent;
  childId: string;
  enrolledOccurrenceId?: string | null;
  columns?: EventOccurrencesTableColumn[];
  formatCapacityText: (remaining: number | null | undefined) => string;
  onEnrol: (occurrence: EventOccurrencesTableOccurrence) => void;
  onCancelEnrolment?: (occurrence: EventOccurrencesTableOccurrence) => void;
  onSubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onUnsubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onVenueInfoClick?: (venue: NonNullable<EventOccurrencesTableOccurrence['venue']>) => void;
};

/**
 * Renders a single row in the occurrences table.
 *
 * Implemented as a compound child component of {@link EventOccurrencesTable} (`EventOccurrencesTable.Row`).
 * Coordinates rendering cells via {@link EventOccurrencesTableCell} to guarantee `<td>` cells
 * always strictly match `<th>` headers.
 */
export const EventOccurrencesTableRow: React.FC<
  EventOccurrencesTableRowProps
> = ({
  occurrence,
  event,
  childId,
  enrolledOccurrenceId,
  columns: columnsProp,
  formatCapacityText,
  onEnrol,
  onCancelEnrolment,
  onSubscribe,
  onUnsubscribe,
  onVenueInfoClick,
}) => {
  const { t, i18n } = useTranslation();

  const columns = useMemo(
    () => columnsProp ?? getEventOccurrencesTableColumns(t),
    [columnsProp, t]
  );

  const formattedDate = formatOccurrenceDateLong(
    occurrence.time,
    i18n.language
  );
  const formattedTime = formatOccurrenceTimeRange(
    occurrence.time,
    event.duration
  );
  const isFull = occurrence.remainingCapacity === 0;

  return (
    <tr className={styles.bodyRow}>
      {columns.map((column) => (
        <EventOccurrencesTableCell
          key={column.id}
          column={column}
          occurrence={occurrence}
          event={event}
          childId={childId}
          enrolledOccurrenceId={enrolledOccurrenceId}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          isFull={isFull}
          formatCapacityText={formatCapacityText}
          onEnrol={onEnrol}
          onCancelEnrolment={onCancelEnrolment}
          onSubscribe={onSubscribe}
          onUnsubscribe={onUnsubscribe}
          onVenueInfoClick={onVenueInfoClick}
        />
      ))}
    </tr>
  );
};

export default EventOccurrencesTableRow;
