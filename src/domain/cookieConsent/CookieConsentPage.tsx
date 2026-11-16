import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import PageWrapper from '../app/layout/PageWrapper';
import CookieConsent from './CookieConsent';

const CookieConsentPage: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('cookieConsent.title')}>
      <CookieConsent isPage appName={t('appName')} />
    </PageWrapper>
  );
};

export default CookieConsentPage;
