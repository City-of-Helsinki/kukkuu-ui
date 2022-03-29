import { FunctionComponent } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import Navigation from '../navigation/Navigation';
import styles from './pageLayout.module.scss';
import Footer from '../footer/Footer';

const PageLayout: FunctionComponent = ({ children }) => {
  return (
    <HelmetProvider>
      <div className={styles.pageWrapper}>
        <Navigation />

        <div className={styles.pageBody}>{children}</div>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default PageLayout;
