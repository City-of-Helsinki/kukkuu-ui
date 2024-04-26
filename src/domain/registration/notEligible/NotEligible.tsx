import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import styles from './notEligible.module.scss';
import adultFaceIcon from '../../../assets/icons/svg/adultFace.svg';
import Icon from '../../../common/components/icon/Icon';
import PageWrapper from '../../app/layout/PageWrapper';
import Button from '../../../common/components/button/Button';

const NotEligible: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <div>
        <div className={styles.notEligible}>
          <Icon className={styles.notEligibleFace} src={adultFaceIcon} />
          <p>{t('registration.notEligible.text')}</p>
          <Button
            className={styles.goBackButton}
            onClick={() =>
              navigate(t('registration.notEligible.otherOptionsLink'))
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
