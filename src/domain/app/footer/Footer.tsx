import { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@city-of-helsinki/react-helsinki-headless-cms';
import { useMenuQuery } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import {
  Logo,
  Footer as HDSFooter,
  logoSv,
  logoFi,
  LogoSize,
  Tooltip,
} from 'hds-react';

import styles from './footer.module.scss';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import {
  isCimodeIndicatorRequested,
  setCimodeIndicatorRequested,
  CIMODE_CHANGE_EVENT,
  CIMODE_INDICATOR_ELEMENT_ID,
} from '../../../common/translation/cimode/cimodeUtils';
import { RESET_FOCUS_ID } from '../../../common/components/resetFocus/constants';
import { languageToMenuNameMap } from './constants';

type ValidMenuItem = {
  id: MenuItem['id'];
  label: NonNullable<MenuItem['label']>;
  path: NonNullable<MenuItem['path']>;
};

const isValidMenuItem = (menuItem: MenuItem): menuItem is ValidMenuItem =>
  !!menuItem.label && !!menuItem.path;

const Footer: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const [indicatorRequested, setIndicatorRequested] = useState(
    isCimodeIndicatorRequested
  );

  useEffect(() => {
    const handleCimodeChange = () => {
      setIndicatorRequested(isCimodeIndicatorRequested());
    };
    window.addEventListener(CIMODE_CHANGE_EVENT, handleCimodeChange);
    return () => {
      window.removeEventListener(CIMODE_CHANGE_EVENT, handleCimodeChange);
    };
  }, []);

  const handleToggleCimode = () => {
    setCimodeIndicatorRequested(!indicatorRequested);
  };

  // override Footer component default behaviour which focuses skip-link
  const handleBackToTop = () => {
    globalThis.window?.scrollTo({ top: 0 });
    document.querySelector<HTMLDivElement>(`#${RESET_FOCUS_ID}`)?.focus();
  };

  const footerMenuQuery = useMenuQuery({
    variables: {
      id: languageToMenuNameMap[currentLocale],
      menuIdentifiersOnly: true,
    },
  });
  const footerLinks =
    footerMenuQuery.data?.menu?.menuItems?.nodes?.filter(isValidMenuItem) ?? [];

  return (
    <HDSFooter title={t('appName')} className={styles.footer}>
      <HDSFooter.Base
        copyrightHolder={t('common.cityOfHelsinki')}
        logo={
          <Logo
            src={currentLocale === 'sv' ? logoSv : logoFi}
            size={LogoSize.Medium}
            alt={t('common.cityOfHelsinki')}
          />
        }
        backToTopLabel={t('footer.backToTop')}
        onBackToTopClick={handleBackToTop}
      >
        {footerLinks.map((footerLink) => (
          <HDSFooter.Link
            key={footerLink.id}
            href={footerLink.path}
            label={footerLink.label}
          />
        ))}
        <HDSFooter.Link
          as="div"
          key="cimode-toggle"
          label={
            (
              <div className={styles.cimodeContainer}>
                <button
                  type="button"
                  className={styles.cimodeButton}
                  onClick={handleToggleCimode}
                  data-testid="footer-cimode-button"
                  aria-label={
                    indicatorRequested
                      ? t('footer.cimodeAriaClose')
                      : t('footer.cimodeAriaOpen')
                  }
                  aria-expanded={indicatorRequested}
                  aria-controls={CIMODE_INDICATOR_ELEMENT_ID}
                >
                  {indicatorRequested
                    ? t('footer.cimodeHide')
                    : t('footer.cimode')}
                </button>
                <Tooltip
                  small
                  placement="top"
                  buttonClassName={styles.tooltipButton}
                  tooltipLabel={t('footer.cimodeTooltipLabel')}
                >
                  {t('footer.cimodeTooltip')}
                </Tooltip>
              </div>
            ) as unknown as string
          }
        />
      </HDSFooter.Base>
    </HDSFooter>
  );
};

export default Footer;
