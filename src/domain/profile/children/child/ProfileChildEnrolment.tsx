import * as React from 'react';
import { Link } from 'react-router-dom';
import { IconCalendar, IconClock, IconLocation } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { formatTime, newMoment } from '../../../../common/time/utils';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from '../../../../common/time/TimeConstants';
import styles from './profileChildEnrolment.module.scss';
import { MyProfileEnrolment } from '../../types/ProfileQueryTypes';

type EnrolmentProps = {
  enrolment: MyProfileEnrolment;
  childId: string;
};

export default function Enrolment({ enrolment, childId }: EnrolmentProps) {
  const {
    i18n: { language },
  } = useTranslation();

  const date = formatTime(
    newMoment(enrolment.occurrence.time),
    DEFAULT_DATE_FORMAT
  );
  const startTime = formatTime(
    newMoment(enrolment.occurrence.time),
    DEFAULT_TIME_FORMAT
  );
  const endTime = formatTime(
    newMoment(enrolment.occurrence.time).add(
      enrolment.occurrence.event.duration,
      'minutes'
    ),
    DEFAULT_TIME_FORMAT
  );
  const occurrencePath =
    '/:lang/profile/child/:childId/occurrence/:occurrenceId'
      .replace(':lang', language)
      .replace(':childId', childId)
      .replace(':occurrenceId', enrolment.occurrence.id);

  return (
    <div className={styles.container}>
      <Link
        to={occurrencePath}
        className={styles.occurrenceLink}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
        }}
      >
        {enrolment.occurrence.event.name}
      </Link>
      <ul className={styles.details}>
        <li className={styles.detail}>
          <IconCalendar /> {date}
        </li>
        <li className={styles.detail}>
          <IconClock /> {startTime}-{endTime}
        </li>
        <li className={styles.detail}>
          <IconLocation /> {enrolment.occurrence.venue.name}
        </li>
      </ul>
    </div>
  );
}
