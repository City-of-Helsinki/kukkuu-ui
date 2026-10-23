import React from 'react';
import type { TFunction } from 'i18next';

import type { EventOccurrencesTableOccurrence } from './EventOccurrencesTable';
import styles from './eventOccurrencesTable.module.scss';

export type EventOccurrencesColumnId = 'date' | 'time' | 'capacity' | 'action';

/**
 * Context provided to column render callbacks in {@link EventOccurrencesTableRow}.
 */
export type EventOccurrencesTableCellContext = {
  formattedDate: string;
  formattedTime: string;
  isFull: boolean;
  renderActionButton: () => React.ReactNode;
};

/**
 * Column definition for {@link EventOccurrencesTable}.
 * Drives both `<th>` in `<thead>` and `<td>` in `<tbody>` rows, ensuring column count always matches.
 */
export type EventOccurrencesTableColumn = {
  id: EventOccurrencesColumnId;
  header: React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  renderCell?: (
    occurrence: EventOccurrencesTableOccurrence,
    context: EventOccurrencesTableCellContext
  ) => React.ReactNode;
};

/**
 * Returns default column configurations for the occurrences table.
 */
export const getEventOccurrencesTableColumns = (
  t: TFunction
): EventOccurrencesTableColumn[] => [
  {
    id: 'date',
    header: t('event.occurrencesTable.date'),
    cellClassName: styles.dateCell,
  },
  {
    id: 'time',
    header: t('event.occurrencesTable.time'),
    cellClassName: styles.timeCell,
  },
  {
    id: 'capacity',
    header: t('event.occurrencesTable.remainingCapacity'),
  },
  {
    id: 'action',
    header: (
      <span className="visually-hidden">
        {t('event.occurrencesTable.action')}
      </span>
    ),
    cellClassName: styles.actionCell,
  },
];
