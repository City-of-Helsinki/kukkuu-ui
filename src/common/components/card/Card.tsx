import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import angleDownIcon from '../../../assets/icons/svg/angleDown.svg';
import styles from './card.module.scss';
import Button from '../button/Button';
import Icon from '../icon/Icon';

interface CardProps {
  image: string;
  primaryAction?: () => void;
  primaryActionText?: string;
  title: string;
  action: string;
  actionText: string;
}

const Card: FunctionComponent<CardProps> = ({
  children,
  image,
  primaryAction,
  primaryActionText,
  title,
  action,
  actionText,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div className={styles.wrapper}>
      <div className={styles.start}>
        {/* TODO: shrink and dimensions */}
        <img src={image} alt={'alt'} width="200" height="200" />
      </div>

      <div className={styles.middle}>
        {primaryAction && (
          <Button
            className={styles.primaryActionButton}
            onClick={primaryAction}
          >
            {primaryActionText}
          </Button>
        )}

        <div>
          <h3 className={styles.title}>{title}</h3>
          {children}
        </div>
      </div>

      <div className={styles.end}>
        <button
          aria-label={t('TODO: aria label')} // TODO
          className={styles.actionWrapper}
          onClick={() => history.push(`/${action}`)} // TODO
        >
          <div className={styles.actionText}>{actionText}</div>
          <Icon
            src={angleDownIcon}
            alt={t('TODO: action')}
            className={styles.goto}
          />
        </button>
      </div>
    </div>
  );
};

export default Card;
