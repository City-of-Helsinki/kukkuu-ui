import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Icon from '../../../common/components/icon/Icon';
import Button from '../../../common/components/button/Button';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import PageWrapper from '../../app/layout/PageWrapper';
import styles from './welcome.module.scss';
import { publicSvgIconPaths } from '../../../public_files';

const Welcome: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getPathname = useGetPathname();

  return (
    <PageWrapper>
      <div className={styles.welcome}>
        <h1>{t('registration.welcome.hero.header')}</h1>
        <Icon src={publicSvgIconPaths['tada']} className={styles.tada} />
        <Button
          aria-label={t('common.profile.goToProfile.buttonText')}
          onClick={() => navigate(getPathname('/profile'))}
          className={styles.submitButton}
        >
          {t('common.profile.goToProfile.buttonText')}
        </Button>
      </div>
    </PageWrapper>
  );
};

export default Welcome;
