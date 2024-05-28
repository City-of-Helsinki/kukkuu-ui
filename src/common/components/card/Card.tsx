import { ReactNode, ReactElement } from 'react';
import { IconAngleRight } from 'hds-react';
import classNames from 'classnames';

import Button from '../button/Button';
import Text from '../text/Text';
import styles from './card.module.scss';

interface CardProps {
  action?: () => void;
  actionText: string;
  withCardClickAction?: boolean;
  withAction?: boolean;
  alt?: string;
  children?: ReactNode;
  imageElement?: ReactElement;
  focalContent?: ReactNode;
  imageSrc?: string;
  primaryAction?: () => void;
  primaryActionText?: string;
  title: string;
  imageFullHeight?: boolean;
}

const Card = ({
  action,
  actionText,
  withCardClickAction = true,
  withAction = true,
  alt = '',
  children,
  imageElement,
  focalContent,
  imageSrc,
  primaryAction,
  primaryActionText,
  title,
  imageFullHeight = false,
}: CardProps) => {
  return (
    <div
      className={styles.wrapper}
      onClick={primaryAction && withCardClickAction ? primaryAction : action}
    >
      <div className={classNames(styles.image, styles.fullHeight)}>
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
            <Button
              className={styles.primaryActionButton}
              onClick={!withCardClickAction ? primaryAction : undefined}
            >
              {primaryActionText}
            </Button>
          )}
          <span>{focalContent && focalContent}</span>
        </div>
      </div>
      <div className={styles.cta}>
        {withAction && (
          <Button
            variant="supplementary"
            aria-label={actionText}
            className={styles.actionWrapper}
          >
            <IconAngleRight />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Card;
