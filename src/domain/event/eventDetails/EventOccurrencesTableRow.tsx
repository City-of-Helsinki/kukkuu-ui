import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DEFAULT_TIME_FORMAT } from '../../../common/time/TimeConstants';
import { formatOccurrenceDateLong } from '../../../common/time/occurrenceTime';
import { formatTime, newDate } from '../../../common/time/utils';
import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from './EventOccurrencesTable';
import {
  type EventOccurrencesTableColumn,
  getEventOccurrencesTableColumns,
} from './eventOccurrencesTableColumns';
import { EventOccurrencesTableCell } from './EventOccurrencesTableCell';
import { getOccurrenceStatus } from './occurrenceStatus';
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
  onVenueInfoClick?: (
    venue: NonNullable<EventOccurrencesTableOccurrence['venue']>
  ) => void;
};

/**
 * Renders a single row in the occurrences table.
 * Coordinates rendering cells via {@link EventOccurrencesTableCell}.
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
  const formattedStartTime = formatTime(
    newDate(occurrence.time),
    DEFAULT_TIME_FORMAT
  );
  const timeSeparator = t('common.dateTimeSeparator');
  const formattedDateTime = `${formattedDate} ${timeSeparator} ${formattedStartTime}`;

  const isEnrolledHere = enrolledOccurrenceId === occurrence.id;
  const status = getOccurrenceStatus({
    remainingCapacity: occurrence.remainingCapacity,
    isEnrolledHere,
  });

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
          formattedStartTime={formattedStartTime}
          formattedDateTime={formattedDateTime}
          status={status}
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
