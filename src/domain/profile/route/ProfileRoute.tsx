import React from 'react';
import { Switch, useRouteMatch, useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import ProtectedRoute from '../../auth/route/ProtectedRoute';
import AppRoute from '../../app/AppRoute';
import Profile from '../Profile';
import ProfileChildRoutes from './ProfileChildRoutes';
import useIsChildOfProfile from './useIsChildOfProfile';

export const useProfileRouteGoBack = () => {
  const { i18n } = useTranslation();
  const history = useHistory();
  const currentLocale = getCurrentLanguage(i18n);
  return () => history.push(`/${currentLocale}/profile`);
};

export const useChildRouteGoBack = () => {
  const history = useHistory();
  const { i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const { childId } = useParams<{ childId: string }>();
  return () => history.push(`/${currentLocale}/profile/child/${childId}`);
};

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
