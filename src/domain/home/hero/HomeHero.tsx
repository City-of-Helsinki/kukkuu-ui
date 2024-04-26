import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IconAlertCircle, useOidcClient } from 'hds-react';

import Button from '../../../common/components/button/Button';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import Config from '../../config';
import styles from './hero.module.scss';

type HomeHeroProps = {
  userHasProfile: boolean;
  userIsAuthenticated: boolean;
  scrollToForm: () => void;
};

const HomeHero = ({
  userHasProfile,
  scrollToForm,
  userIsAuthenticated,
}: HomeHeroProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getPathname = useGetPathname();
  const { login } = useOidcClient();
  return (
    <section className={styles.heroWrapper}>
      <div className={styles.heroContainer}>
        <div className={styles.hero}>
          <h1>{t('appName')}</h1>
          <p className={styles.bodyXl}>{t('homePage.hero.descriptionText')}</p>
          {Config.featureFlagShowCoronaInfo && (
            <>
              <IconAlertCircle size="l" />
              <p className={styles.notice}>{t('home.coronaNotice')}</p>
            </>
          )}
          <div className={styles.buttonGroup}>
            {!userHasProfile && (
              <Button className={styles.registerButton} onClick={scrollToForm}>
                {t('homePage.hero.buttonText')}
              </Button>
            )}
            {
              // If the user is not authenticated, they can't access the
              // the profile page, so only show this link when there's
              // a profile, and the user is authenticated.
            }
            {userHasProfile && userIsAuthenticated && (
              <Button
                className={styles.authenticateButton}
                onClick={() => navigate(getPathname('/profile'))}
              >
                {t('common.profile.goToProfile.buttonText')}
              </Button>
            )}
            {!userIsAuthenticated && (
              <Button
                variant="secondary"
                className={styles.authenticateButton}
                onClick={() => login()}
              >
                {t('authentication.login.text')}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className={styles.kidsImageContainer}>
        <div className={styles.kidsImage}></div>
      </div>
    </section>
  );
};

export default HomeHero;
