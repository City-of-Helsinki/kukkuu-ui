import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { getDateBadgeParts } from '../../time/occurrenceTime';
import styles from './occurrenceDateBadge.module.scss';

export type OccurrenceDateBadgeProps = {
  time: string | Date;
  className?: string;
};

export const OccurrenceDateBadge: React.FC<OccurrenceDateBadgeProps> = ({
  time,
  className,
}) => {
  const { i18n } = useTranslation();
  const { weekday, day, month } = getDateBadgeParts(time, i18n.language);

  return (
    <div
      className={classNames(styles.dateBadge, className)}
      aria-label={`${weekday} ${day} ${month}`}
    >
      <span className={styles.weekday}>{weekday}</span>
      <span className={styles.day}>{day}</span>
      <span className={styles.month}>{month}</span>
    </div>
  );
};

export default OccurrenceDateBadge;
