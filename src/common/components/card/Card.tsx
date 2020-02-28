import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import angleDownIcon from '../../../assets/icons/svg/angleDown.svg';
import styles from './card.module.scss';
import Button from '../button/Button';
import Icon from '../icon/Icon';

interface CardProps {
  action: () => void;
  actionText: string;
  image: string;
  primaryAction?: () => void;
  primaryActionText?: string;
  title: string;
}

const Card: FunctionComponent<CardProps> = ({
  action,
  actionText,
  children,
  image,
  primaryAction,
  primaryActionText,
  title,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.start}>
        {/* TODO: alt, size */}
        <img src={image} alt={'alt'} width="200" height="200" />
      </div>

      <div className={styles.middle}>
        <h3 className={styles.title}>{title}</h3> {/* TODO: children? */}
        {primaryAction && (
          <Button
            className={styles.primaryActionButton}
            onClick={primaryAction}
          >
            {primaryActionText}
          </Button>
        )}
        {children}
      </div>

      <div className={styles.end}>
        <button
          aria-label={t('TODO: aria label')} // TODO
          className={styles.actionWrapper}
          onClick={action}
        >
          <div className={styles.actionText}>{actionText}</div>
          <Icon
            src={angleDownIcon}
            alt={t('TODO: action')}
            className={styles.gotoAction}
          />
        </button>
      </div>
    </div>
  );
};

export default Card;
