import { FunctionComponent } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Page } from 'react-helsinki-headless-cms/apollo';
import { useLocation } from 'react-router';

import Navigation from '../navigation/Navigation';
import Notification from '../notification/Notification';
import Footer from '../footer/Footer';
import styles from './pageLayout.module.scss';

const PageLayout: FunctionComponent = ({ children }) => {
  return (
    <HelmetProvider>
      <Page
        uri={useLocation().pathname}
        navigation={<Navigation />}
        notification={<Notification />}
        content={<div className={styles.content}>{children}</div>}
        footer={<Footer />}
      />
    </HelmetProvider>
  );
};

export default PageLayout;
