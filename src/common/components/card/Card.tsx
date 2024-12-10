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
}: CardProps) => {
  const handleWrapperOnClick =
    primaryAction && withCardClickAction ? primaryAction : action;

  const handlePrimaryActionOnClick = !withCardClickAction
    ? primaryAction
    : undefined;

  return (
    // FIXME: Make Card accessible with keyboard & re-enable linting:
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={styles.wrapper} onClick={handleWrapperOnClick}>
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
              onClick={handlePrimaryActionOnClick}
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
