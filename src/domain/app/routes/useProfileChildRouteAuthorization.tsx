import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import useIsChildOfProfile from '../../profile/route/useIsChildOfProfile';
import { useAuthorization } from '../../auth/useAuthorization';

const pathOnError = '/wrong-login-method';

/**
 * Check if the child belongs to the profile and redirects away
 * from the page that the user was forbidden to access to.
 * */
export const useProfileChildRouteAuthorization = () => {
  const { childId } = useParams<{ childId?: string }>();
  const getPathname = useGetPathname();
  const redirectTo = getPathname(pathOnError);
  const location = useLocation();
  const [queryIsChildOfProfile] = useIsChildOfProfile();
  // If the child id is not given,
  // the authorization is fixed to true,
  // but the loading is diex to false.
  const [loading, isAuthorized] = useAuthorization(
    childId ? () => queryIsChildOfProfile(childId) : true
  );
  const navigate = useNavigate();

  useEffect(() => {
    // If the childId is not given, the permission is not needed.
    // If the isAuthorized is set to false with the loading, it means that the check is done!
    if (childId && !loading && !isAuthorized) {
      // eslint-disable-next-line no-console
      console.warn(
        'Navigating away from child page, since the user was not authorized to view the content',
        { childId, isAuthorized, pathname: location.pathname }
      );
      navigate(
        {
          pathname: redirectTo,
        },
        { state: { from: location } }
      );
    }
  }, [childId, isAuthorized, loading, location, navigate, redirectTo]);
};
