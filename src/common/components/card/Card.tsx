import React, { FunctionComponent, ReactNode, ReactElement } from 'react';
import { Button } from 'hds-react';

import angleDownIcon from '../../../assets/icons/svg/angleDown.svg';
import styles from './card.module.scss';
import Icon from '../icon/Icon';

interface CardProps {
  action: () => void;
  actionText: string;
  alt?: string;
  children: ReactNode;
  imageElement?: ReactElement;
  focalContent?: ReactNode;
  imageSrc?: string;
  primaryAction?: () => void;
  primaryActionText?: string;
  title: string;
}

const Card: FunctionComponent<CardProps> = ({
  action,
  actionText,
  alt = '',
  children,
  imageElement,
  focalContent,
  imageSrc,
  primaryAction,
  primaryActionText,
  title,
}) => {
  return (
    <div
      className={styles.wrapper}
      onClick={primaryAction ? primaryAction : action}
    >
      <div className={styles.start}>
        {imageSrc ? (
          <img src={imageSrc} alt={alt} className={styles.image} />
        ) : (
          imageElement && imageElement
        )}
      </div>

      <div className={styles.middle}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.focalPoint}>
          {primaryAction && (
            <Button className={styles.primaryActionButton}>
              {primaryActionText}
            </Button>
          )}
          {focalContent && focalContent}
        </div>
        {children}
      </div>

      <div className={styles.end}>
        <button aria-label={actionText} className={styles.actionWrapper}>
          <div className={styles.actionText}>{actionText}</div>
          <Icon src={angleDownIcon} alt={''} className={styles.gotoAction} />
        </button>
      </div>
    </div>
  );
};

export default Card;
