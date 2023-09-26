import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Navigate,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from 'react-router-dom';
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

  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [i18n, locale]);

  return (
    <Routes>
      {Object.values(appRoutes).map((routeProps) => {
        const { title, path } = routeProps;
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
