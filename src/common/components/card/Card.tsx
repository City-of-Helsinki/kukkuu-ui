import { ReactNode, ReactElement } from 'react';

import angleDownIcon from '../../../assets/icons/svg/angleDown.svg';
import styles from './card.module.scss';
import Icon from '../icon/Icon';
import Button from '../button/Button';

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

const Card = ({
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
}: CardProps) => {
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
        {children}
        <div className={styles.focalPoint}>
          {primaryAction && (
            <Button className={styles.primaryActionButton}>
              {primaryActionText}
            </Button>
          )}
          {focalContent && focalContent}
        </div>
      </div>

      <div className={styles.end}>
        <Button variant="supplementary" className={styles.actionWrapper}>
          <div className={styles.actionText}>{actionText}</div>
          <Icon src={angleDownIcon} alt={''} className={styles.gotoAction} />
        </Button>
      </div>
    </div>
  );
};

export default Card;
