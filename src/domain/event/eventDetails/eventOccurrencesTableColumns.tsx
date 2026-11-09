import React from 'react';
import type { TFunction } from 'i18next';

import type { EventOccurrencesTableOccurrence } from './EventOccurrencesTable';
import type { OccurrenceStatus } from './occurrenceStatus';
import styles from './eventOccurrencesTable.module.scss';

export type EventOccurrencesColumnId =
  | 'dateTime'
  | 'venueName'
  | 'language'
  | 'specialFeatures'
  | 'capacity'
  | 'action';

/**
 * Context provided to column render callbacks in {@link EventOccurrencesTableRow}.
 */
export type EventOccurrencesTableCellContext = {
  formattedDate: string;
  formattedStartTime: string;
  formattedDateTime: string;
  isFull: boolean;
  status: OccurrenceStatus;
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
 * Returns default column configurations for the occurrences table matching the 6 redesigned columns:
 * Date & time, Venue name, Languages, Special features, Remaining capacity, and Action.
 */
export const getEventOccurrencesTableColumns = (
  t: TFunction
): EventOccurrencesTableColumn[] => [
  {
    id: 'dateTime',
    header: t('event.occurrencesTable.dateTime'),
    cellClassName: styles.dateTimeCell,
  },
  {
    id: 'venueName',
    header: t('event.occurrencesTable.venueName'),
    cellClassName: styles.venueCell,
  },
  {
    id: 'language',
    header: t('event.occurrencesTable.languages'),
    cellClassName: styles.languageCell,
  },
  {
    id: 'specialFeatures',
    header: (
      <span className="visually-hidden">
        {t('event.occurrencesTable.specialFeatures')}
      </span>
    ),
    cellClassName: styles.specialFeaturesCell,
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
