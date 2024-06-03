import { useTranslation } from 'react-i18next';

import useGetPathname from '../../common/route/utils/useGetPathname';

// todo: this hook is used for static links in the footer navigation
// links should be reusable so the header language switch knows how to switch the language accordingly
// if possible, replace with footer menu items from headless cms

export default function useStaticLinks() {
  const { t } = useTranslation();
  const getPathname = useGetPathname();

  return [
    {
      id: 'accessibilityStatement',
      label: t('accessibilityStatement.title'),
      path: getPathname('/accessibility#start'),
      slug: '/accessibility',
    },
    {
      id: 'termsOfService',
      label: t('termsOfService.title'),
      path: getPathname('/terms#'),
      slug: '/terms',
    },
    {
      id: 'cookieConsent',
      label: t('cookieConsent.title'),
      path: getPathname('/cookie-consent#'),
      slug: '/cookie-consent',
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
}
