import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { IconAlertCircle } from 'hds-react';

import styles from './hero.module.scss';
import { loginTunnistamo } from '../../auth/authenticate';
import Button from '../../../common/components/button/Button';
import Config from '../../config';

type HomeHero = {
  userHasProfile: boolean;
  userIsAuthenticated: boolean;
  scrollToForm: () => void;
};

const HomeHero = ({
  userHasProfile,
  scrollToForm,
  userIsAuthenticated,
}: HomeHero) => {
  const { t } = useTranslation();
  const history = useHistory();

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
                onClick={() => history.push('/profile')}
              >
                {t('common.profile.goToProfile.buttonText')}
              </Button>
            )}
            {!userIsAuthenticated && (
              <Button
                variant="secondary"
                className={styles.authenticateButton}
                onClick={() => loginTunnistamo()}
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
