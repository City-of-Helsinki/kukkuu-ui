import React from 'react';
import classNames from 'classnames';

import styles from './infoWithIcon.module.scss';

export interface InfoWithIconProps {
  icon: React.ReactElement;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const InfoWithIcon: React.FC<InfoWithIconProps> = ({
  children,
  icon,
  title,
  className,
}) => {
  return (
    <div className={classNames(styles.infoWithIcon, className)}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.iconTextWrapper}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default InfoWithIcon;
