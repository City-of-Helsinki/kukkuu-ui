import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  ButtonPresetTheme,
  IconAlertCircle,
  useOidcClient,
  IconSize,
  Koros,
} from 'hds-react';

import Button from '../../../common/components/button/Button';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import Config from '../../config';
import styles from './hero.module.scss';

export type HomeHeroImage = {
  url?: string | null;
  altText?: string | null;
  photographerName?: string | null;
};

export type HomeHeroProps = {
  userHasProfile: boolean;
  userIsAuthenticated: boolean;
  scrollToForm: () => void;
  title?: string;
  description?: string;
  image?: HomeHeroImage;
};

const HomeHero = ({
  userHasProfile,
  scrollToForm,
  userIsAuthenticated,
  title,
  description,
  image,
}: HomeHeroProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getPathname = useGetPathname();
  const { login } = useOidcClient();

  const heroTitle = title || t('appName');
  const heroDescription =
    description !== undefined
      ? description
      : t('homePage.hero.descriptionText');
  const imageUrl = image?.url || '/images/Culture_kids@2x.jpg';
  const imageAlt = image?.altText || '';
  const photographerName = image?.photographerName;

  return (
    <section className={styles.heroWrapper}>
      <div className={styles.heroTopSection}>
        <div className={styles.heroContainer}>
          <div className={styles.hero}>
            <h1>{heroTitle}</h1>
            {heroDescription && <p className={styles.bodyXl}>{heroDescription}</p>}
            {Config.featureFlagShowCoronaInfo && (
              <>
                <IconAlertCircle size={IconSize.Large} />
                <p className={styles.notice}>{t('home.coronaNotice')}</p>
              </>
            )}
            <div className={styles.buttonGroup}>
              {!userHasProfile && (
                <Button
                  theme={ButtonPresetTheme.Black}
                  className={styles.registerButton}
                  onClick={scrollToForm}
                >
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
                  theme={ButtonPresetTheme.Black}
                  onClick={() => navigate(getPathname('/profile'))}
                >
                  {t('common.profile.goToProfile.buttonText')}
                </Button>
              )}
              {!userIsAuthenticated && (
                <Button
                  theme={ButtonPresetTheme.Black}
                  variant="secondary"
                  onClick={() => login()}
                >
                  {t('authentication.login.text')}
                </Button>
              )}
            </div>
          </div>
        </div>
        <Koros
          type="pulse"
          flipVertical
          className={styles.heroKoros}
          style={{ fill: 'var(--color-summer)' }}
        />
      </div>
      <div className={styles.heroImageContainer}>
        <div className={styles.heroImageWrapper}>
          <img
            src={imageUrl}
            alt={imageAlt}
            fetchPriority="high"
            className={styles.heroImage}
          />
          {photographerName && (
            <div className={styles.photographerCredit}>
              {t('cms:image.photographer', {
                photographer: photographerName,
                defaultValue: `Photo: ${photographerName}`,
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
