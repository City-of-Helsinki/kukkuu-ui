import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router';

export const NavigateToLocalePath = () => {
  const {
    i18n: { language: currentLocale },
  } = useTranslation();
  const location = useLocation();

  if (!location.pathname.startsWith(`/${currentLocale}`))
    return (
      <Navigate
        to={`/${currentLocale}${location.pathname}${location.search}`}
        replace
      />
    );
  return null;
};
