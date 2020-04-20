import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import styles from './navbar.module.scss';
import UserDropdown from '../userDropdown/UserDropdown';
import LanguageBar from './languageBar/LanguageBar';
import SmallScreenNav from './smallScreenNav/SmallScreenNav';

const Navbar: FunctionComponent = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const isSmallScreen = window.innerWidth <= 768;
  return (
    <div className={styles.navbarTop}>
      <div className={styles.logoWrapper}>
        <div className={styles.logo} onClick={() => history.push('/')}></div>
        {!isSmallScreen && <div className={styles.appName}>{t('appName')}</div>}
      </div>
      <div className={styles.languageWrapper}>
        {isSmallScreen ? <SmallScreenNav /> : <LanguageBar />}
        {!isSmallScreen && <UserDropdown isSmallScreen={isSmallScreen} />}
      </div>
    </div>
  );
};

export default Navbar;
