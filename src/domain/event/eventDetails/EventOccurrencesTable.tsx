import React from 'react';
import { useTranslation } from 'react-i18next';

import { sortOccurrencesByTime } from '../EventUtils';
import { useOccurrenceCapacityText } from '../hooks/useOccurrenceCapacityText';
import { EnrolmentDeniedReason, TicketSystem } from '../../api/generatedTypes/graphql';
import {
  type EventOccurrencesTableColumn,
  getEventOccurrencesTableColumns,
} from './eventOccurrencesTableColumns';
import { EventOccurrencesTableRow } from './EventOccurrencesTableRow';
import styles from './eventOccurrencesTable.module.scss';

export type EventOccurrencesTableOccurrence = {
  id: string;
  time: string;
  remainingCapacity?: number | null;
  occurrenceLanguage?: string | null;
  childHasFreeSpotNotificationSubscription?: boolean | null;
  venue?: {
    id?: string;
    name?: string | null;
    address?: string | null;
  } | null;
  ticketSystem?: {
    type?: TicketSystem | string | null;
    url?: string | null;
  } | null;
};

export type EventOccurrencesTableEvent = {
  id: string;
  name?: string | null;
  duration?: number | null;
  capacityPerOccurrence?: number | null;
  enrolmentDeniedReason?: EnrolmentDeniedReason | null;
  registrationOpensAt?: string | null;
  ticketSystem?: {
    type?: TicketSystem | string | null;
    url?: string | null;
  } | null;
};

export type {
  EventOccurrencesColumnId,
  EventOccurrencesTableCellContext,
  EventOccurrencesTableColumn,
} from './eventOccurrencesTableColumns';

export type EventOccurrencesTableProps = {
  event: EventOccurrencesTableEvent;
  occurrences: EventOccurrencesTableOccurrence[];
  childId: string;
  enrolledOccurrenceId?: string | null;
  columns?: EventOccurrencesTableColumn[];
  onEnrol: (occurrence: EventOccurrencesTableOccurrence) => void;
  onCancelEnrolment?: (occurrence: EventOccurrencesTableOccurrence) => void;
  onSubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
  onUnsubscribe: (occurrence: EventOccurrencesTableOccurrence) => void;
};

export type EventOccurrencesTableComponent = React.FC<
  EventOccurrencesTableProps
> & {
  Row: typeof EventOccurrencesTableRow;
};

/**
 * Displays available occurrences in a table with date, time, remaining spots,
 * and registration/subscription action buttons.
 *
 * Employs a compound component pattern (`EventOccurrencesTable.Row`) coupled with
 * a column-definition schema to strictly synchronize `<th>` headers with `<td>` cells.
 */
export const EventOccurrencesTable: EventOccurrencesTableComponent = ({
  event,
  occurrences,
  childId,
  enrolledOccurrenceId,
  columns: columnsProp,
  onEnrol,
  onCancelEnrolment,
  onSubscribe,
  onUnsubscribe,
}) => {
  const { t } = useTranslation();

  const sortedOccurrences = React.useMemo(() => {
    return sortOccurrencesByTime(occurrences);
  }, [occurrences]);

  const columns = React.useMemo(
    () => columnsProp ?? getEventOccurrencesTableColumns(t),
    [columnsProp, t]
  );

  const formatCapacityText = useOccurrenceCapacityText(
    event.capacityPerOccurrence
  );

  if (sortedOccurrences.length === 0) {
    return (
      <p className={styles.noOccurrences}>
        {t('event.occurrencesTable.noOccurrences')}
      </p>
    );
  }

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
          {sortedOccurrences.map((occ) => (
            <EventOccurrencesTable.Row
              key={occ.id}
              columns={columns}
              occurrence={occ}
              event={event}
              childId={childId}
              enrolledOccurrenceId={enrolledOccurrenceId}
              formatCapacityText={formatCapacityText}
              onEnrol={onEnrol}
              onCancelEnrolment={onCancelEnrolment}
              onSubscribe={onSubscribe}
              onUnsubscribe={onUnsubscribe}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

EventOccurrencesTable.Row = EventOccurrencesTableRow;

export { EventOccurrencesTableRow };
export default EventOccurrencesTable;
