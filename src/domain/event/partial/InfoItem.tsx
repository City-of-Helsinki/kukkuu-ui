import React, { FunctionComponent } from 'react';

import styles from './occurrenceInfo.module.scss';
import Icon from '../../../common/components/icon/Icon';

type Props = {
  className?: string;
  iconSrc: string;
  iconAlt?: string;
  label?: string | undefined;
};

const InfoItem: FunctionComponent<Props> = ({
  className,
  iconSrc,
  iconAlt = '',
  label = '',
}) => {
  return (
    <div className={className}>
      <Icon alt={iconAlt} className={styles.labelIcon} src={iconSrc} />
      <div className={styles.label}>{label}</div>
    </div>
  );
};

export default InfoItem;
