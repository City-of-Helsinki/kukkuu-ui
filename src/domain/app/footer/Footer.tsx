import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Logo, Footer as HDSFooter, logoSv, logoFi } from 'hds-react';

import styles from './footer.module.scss';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import { resetFocusId } from '../../../common/components/resetFocus/ResetFocus';

type Props = {
  className?: string;
};

const Footer: FunctionComponent<Props> = ({ className }) => {
  const { t, i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const getPathname = useGetPathname();

  // override Footer component default behaviour which focuses skip-link
  const handleBackToTop = () => {
    window?.scrollTo({ top: 0 });
    document.querySelector<HTMLDivElement>(`#${resetFocusId}`)?.focus();
  };

  const navigationItems = [
    {
      id: 'accessibilityStatement',
      label: t('accessibilityStatement.title'),
      path: getPathname('/accessibility#start'),
    },
    {
      id: 'termsOfService',
      label: t('termsOfService.title'),
      path: getPathname('/terms#'),
    },
    {
      id: 'cookieConsent',
      label: t('cookieConsent.title'),
      path: getPathname('/cookie-consent#'),
    },
    {
      id: 'descriptionOfTheFile',
      label: t('descriptionOfTheFile.title'),
      path: t('descriptionOfTheFile.url'),
    },
    {
      id: 'dataProtection',
      label: t('dataProtection.title'),
      path: t('dataProtection.url'),
    },
  ];

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
