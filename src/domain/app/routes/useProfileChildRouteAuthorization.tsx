import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import useIsChildOfProfile from '../../profile/route/useIsChildOfProfile';
import { useAuthorization } from '../../auth/useAuthorization';
import { isLoggedInSelector } from '../../auth/state/AuthenticationSelectors';

const unauthorizedPath = '/unauthorized';
const wrongCredentialsPath = '/wrong-login-method';

/**
 * Check if the child belongs to the profile and redirects away
 * from the page that the user was forbidden to access to.
 * */
export const useProfileChildRouteAuthorization = () => {
  const { childId } = useParams<{ childId?: string }>();
  const getPathname = useGetPathname();
  const location = useLocation();
  const [queryIsChildOfProfile] = useIsChildOfProfile();
  // If the child id is not given,
  // the authorization is fixed to true,
  // but the loading is diex to false.
  const [loading, isAuthorized] = useAuthorization(
    childId ? () => queryIsChildOfProfile(childId) : true
  );
  const isLoggedIn = useSelector(isLoggedInSelector);
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
      if (isLoggedIn) {
        // eslint-disable-next-line no-console
        console.info(
          `The user is logged in, but unauthorized to view the page. Redirect to '${wrongCredentialsPath}'.`
        );
        navigate(
          {
            pathname: getPathname(wrongCredentialsPath),
          },
          { state: { from: location } }
        );
      } else {
        // eslint-disable-next-line no-console
        console.info(
          `The user is not logged in. Redirect to '${unauthorizedPath}'.`
        );
        navigate(
          {
            pathname: getPathname(unauthorizedPath),
            search: `?next=${location.pathname}`,
          },
          { state: { from: location } }
        );
      }
    }
  }, [
    childId,
    getPathname,
    isAuthorized,
    isLoggedIn,
    loading,
    location,
    navigate,
  ]);
};
