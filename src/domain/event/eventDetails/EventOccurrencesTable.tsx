import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQueryLessThan } from 'hds-react';

import { sortOccurrencesByTime } from '../EventUtils';
import { useOccurrenceCapacityText } from '../hooks/useOccurrenceCapacityText';
import {
  EnrolmentDeniedReason,
  TicketSystem,
} from '../../api/generatedTypes/graphql';
import {
  type EventOccurrencesTableColumn,
  getEventOccurrencesTableColumns,
} from './eventOccurrencesTableColumns';
import { EventOccurrencesDesktopTable } from './EventOccurrencesDesktopTable';
import { EventOccurrencesTableRow } from './EventOccurrencesTableRow';
import { EventOccurrencesTableCell } from './EventOccurrencesTableCell';
import { EventOccurrenceActionButton } from './EventOccurrenceActionButton';
import { EventOccurrencesAccordion } from './EventOccurrencesAccordion';
import { EventOccurrenceAccordionItem } from './EventOccurrenceAccordionItem';
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
    description?: string | null;
    accessibilityInfo?: string | null;
    arrivalInstructions?: string | null;
    wcAndFacilities?: string | null;
    wwwUrl?: string | null;
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
  onVenueInfoClick?: (
    venue: NonNullable<EventOccurrencesTableOccurrence['venue']>
  ) => void;
};

export type EventOccurrencesTableComponent =
  React.FC<EventOccurrencesTableProps> & {
    DesktopTable: typeof EventOccurrencesDesktopTable;
    Row: typeof EventOccurrencesTableRow;
    Cell: typeof EventOccurrencesTableCell;
    ActionButton: typeof EventOccurrenceActionButton;
    Accordion: typeof EventOccurrencesAccordion;
    AccordionItem: typeof EventOccurrenceAccordionItem;
  };

/**
 * Displays available occurrences in a table with date, time, remaining spots,
 * and registration/subscription action buttons.
 *
 * Responsively renders an HDS Accordion list on mobile and tablet screens (< 992px)
 * and a 7-column data table on desktop screens.
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
  onVenueInfoClick,
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQueryLessThan('l');

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

  if (isMobile) {
    return (
      <EventOccurrencesAccordion
        event={event}
        occurrences={sortedOccurrences}
        childId={childId}
        enrolledOccurrenceId={enrolledOccurrenceId}
        onEnrol={onEnrol}
        onCancelEnrolment={onCancelEnrolment}
        onSubscribe={onSubscribe}
        onUnsubscribe={onUnsubscribe}
        onVenueInfoClick={onVenueInfoClick}
      />
    );
  }

  return (
    <EventOccurrencesDesktopTable
      columns={columns}
      occurrences={sortedOccurrences}
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
  );
};

EventOccurrencesTable.DesktopTable = EventOccurrencesDesktopTable;
EventOccurrencesTable.Row = EventOccurrencesTableRow;
EventOccurrencesTable.Cell = EventOccurrencesTableCell;
EventOccurrencesTable.ActionButton = EventOccurrenceActionButton;
EventOccurrencesTable.Accordion = EventOccurrencesAccordion;
EventOccurrencesTable.AccordionItem = EventOccurrenceAccordionItem;

export {
  EventOccurrencesDesktopTable,
  EventOccurrencesTableRow,
  EventOccurrencesTableCell,
  EventOccurrenceActionButton,
  EventOccurrencesAccordion,
  EventOccurrenceAccordionItem,
};
export default EventOccurrencesTable;
