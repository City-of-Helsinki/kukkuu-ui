import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { OccurrenceStatus } from '../occurrenceStatus';
import { OccurrenceStatusBadge } from './OccurrenceStatusBadge';
import { OccurrenceSpecialIcons } from './OccurrenceSpecialIcons';
import styles from './occurrenceAccordionHeading.module.scss';

export type OccurrenceAccordionHeadingProps = {
  formattedDate: string;
  formattedStartTime: string;
  status: OccurrenceStatus;
  remainingCapacity?: number | null;
  accessibilities?: string[] | null;
  speechless?: boolean;
  className?: string;
};

/**
 * 2-line header for the mobile occurrence accordion item:
 * - Line 1: Date and start time formatted string
 * - Line 2: Status badge or remaining spots text, accompanied inline by special feature icons
 */
export const OccurrenceAccordionHeading: React.FC<
  OccurrenceAccordionHeadingProps
> = ({
  formattedDate,
  formattedStartTime,
  status,
  remainingCapacity,
  accessibilities,
  speechless = false,
  className,
}) => {
  const { t } = useTranslation();
  const timeSeparator = t('common.dateTimeSeparator');

  return (
    <span className={classNames(styles.headingContainer, className)}>
      <span className={styles.dateTimeLine}>
        {formattedDate} • {timeSeparator} {formattedStartTime}
      </span>

      <span className={styles.statusLine}>
        {status === OccurrenceStatus.Enrolled ||
        status === OccurrenceStatus.Full ? (
          <OccurrenceStatusBadge status={status} />
        ) : typeof remainingCapacity === 'number' ? (
          <span className={styles.spotsText}>
            {t('event.occurrencesTable.remainingSpotsLabel', {
              count: remainingCapacity,
            })}
          </span>
        ) : null}

        <OccurrenceSpecialIcons
          accessibilities={accessibilities}
          speechless={speechless}
          interactive={false}
        />
      </span>
    </span>
  );
};

export default OccurrenceAccordionHeading;
