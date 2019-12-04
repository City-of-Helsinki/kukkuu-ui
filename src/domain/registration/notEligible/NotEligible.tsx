import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './notEligible.module.scss';
import Button from '../../../common/components/button/Button';
import adultFaceIcon from '../../../assets/icons/svg/adultFace.svg';
import Icon from '../../../common/components/icon/Icon';
import PageWrapper from '../../app/layout/PageWrapper';

const NotEligible: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <PageWrapper title={'registration.notEligible.title'}>
      <div className={styles.home}>
        <div className={styles.hero}>
          <div className={styles.heroContainer}>
            <div className={styles.notEligible}>
              <Icon
                className={styles.notEligibleFace}
                src={adultFaceIcon}
                alt="Non eligible face"
              />
              <p>{t('registration.notEligible.text')}</p>
            </div>
            <div className={styles.goBackButton}>
              <Button onClick={() => alert('TODO')}>
                {t('registration.notEligible.buttonText')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NotEligible;
