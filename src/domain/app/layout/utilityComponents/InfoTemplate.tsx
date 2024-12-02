import React from 'react';
import classnames from 'classnames';

import Icon from '../../../../common/components/icon/Icon';
import Button from '../../../../common/components/button/Button';
import styles from './infoTemplate.module.scss';

export type InfoTemplateProps = {
  title: string | React.ReactElement;
  description?: string | React.ReactElement;
  icon?: string | React.ReactElement;
  callToAction?: {
    label: string | React.ReactElement;
    onClick: () => void;
  };
  classes?: string;
};

const InfoTemplate = ({
  title,
  description,
  callToAction,
  icon = '/icons/svg/adultFace.svg',
  classes,
}: InfoTemplateProps) => {
  return (
    <div className={classnames(styles.infoPageLayout, classes)}>
      <h1 className={styles.infoPageLayoutTitle}>{title}</h1>
      {typeof icon === 'string' ? (
        <Icon className={styles.infoPageLayoutFace} src={icon} />
      ) : (
        icon
      )}
      {description && (
        <p className={styles.infoPageLayoutDescription}>{description}</p>
      )}
      {callToAction && (
        <Button
          className={styles.callToActionButton}
          onClick={callToAction.onClick}
        >
          {callToAction.label}
        </Button>
      )}
    </div>
  );
};

export default InfoTemplate;
