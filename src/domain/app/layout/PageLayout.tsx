import { FunctionComponent } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import Navigation from '../navigation/Navigation';
import Notification from '../notification/Notification';
import Footer from '../footer/Footer';
import styles from './pageLayout.module.scss';

const PageLayout: FunctionComponent = ({ children }) => {
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
};

export default PageLayout;
