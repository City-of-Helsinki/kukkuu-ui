import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import tadaImage from '../../../assets/icons/svg/tada.svg';
import Button from '../../../common/components/button/Button';
import Icon from '../../../common/components/icon/Icon';
import styles from './welcome.module.scss';
import homeFormStyles from '../../home/form/homePreliminaryForm.module.scss';

const Welcome: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.welcome}>
      <h1>{t('registration.welcome.hero.header')}</h1>
      <Icon src={tadaImage} className={styles.tada} alt="Tada!" />
      <form>
        <Button className={homeFormStyles.submitButton} type="submit">
          {t('common.profile.goToProfile.buttonText')}
        </Button>
      </form>
    </div>
  );
};

export default Welcome;
