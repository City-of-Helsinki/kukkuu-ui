import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { eventQuery_event_occurrences_edges_node as OccurrencesEdgeNode } from '../api/generatedTypes/eventQuery';
import { formatTime, newMoment } from '../../common/time/utils';
import styles from './eventOccurrence.module.scss';
import Button from '../../common/components/button/Button';
import {
  DEFAULT_TIME_FORMAT,
  DEFAULT_DATE_FORMAT,
} from '../../common/time/TimeConstants';
import EventOccurrenceNotificationControlButton from './EventOccurrenceNotificationControlButton';

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
  const submitCell = (
    <>
      {
        // TODO: KK-300 Make the back-button not confusing
      }

      {hasCapacity && (
        <Link
          className={styles.linkButton}
          to={`${occurrence.event.id}/occurrence/${occurrence.id}/enrol`}
        >
          <Button type="submit" className={styles.submitButton}>
            {t('event.register.occurrenceTableHeader.buttonText')}
          </Button>
        </Link>
      )}
      {!hasCapacity && (
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
    </>
  );

  return (
    <>
      <tr className={[styles.occurrence, styles.isMobile].join(' ')}>
        <td className={styles.occurrenceVenue}>
          {occurrence.venue.name}{' '}
          <time dateTime={machineReadableDateTime}>
            {date} {time}
          </time>
        </td>
        <td className={styles.remainingCapacity}>{remainingCapacity}</td>
        <td className={styles.occurrenceSubmit}>{submitCell}</td>
      </tr>
      <tr className={styles.occurrence}>
        <td className={styles.occurrenceDate}>{date}</td>
        <td className={styles.occurrenceTime}>{time}</td>
        <td className={styles.occurrenceVenue}>{occurrence.venue.name}</td>
        <td className={styles.remainingCapacity}>{remainingCapacity}</td>
        <td className={styles.occurrenceSubmit}>{submitCell}</td>
      </tr>
    </>
  );
};

export default EventOccurrence;
