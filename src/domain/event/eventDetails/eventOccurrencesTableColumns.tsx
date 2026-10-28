import React from 'react';
import type { TFunction } from 'i18next';

import type { EventOccurrencesTableOccurrence } from './EventOccurrencesTable';
import styles from './eventOccurrencesTable.module.scss';

export type EventOccurrencesColumnId =
  | 'date'
  | 'time'
  | 'venueName'
  | 'address'
  | 'language'
  | 'capacity'
  | 'action';

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
 * Returns default column configurations for the occurrences table matching the 7 Figma columns:
 * Date, Time, Venue Name, Address, Language, Remaining spots, and Action.
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
    id: 'venueName',
    header: t('event.occurrencesTable.venueName'),
    cellClassName: styles.venueCell,
  },
  {
    id: 'address',
    header: t('event.occurrencesTable.address'),
    cellClassName: styles.addressCell,
  },
  {
    id: 'language',
    header: t('event.occurrencesTable.languages'),
    cellClassName: styles.languageCell,
  },
  {
    id: 'capacity',
    header: t('event.occurrencesTable.remainingCapacity'),
    cellClassName: styles.capacityColumnCell,
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
