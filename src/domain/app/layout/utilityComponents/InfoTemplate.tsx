import React from 'react';

import adultFaceIcon from '../../../../assets/icons/svg/adultFace.svg';
import Icon from '../../../../common/components/icon/Icon';
import Button from '../../../../common/components/button/Button';
import styles from './infoTemplate.module.scss';

type Props = {
  title: string | React.ReactElement;
  description: string | React.ReactElement;
  icon?: string;
  callToAction?: {
    label: string | React.ReactElement;
    onClick: () => void;
  };
};

const InfoTemplate = ({
  title,
  description,
  callToAction,
  icon = adultFaceIcon,
}: Props) => {
  return (
    <div className={styles.infoPageLayout}>
      <h1 className={styles.infoPageLayoutTitle}>{title}</h1>
      <Icon className={styles.infoPageLayoutFace} src={icon} />
      <p className={styles.infoPageLayoutDescription}>{description}</p>
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
