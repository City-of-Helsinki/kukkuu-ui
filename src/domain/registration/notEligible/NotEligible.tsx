import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './notEligible.module.scss';
import adultFaceIcon from '../../../assets/icons/svg/adultFace.svg';
import Icon from '../../../common/components/icon/Icon';
import PageWrapper from '../../app/layout/PageWrapper';
import Button from '../../../common/components/button/Button';

const NotEligible: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('registration.notEligible.title')}>
      <div>
        <div className={styles.notEligible}>
          <Icon className={styles.notEligibleFace} src={adultFaceIcon} />
          <p>{t('registration.notEligible.text')}</p>
          <Button
            className={styles.goBackButton}
            onClick={() =>
              (window.location.href = t(
                'registration.notEligible.otherOptionsLink'
              ))
            }
          >
            {t('registration.notEligible.buttonText')}
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NotEligible;
