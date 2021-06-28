import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';

import { eventQuery_event_occurrences_edges_node as OccurrencesEdgeNode } from '../api/generatedTypes/eventQuery';
import { formatTime, newMoment } from '../../common/time/utils';
import styles from './eventOccurrence.module.scss';
import Button from '../../common/components/button/Button';
import {
  DEFAULT_TIME_FORMAT,
  DEFAULT_DATE_FORMAT,
} from '../../common/time/TimeConstants';
import EventOccurrenceNotificationControlButton from './EventOccurrenceNotificationControlButton';

const SubmitTypes = {
  enrol: 'ENROL',
  notification: 'NOTIFICATION',
  ticketmaster: 'TICKETMASTER',
} as const;

type SubmitType = typeof SubmitTypes[keyof typeof SubmitTypes];

function getSubmitType(
  isTicketmaster: boolean,
  hasCapacity: boolean
): SubmitType {
  if (isTicketmaster) {
    return SubmitTypes.ticketmaster;
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
  occurrence: OccurrencesEdgeNode;
};

const EventOccurrence = ({ occurrence }: EventOccurrenceProps) => {
  const { t } = useTranslation();
  const { childId, eventId } = useParams<UrlParams>();
  const location = useLocation();

  const date = formatTime(
    newMoment(occurrence.time),
    `ddd ${DEFAULT_DATE_FORMAT}`
  );
  const time = formatTime(newMoment(occurrence.time), DEFAULT_TIME_FORMAT);
  const machineReadableDate = formatTime(newMoment(occurrence.time));
  const machineReadableTime = formatTime(
    newMoment(occurrence.time),
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
  const isTicketmaster = Boolean(
    new URLSearchParams(location.search).get('isTicketmaster')
  );
  const ticketmasterLink = 'https://ticketmaster.fi';
  const submitType = getSubmitType(isTicketmaster, hasCapacity);
  const submitCell = (
    <>
      {submitType === SubmitTypes.enrol && (
        <Link
          className={styles.linkButton}
          to={`${occurrence.event.id}/occurrence/${occurrence.id}/enrol`}
        >
          <Button type="submit" className={styles.submitButton}>
            {t('event.register.occurrenceTableHeader.buttonText')}
          </Button>
        </Link>
      )}
      {submitType === SubmitTypes.notification && (
        <EventOccurrenceNotificationControlButton
          childId={childId}
          eventId={eventId}
          isSubscribed={childHasSubscription}
          occurrence={occurrence}
          unsubscribeLabel={t(
            'enrollment.button.cancelNotificationSubscription'
          )}
          subscribeLabel={t('enrollment.button.subscribeToNotifications')}
        />
      )}
      {submitType === SubmitTypes.ticketmaster && (
        <a className={styles.linkButton} href={ticketmasterLink}>
          <Button type="button" className={styles.submitButton}>
            {t('event.register.occurrenceTableHeader.buttonContinueText')}
          </Button>
        </a>
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
        <td className={styles.remainingCapacity}>{remainingCapacity}</td>
        <td className={styles.occurrenceSubmit}>{submitCell}</td>
      </tr>
      <tr className={styles.occurrence}>
        <td>{date}</td>
        <td>{time}</td>
        <td>{occurrence.venue.name}</td>
        <td className={styles.remainingCapacity}>{remainingCapacity}</td>
        <td className={styles.occurrenceSubmit}>{submitCell}</td>
      </tr>
    </>
  );
};

export default EventOccurrence;
