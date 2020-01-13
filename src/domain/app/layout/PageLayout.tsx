import React, { FunctionComponent } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import Header from '../header/Header';
import styles from './pageLayout.module.scss';
import Footer from '../footer/Footer';
const PageLayout: FunctionComponent = ({ children }) => {
  return (
    <HelmetProvider>
      <div className={styles.pageWrapper}>
        <Header />

        <div className={styles.pageBody}>{children}</div>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default PageLayout;
