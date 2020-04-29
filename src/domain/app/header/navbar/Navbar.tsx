import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import joinClassNames from 'classnames';

import styles from './navbar.module.scss';
import UserDropdown from '../userDropdown/UserDropdown';
import LanguageBar from './languageBar/LanguageBar';
import SmallScreenNav from './smallScreenNav/SmallScreenNav';
import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';

const Navbar: FunctionComponent = (props) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  const currentLocale = getCurrentLanguage(i18n);
  const logoLang = currentLocale === 'sv' ? styles.sv : styles.fi;

  const isSmallScreen = window.innerWidth <= 768;
  return (
    <div className={styles.navbarTop}>
      <div className={styles.logoWrapper}>
        <div
          className={joinClassNames(styles.logo, logoLang)}
          onClick={() => history.push('/')}
        ></div>
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
