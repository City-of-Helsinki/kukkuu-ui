import * as React from 'react';
import { useTranslation } from 'react-i18next';

import hamburgerMenu from '../../../../../assets/icons/svg/hamburgerMenu.svg';
import close from '../../../../../assets/icons/svg/close.svg';
import styles from './smallScreenNav.module.scss';
import Icon from '../../../../../common/components/icon/Icon';
import UserDropdown from '../../userDropdown/UserDropdown';
import LanguageBar from '../languageBar/LanguageBar';
import Button from '../../../../../common/components/button/Button';

const SmallScreenNav: React.FunctionComponent = (props) => {
  const { t } = useTranslation();

  const ref = React.useRef<HTMLDivElement>(null);
  const [isOpen, toggleNavMenu] = React.useState(false);
  const handleClick = (e: Event) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      toggleNavMenu(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const ariaLabel = isOpen
    ? t('common.menu.closeMenuText')
    : t('common.menu.openMenuText');

  return (
    <div className={styles.smallScreenNav}>
      <Button
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => toggleNavMenu(!isOpen)}
      >
        <Icon
          className={styles.icon}
          src={hamburgerMenu}
          alt={t('navbar.menuButton.label')}
        />
      </Button>
      {isOpen && (
        <div
          className={styles.smallScreenNavContent}
          onClick={() => toggleNavMenu(!isOpen)}
        >
          <div className={styles.smallScreenNavTop}>
            <div className={styles.logoWrapper}>
              <div className={styles.logo}></div>
            </div>
            <button
              aria-label={t('common.closeButton.altText')}
              className={styles.closeButton}
              onClick={() => toggleNavMenu(!isOpen)}
            >
              <Icon
                className={styles.icon}
                src={close}
                alt={t('common.closeButton.altText')}
              />
            </button>
          </div>
          <UserDropdown isSmallScreen={true} />
          <LanguageBar className={styles.smallScreenNavLangBar} />
        </div>
      )}
    </div>
  );
};

export default SmallScreenNav;
