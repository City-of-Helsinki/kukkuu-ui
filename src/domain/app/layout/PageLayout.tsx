import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import Navigation from '../navigation/Navigation';
import Notification from '../notification/Notification';
import Footer from '../footer/Footer';
import styles from './pageLayout.module.scss';
import { MAIN_CONTENT_ID } from '../../constants';
import CookieConsent from '../../cookieConsent/CookieConsent';

type PageLayoutProps = { children: React.ReactNode };

function PageLayout({ children }: PageLayoutProps) {
  const { t } = useTranslation();

  return (
    <HelmetProvider>
      <div className={styles.pageWrapper}>
        <div>
          <Navigation />
          <Notification />
        </div>

        <div className={styles.pageBody} id={MAIN_CONTENT_ID}>
          {children}
          <CookieConsent appName={t('appName')} />
        </div>

        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default PageLayout;
