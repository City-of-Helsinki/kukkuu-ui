import { useTranslation } from 'react-i18next';

import useLogout from './useLogout';
import InfoPageLayout from '../app/layout/InfoPageLayout';

const WrongLoginMethod = () => {
  const { t } = useTranslation();
  const logout = useLogout();

  const handleCallToActionClick = () => {
    logout();
  };

  return (
    <InfoPageLayout
      title={t('auth.wrongLoginMethod.title')}
      description={t('auth.wrongLoginMethod.description')}
      callToAction={{
        label: t('authentication.logout.text'),
        onClick: handleCallToActionClick,
      }}
    />
  );
};

export default WrongLoginMethod;
