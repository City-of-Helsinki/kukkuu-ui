import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Logo, Footer as HDSFooter, logoSv, logoFi } from 'hds-react';

import useStaticLinks from '../useStaticLinks';
import styles from './footer.module.scss';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import { resetFocusId } from '../../../common/components/resetFocus/ResetFocus';

const Footer: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);

  // override Footer component default behaviour which focuses skip-link
  const handleBackToTop = () => {
    window?.scrollTo({ top: 0 });
    document.querySelector<HTMLDivElement>(`#${resetFocusId}`)?.focus();
  };

  const navigationItems = useStaticLinks();

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
        {navigationItems.map((navigationItem) => (
          <HDSFooter.Link
            key={navigationItem?.id}
            as={Link}
            href={navigationItem?.path || ''}
            label={navigationItem?.label ?? undefined}
          />
        ))}
      </HDSFooter.Base>
    </HDSFooter>
  );
};

export default Footer;
