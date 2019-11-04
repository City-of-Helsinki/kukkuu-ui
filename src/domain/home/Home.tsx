import React, { FunctionComponent } from 'react';

import authenticate from '../auth/authenticate';
import Layout from '../app/layout/Layout';
import { formatMessage } from '../../common/translation/utils';
import styles from './home.module.scss';
import HomePreliminaryForm from './form/HomePreliminaryForm';

const Home: FunctionComponent = () => {
  return (
    <Layout>
      <div className={styles.home}>
        <div className={styles.hero}>
          <div className={styles.heroContainer}>
            <h1>{formatMessage('homePage.hero.heading')}</h1>
            <p className={styles.description}>
              {formatMessage('homePage.hero.descriptionText')}
              <span onClick={authenticate} role="button">
                Login using tunnistamo
              </span>
            </p>
            <HomePreliminaryForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
