import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { userHasProfileSelector } from '../../registration/state/RegistrationSelectors';
import { Language } from '../../api/generatedTypes/globalTypes';
import AppRoute from '../AppRoute';
import appRoutes from '../appRoutes';
import getPathname from '../../../common/route/utils/getPathname';

const LocaleRoutes: React.FC<{ locale: Lowercase<Language> }> = ({
  locale,
}) => {
  const { i18n, t } = useTranslation();
  const userHasProfile = useSelector(userHasProfileSelector);

  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [i18n, locale]);

  return (
    <Routes>
      {Object.values(appRoutes).map((routeProps) => {
        const { title, path } = routeProps;
        // Don't render registration form when user has a profile,
        // but redirect the user to the profile page instead.
        if (path === appRoutes.registrationForm.path && userHasProfile) {
          <Navigate to={getPathname('/profile', locale)} />;
        }

        return (
          <Route
            key={path as string}
            {...routeProps}
            element={
              <AppRoute {...routeProps} title={title ? t(title) : undefined} />
            }
          />
        );
      })}
    </Routes>
  );
};
export default LocaleRoutes;
