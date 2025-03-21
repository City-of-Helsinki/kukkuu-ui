import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { TicketSystem } from '../api/generatedTypes/graphql';
import { formatTime, newDate } from '../../common/time/utils';
import LinkButton from '../../common/components/button/LinkButton';
import {
  DEFAULT_TIME_FORMAT,
  DEFAULT_DATE_FORMAT,
} from '../../common/time/TimeConstants';
import EventOccurrenceNotificationControlButton from './EventOccurrenceNotificationControlButton';
import styles from './eventOccurrence.module.scss';
import { OccurrenceNode } from './types/EventQueryTypes';
import { externalTicketSystems } from './constants/ExternalTicketSystemConstants';

const SubmitTypes = {
  enrol: 'ENROL',
  notification: 'NOTIFICATION',
  externalTicketSystem: 'EXTERNAL_TICKET_SYSTEM',
} as const;

type SubmitType = (typeof SubmitTypes)[keyof typeof SubmitTypes];

function getSubmitType(
  isExternalTicketSystem: boolean,
  hasCapacity: boolean
): SubmitType {
  if (isExternalTicketSystem) {
    return SubmitTypes.externalTicketSystem;
  }

  if (hasCapacity) {
    return SubmitTypes.enrol;
  }

  return SubmitTypes.notification;
}

type UrlParams = {
  childId: string;
  eventId: string;
};

type EventOccurrenceProps = {
  occurrence: OccurrenceNode;
  showFreePlaces?: boolean;
  canEnroll?: boolean | null;
};

const EventOccurrence = ({
  occurrence,
  showFreePlaces = true,
  canEnroll = true,
}: EventOccurrenceProps) => {
  const { t } = useTranslation();
  const { childId, eventId } = useParams<UrlParams>();

  const date = formatTime(
    newDate(occurrence.time),
    `iiiiii ${DEFAULT_DATE_FORMAT}`
  );
  const time = formatTime(newDate(occurrence.time), DEFAULT_TIME_FORMAT);
  const machineReadableDate = formatTime(newDate(occurrence.time));
  const machineReadableTime = formatTime(
    newDate(occurrence.time),
    'HH:mm:ss.SSS'
  );
  const machineReadableDateTime = `${machineReadableDate} ${machineReadableTime}`;

  const hasCapacity = Boolean(
    occurrence.remainingCapacity && occurrence.remainingCapacity > 0
  );
  const childHasSubscription = Boolean(
    occurrence.childHasFreeSpotNotificationSubscription
  );
  const remainingCapacity = hasCapacity
    ? occurrence?.remainingCapacity
    : t('event.register.occurrenceTableBody.full');
  const eventUrl = `${occurrence.event.id}/redirect`;
  const occurrenceUrl = `occurrence/${occurrence.id}/enrol`;
  const isExternalTicketSystem = externalTicketSystems.includes(
    occurrence?.ticketSystem?.type as TicketSystem
  );
  const submitType = getSubmitType(isExternalTicketSystem, hasCapacity);
  const submitCell = (
    <>
      {submitType === SubmitTypes.enrol && (
        <LinkButton to={occurrenceUrl}>
          {t('event.register.occurrenceTableHeader.buttonText')}
        </LinkButton>
      )}
      {submitType === SubmitTypes.notification && (
        <EventOccurrenceNotificationControlButton
          childId={childId ?? ''}
          eventId={eventId ?? ''}
          isSubscribed={childHasSubscription}
          occurrence={occurrence}
          unsubscribeLabel={t(
            'enrollment.button.cancelNotificationSubscription'
          )}
          subscribeLabel={t('enrollment.button.subscribeToNotifications')}
        />
      )}
      {submitType === SubmitTypes.externalTicketSystem && (
        <LinkButton to={eventUrl}>
          {t('event.register.occurrenceTableHeader.buttonText')}
        </LinkButton>
      )}
    </>
  );

  return (
    <>
      <tr className={[styles.occurrence, styles.isMobile].join(' ')}>
        <td>
          {occurrence.venue.name}{' '}
          <time dateTime={machineReadableDateTime}>
            {date} {time}
          </time>
        </td>
        {showFreePlaces && (
          <td className={styles.remainingCapacity}>{remainingCapacity}</td>
        )}
        <td className={styles.occurrenceSubmit}>
          {canEnroll ? submitCell : null}
        </td>
      </tr>
      <tr className={styles.occurrence}>
        <td>{date}</td>
        <td>{time}</td>
        <td>{occurrence.venue.name}</td>
        {showFreePlaces && (
          <td className={styles.remainingCapacity}>{remainingCapacity}</td>
        )}
        <td className={styles.occurrenceSubmit}>
          {canEnroll ? submitCell : null}
        </td>
      </tr>
    </>
  );
};

export default EventOccurrence;
