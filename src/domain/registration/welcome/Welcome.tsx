import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import tadaImage from '../../../assets/icons/svg/tada.svg';
import Icon from '../../../common/components/icon/Icon';
import styles from './welcome.module.scss';
import PageWrapper from '../../app/layout/PageWrapper';
import Button from '../../../common/components/button/Button';

const Welcome: FunctionComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <PageWrapper>
      <div className={styles.welcome}>
        <h1>{t('registration.welcome.hero.header')}</h1>
        <Icon src={tadaImage} className={styles.tada} />
        <Button
          aria-label={t('common.profile.goToProfile.buttonText')}
          onClick={() => history.push('/profile')}
          className={styles.submitButton}
        >
          {t('common.profile.goToProfile.buttonText')}
        </Button>
      </div>
    </PageWrapper>
  );
};

export default Welcome;
