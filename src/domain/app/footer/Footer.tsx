import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem } from 'react-helsinki-headless-cms';
import { useMenuQuery } from 'react-helsinki-headless-cms/apollo';
import { Logo, Footer as HDSFooter, logoSv, logoFi } from 'hds-react';

import styles from './footer.module.scss';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import { resetFocusId } from '../../../common/components/resetFocus/ResetFocus';
import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';

type ValidMenuItem = {
  id: MenuItem['id'];
  label: NonNullable<MenuItem['label']>;
  path: NonNullable<MenuItem['path']>;
};

const isValidMenuItem = (menuItem: MenuItem): menuItem is ValidMenuItem =>
  !!menuItem.label && !!menuItem.path;

const Footer: FunctionComponent = () => {
  const languageToMenuNameMap = {
    [SUPPORT_LANGUAGES.FI]: 'Footer Navigation FI',
    [SUPPORT_LANGUAGES.SV]: 'Footer Navigation SV',
    [SUPPORT_LANGUAGES.EN]: 'Footer Navigation EN',
  } as const;

  const { t, i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);

  // override Footer component default behaviour which focuses skip-link
  const handleBackToTop = () => {
    window?.scrollTo({ top: 0 });
    document.querySelector<HTMLDivElement>(`#${resetFocusId}`)?.focus();
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
            size="medium"
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
      </HDSFooter.Base>
    </HDSFooter>
  );
};

export default Footer;
