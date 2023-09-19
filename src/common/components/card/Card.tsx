import { ReactNode, ReactElement } from 'react';
import { IconAngleRight } from 'hds-react';

import Button from '../button/Button';
import Text from '../text/Text';
import styles from './card.module.scss';

interface CardProps {
  action: () => void;
  actionText: string;
  alt?: string;
  children?: ReactNode;
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
      <div className={styles.image}>
        {imageSrc ? (
          <img src={imageSrc} alt={alt} className={styles.image} />
        ) : (
          imageElement && imageElement
        )}
      </div>
      <div className={styles.content}>
        <Text variant="h3" className={styles.title}>
          {title}
        </Text>
        {children}
        <div className={styles.focalPoint}>
          {primaryAction && (
            <Button className={styles.primaryActionButton}>
              {primaryActionText}
            </Button>
          )}
          <span>{focalContent && focalContent}</span>
        </div>
      </div>
      <div className={styles.cta}>
        <Button
          variant="supplementary"
          aria-label={actionText}
          className={styles.actionWrapper}
        >
          <IconAngleRight />
        </Button>
      </div>
    </div>
  );
};

export default Card;
