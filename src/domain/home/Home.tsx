import React, { FunctionComponent } from 'react';

import { formatMessage } from '../../common/translation/utils';
import styles from './home.module.scss';
import HomePreliminaryForm from './form/HomePreliminaryForm';

const Home: FunctionComponent = () => {
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1>{formatMessage('homePage.hero.heading')}</h1>
          <p className={styles.description}>
            {formatMessage('homePage.hero.descriptionText')}
          </p>
          <HomePreliminaryForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
