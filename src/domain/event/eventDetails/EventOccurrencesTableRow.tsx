import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { IconAlertCircle, IconSize, IconTrash } from 'hds-react';

import Button from '../../../common/components/button/Button';
import LinkButton from '../../../common/components/button/LinkButton';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import {
  formatOccurrenceDateLong,
  formatOccurrenceTimeRange,
} from '../../../common/time/occurrenceTime';
import { TicketSystem } from '../../api/generatedTypes/graphql';
import { externalTicketSystems } from '../constants/ExternalTicketSystemConstants';
import type {
  EventOccurrencesTableEvent,
  EventOccurrencesTableOccurrence,
} from './EventOccurrencesTable';
import {
  type EventOccurrencesColumnId,
  type EventOccurrencesTableCellContext,
  type EventOccurrencesTableColumn,
  getEventOccurrencesTableColumns,
} from './eventOccurrencesTableColumns';
import styles from './eventOccurrencesTable.module.scss';

export type { EventOccurrencesTableCellContext };

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
};

/**
 * Renders a single row in the occurrences table.
 *
 * Implemented as a compound child component of {@link EventOccurrencesTable} (`EventOccurrencesTable.Row`).
 * Dynamically iterates over the synchronized `columns` configuration to ensure that
 * the number and order of `<td>` cells always corresponds to the table `<th>` headers.
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
}) => {
  const { t, i18n } = useTranslation();
  const getPathname = useGetPathname();

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
  const hasSpots = !isFull;
  const ticketSystemType =
    event.ticketSystem?.type ?? occurrence.ticketSystem?.type;
  const isExternal = externalTicketSystems.includes(
    ticketSystemType as TicketSystem
  );
  const isSubscribed = Boolean(
    occurrence.childHasFreeSpotNotificationSubscription
  );
  const isEnrolledInThisOcc = enrolledOccurrenceId === occurrence.id;
  const isEnrolledInOtherOcc = Boolean(
    enrolledOccurrenceId && enrolledOccurrenceId !== occurrence.id
  );
  const canEnroll = Boolean(event.canChildEnroll);
  const redirectUrl = getPathname(
    `/profile/child/${childId}/event/${event.id}/redirect`
  );

  const renderActionButton = (): React.ReactNode => {
    if (isEnrolledInThisOcc) {
      return (
        <Button
          variant="danger"
          iconStart={<IconTrash aria-hidden="true" />}
          onClick={() => onCancelEnrolment?.(occurrence)}
          className={classNames(styles.actionButton, styles.cancelButton)}
        >
          {t('event.occurrencesTable.cancelButton', 'Peruuta')}
        </Button>
      );
    }

    if (isEnrolledInOtherOcc) {
      return (
        <Button
          variant="disabled"
          disabled
          aria-disabled="true"
          className={classNames(styles.actionButton, styles.disabledButton)}
          aria-label={t(
            'event.occurrencesTable.alreadyEnrolledOther',
            'Ilmoittautunut toiseen aikaan'
          )}
          title={t(
            'event.occurrencesTable.alreadyEnrolledOther',
            'Ilmoittautunut toiseen aikaan'
          )}
        >
          {t('event.occurrencesTable.enrolButton')}
        </Button>
      );
    }

    if (!canEnroll) {
      return (
        <Button
          variant="disabled"
          disabled
          aria-disabled="true"
          className={classNames(styles.actionButton, styles.disabledButton)}
        >
          {t('event.occurrencesTable.enrolButton')}
        </Button>
      );
    }

    if (isExternal) {
      return (
        <LinkButton
          to={redirectUrl}
          className={classNames(styles.actionButton, styles.enrolButton)}
        >
          {t('event.occurrencesTable.enrolButton')}
        </LinkButton>
      );
    }

    if (hasSpots) {
      return (
        <Button
          variant="primary"
          onClick={() => onEnrol(occurrence)}
          className={classNames(styles.actionButton, styles.enrolButton)}
        >
          {t('event.occurrencesTable.enrolButton')}
        </Button>
      );
    }

    if (isSubscribed) {
      return (
        <Button
          variant="secondary"
          onClick={() => onUnsubscribe(occurrence)}
          className={classNames(styles.actionButton, styles.unsubscribeButton)}
        >
          {t('event.occurrencesTable.cancelNotificationSubscription')}
        </Button>
      );
    }

    return (
      <Button
        variant="secondary"
        onClick={() => onSubscribe(occurrence)}
        className={classNames(styles.actionButton, styles.subscribeButton)}
      >
        {t('event.occurrencesTable.subscribeNotificationButton')}
      </Button>
    );
  };

  const renderDefaultCell = (
    columnId: EventOccurrencesColumnId
  ): React.ReactNode => {
    switch (columnId) {
      case 'date':
        return formattedDate;
      case 'time':
        return formattedTime;
      case 'capacity':
        return (
          <div className={styles.capacityCell}>
            <span>{formatCapacityText(occurrence.remainingCapacity)}</span>
            {isFull && (
              <span className={styles.fullBadge}>
                <IconAlertCircle
                  aria-hidden="true"
                  size={IconSize.ExtraSmall}
                  className={styles.alertIcon}
                />
                <span>{t('event.occurrencesTable.full')}</span>
              </span>
            )}
          </div>
        );
      case 'action':
        return renderActionButton();
    }
  };

  const cellContext: EventOccurrencesTableCellContext = {
    formattedDate,
    formattedTime,
    isFull,
    renderActionButton,
  };

  return (
    <tr
      className={styles.bodyRow}
      data-testid={`occurrence-row-${occurrence.id}`}
    >
      {columns.map((column) => (
        <td key={column.id} className={column.cellClassName}>
          {column.renderCell
            ? column.renderCell(occurrence, cellContext)
            : renderDefaultCell(column.id)}
        </td>
      ))}
    </tr>
  );
};
