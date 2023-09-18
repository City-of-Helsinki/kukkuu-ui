import { HelmetProvider } from 'react-helmet-async';

import Navigation from '../navigation/Navigation';
import Notification from '../notification/Notification';
import Footer from '../footer/Footer';
import styles from './pageLayout.module.scss';

type PageLayoutProps = { children: React.ReactNode };

function PageLayout({ children }: PageLayoutProps) {
  return (
    <HelmetProvider>
      <div className={styles.pageWrapper}>
        <div>
          <Navigation />
          <Notification />
        </div>

        <div className={styles.pageBody}>{children}</div>

        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default PageLayout;
