import React from 'react';

import type { EventOccurrencesTableColumn } from './eventOccurrencesTableColumns';
import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from './EventOccurrencesTable';
import { EventOccurrencesTableRow } from './EventOccurrencesTableRow';
import styles from './eventOccurrencesTable.module.scss';

export type EventOccurrencesDesktopTableProps = {
  columns: EventOccurrencesTableColumn[];
  occurrences: EventOccurrencesTableOccurrence[];
  event: EventOccurrencesTableEvent;
  childId: string;
  enrolledOccurrenceId?: string | null;
  formatCapacityText: (remainingCapacity?: number | null) => string;
  onEnrol: (occurrence: EventOccurrencesTableOccurrence) => void;
  onCancelEnrolment?: (occurrence: EventOccurrencesTableOccurrence) => void;
  onSubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onUnsubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onVenueInfoClick?: (
    venue: NonNullable<EventOccurrencesTableOccurrence['venue']>
  ) => void;
};

/**
 * Desktop table rendering occurrence rows with 7 columns matching the Figma design.
 */
export const EventOccurrencesDesktopTable: React.FC<
  EventOccurrencesDesktopTableProps
> = ({
  columns,
  occurrences,
  event,
  childId,
  enrolledOccurrenceId,
  formatCapacityText,
  onEnrol,
  onCancelEnrolment,
  onSubscribe,
  onUnsubscribe,
  onVenueInfoClick,
}) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={column.headerClassName}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {occurrences.map((occurrence) => (
            <EventOccurrencesTableRow
              key={occurrence.id}
              columns={columns}
              occurrence={occurrence}
              event={event}
              childId={childId}
              enrolledOccurrenceId={enrolledOccurrenceId}
              formatCapacityText={formatCapacityText}
              onEnrol={onEnrol}
              onCancelEnrolment={onCancelEnrolment}
              onSubscribe={onSubscribe}
              onUnsubscribe={onUnsubscribe}
              onVenueInfoClick={onVenueInfoClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventOccurrencesDesktopTable;
