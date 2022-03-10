import { FunctionComponent } from 'react';

import styles from './occurrenceInfo.module.scss';
import Icon from '../../../common/components/icon/Icon';

type Props = {
  className?: string;
  iconSrc: string;
  iconAlt?: string;
  label?: string;
  description?: string;
  fullWidth?: boolean;
};

const InfoItem: FunctionComponent<Props> = ({
  className,
  iconSrc,
  iconAlt = '',
  label = '',
  description = '',
  fullWidth = false,
}) => {
  return (
    <div className={fullWidth ? styles.fullWidth : ''}>
      <div className={className}>
        <Icon alt={iconAlt} className={styles.labelIcon} src={iconSrc} />
        <div>
          <span className={styles.label}>{label}</span>
          {description && (
            <small className={styles.description}>{description}</small>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoItem;
