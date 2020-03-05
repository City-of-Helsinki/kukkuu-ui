import React, { FunctionComponent, ReactNode, ReactElement } from 'react';

import angleDownIcon from '../../../assets/icons/svg/angleDown.svg';
import styles from './card.module.scss';
import Button from '../button/Button';
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
    <div className={styles.wrapper}>
      <div className={styles.start}>
        {/* TODO: size */}
        {imageSrc ? (
          <img src={imageSrc} alt={alt} width="200" height="200" />
        ) : (
          imageElement && imageElement
        )}
      </div>

      <div className={styles.middle}>
        <h3 className={styles.title}>{title}</h3> {/* TODO: children? */}
        <div className={styles.focalPoint}>
          {primaryAction && (
            <Button
              className={styles.primaryActionButton}
              onClick={primaryAction}
            >
              {primaryActionText}
            </Button>
          )}
          {focalContent && focalContent}
        </div>
        {children}
      </div>

      <div className={styles.end}>
        <button
          aria-label={actionText} // TODO
          className={styles.actionWrapper}
          onClick={action}
        >
          <div className={styles.actionText}>{actionText}</div>
          <Icon src={angleDownIcon} alt={''} className={styles.gotoAction} />
        </button>
      </div>
    </div>
  );
};

export default Card;
