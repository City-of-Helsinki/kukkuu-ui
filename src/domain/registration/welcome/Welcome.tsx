import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import tadaImage from '../../../assets/icons/svg/tada.svg';
import Button from '../../../common/components/button/Button';
import Icon from '../../../common/components/icon/Icon';
import styles from './welcome.module.scss';

const Welcome: FunctionComponent = () => {
  const { t } = useTranslation();
  //const rest = { width: '100px' };
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1>{t('registration.welcome.hero.header')}</h1>
          <Icon src={tadaImage} className={styles.tada} alt="Tada!" />
          <Button className={styles.submitButton} type="submit">
            {t('common.profile.goToProfile.buttonText')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
