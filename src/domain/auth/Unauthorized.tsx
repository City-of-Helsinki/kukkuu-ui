import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import InfoPageLayout from '../app/layout/InfoPageLayout';
import { loginTunnistamo } from './authenticate';

const Unauthorized = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get('next');

  const handleCallToActionClick = () => {
    loginTunnistamo(nextPath ?? undefined);
  };

  return (
    <InfoPageLayout
      title={t('auth.unauthorized.title')}
      description={t('auth.unauthorized.description')}
      callToAction={{
        label: t('authentication.login.text'),
        onClick: handleCallToActionClick,
      }}
    />
  );
};

export default Unauthorized;
