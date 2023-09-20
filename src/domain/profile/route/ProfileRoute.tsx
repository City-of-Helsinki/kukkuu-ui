import { useMatch, useParams, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ProtectedRoute from '../../auth/route/ProtectedRoute';
import AppRoute from '../../app/AppRoute';
import appRoutes, { localeParam } from '../../app/appRoutes';
import Profile from '../Profile';
import ProfileChildRoutes from './ProfileChildRoutes';
import useIsChildOfProfile from './useIsChildOfProfile';
import useGetPathname from '../../../common/route/utils/useGetPathname';

type ProfileParams = {
  locale: string;
};

export const useProfileRouteGoBackTo = () => {
  const { locale } = useParams<ProfileParams>();

  if (locale) {
    return (appRoutes.profile.path as string).replace(localeParam, locale);
  }

  return (appRoutes.profile.path as string).replace(`/${localeParam}`, '');
};

export const useChildRouteGoBackTo = () => {
  const { childId } = useParams<{ childId: string }>();
  const profileUrl = useProfileRouteGoBackTo();
  return `${profileUrl}/child/${childId}`;
};

const ProfileRoute = () => {
  const { t } = useTranslation();
  const childRoutePath = `${appRoutes.profile.path}/child/:childId`;
  const match = useMatch(childRoutePath);
  const [queryIsChildOfProfile] = useIsChildOfProfile();
  const getPathname = useGetPathname();

  return (
    <Routes>
      <AppRoute
        title={t('profile.heading')}
        element={<Profile />}
        path={appRoutes.profile.path}
      />
      <ProtectedRoute
        isAuthorized={() => queryIsChildOfProfile(match?.params.childId)}
        redirectTo={getPathname('/wrong-login-method')}
        element={<ProfileChildRoutes />}
        path={childRoutePath}
      />
    </Routes>
  );
};
export default ProfileRoute;
