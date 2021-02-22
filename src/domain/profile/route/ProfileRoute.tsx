import React from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import ProtectedRoute from '../../auth/route/ProtectedRoute';
import AppRoute from '../../app/AppRoute';
import Profile from '../Profile';
import ProfileChildRoutes from './ProfileChildRoutes';
import useIsChildOfProfile from './useIsChildOfProfile';

const ProfileRoute = () => {
  const { i18n, t } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const childRoutePath = `/${currentLocale}/profile/child/:childId`;
  const match = useRouteMatch<{ childId: string }>(childRoutePath);
  const [queryIsChildOfProfile] = useIsChildOfProfile();

  return (
    <Switch>
      <AppRoute
        title={t('profile.heading')}
        component={Profile}
        exact
        path={`/${currentLocale}/profile`}
      />
      <ProtectedRoute
        isAuthorized={() => queryIsChildOfProfile(match?.params.childId)}
        redirectTo="/wrong-login-method"
        component={ProfileChildRoutes}
        path={childRoutePath}
      />
    </Switch>
  );
};
export default ProfileRoute;
