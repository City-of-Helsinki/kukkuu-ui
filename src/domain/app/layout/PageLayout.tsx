import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import useCmsCacheRevalidation from '../../headlessCms/hooks/useCmsCacheRevalidation';
import { stripLocaleFromUri } from '../../../utils/cmsUtils';
import Navigation from '../navigation/Navigation';
import Notification from '../notification/Notification';
import Footer from '../footer/Footer';
import styles from './pageLayout.module.scss';
import { MAIN_CONTENT_ID } from '../../constants';
import CookieConsent from '../../cookieConsent/CookieConsent';

type PageLayoutProps = { children: React.ReactNode };

function PageLayout({ children }: PageLayoutProps) {
  const { t } = useTranslation();
  useCmsCacheRevalidation();
  const { pathname } = useLocation();

  const isCookieConsentPage =
    stripLocaleFromUri(pathname).replace(/\/$/, '') === '/cookie-consent';

  return (
    <HelmetProvider>
      <div className={styles.pageWrapper}>
        <div>
          <Navigation />
          <Notification />
        </div>

        <div className={styles.pageBody} id={MAIN_CONTENT_ID}>
          {children}
          {!isCookieConsentPage && <CookieConsent appName={t('appName')} />}
        </div>

        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default PageLayout;
