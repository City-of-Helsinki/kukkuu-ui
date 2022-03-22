import classNames from 'classnames';
import { FunctionComponent } from 'react';

import Text from '../../../common/components/text/Text';
import styles from './occurrenceInfo.module.scss';

export type InfoItemProps = {
  id: string;
  className?: string;
  icon: JSX.Element;
  label: string;
  description?: string;
  fullWidth?: boolean;
};

const InfoItem: FunctionComponent<InfoItemProps> = ({
  className,
  icon,
  label = '',
  description = '',
  fullWidth = false,
}) => {
  return (
    <div className={classNames(className, { [styles.fullWidth]: fullWidth })}>
      {icon}
      <div>
        <Text variant="body" className={styles.label}>
          {label}
        </Text>

        {description && (
          <Text className={styles.description}>{description}</Text>
        )}
      </div>
    </div>
  );
};

export default InfoItem;
