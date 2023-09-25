import { useMatch, useParams, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ProtectedRoute from '../../auth/route/ProtectedRoute';
import AppRoute from '../../app/AppRoute';
import appRoutes, { localeParam } from '../../app/appRoutes';
import Profile from '../Profile';
import ProfileChildRoutes from './ProfileChildRoutes';
import useIsChildOfProfile from './useIsChildOfProfile';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import useAppRouteHref from '../../app/useAppRouteHref';

export const useProfileRouteGoBackTo = () => {
  return useAppRouteHref(appRoutes.profile.path as string);
};

export const useChildRouteGoBackTo = () => {
  const { childId } = useParams<{ childId: string }>();
  const profileUrl = useProfileRouteGoBackTo();
  return `${profileUrl}child/${childId}`;
};

const ProfileRoute = () => {
  const { t } = useTranslation();
  const profileRouteBasePath = '/:locale/profile';
  const childRouteRootPath = '/child/:childId';
  const match = useMatch(`${profileRouteBasePath}${childRouteRootPath}/*`);
  const childId = match?.params.childId;
  const [queryIsChildOfProfile] = useIsChildOfProfile();
  const getPathname = useGetPathname();
  return (
    <Routes>
      <Route
        index
        element={
          <AppRoute
            title={t('profile.heading')}
            element={<Profile />}
            path={`${appRoutes.profile.path}/*`}
          />
        }
      />
      <Route
        path={`${childRouteRootPath}/*`}
        element={
          <ProtectedRoute
            isAuthorized={() => queryIsChildOfProfile(childId)}
            redirectTo={getPathname('/wrong-login-method')}
            element={<ProfileChildRoutes />}
          />
        }
      />
    </Routes>
  );
};
export default ProfileRoute;
