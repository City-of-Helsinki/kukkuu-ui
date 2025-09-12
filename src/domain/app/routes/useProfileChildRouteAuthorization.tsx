import { useLocation, useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import useIsChildOfProfile from '../../profile/route/useIsChildOfProfile';
import { useAuthorization } from '../../auth/useAuthorization';
import { useProfileContext } from '../../profile/hooks/useProfileContext';

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
  const {
    profile,
    isLoading: isProfileLoading,
    isFetchCalled: isProfileFetchCalled,
  } = useProfileContext();
  const queryIsChildOfProfile = useIsChildOfProfile();
  // If the child id is not given,
  // the authorization is fixed to true,
  // but the loading is fixed to false.
  const [loadingIsAuthorized, isAuthorized] = useAuthorization(
    childId ? () => queryIsChildOfProfile(childId) : true
  );
  const navigate = useNavigate();

  useEffect(() => {
    // If the childId is not given, the permission is not needed.
    // If the isAuthorized is set to false with the loading, it means that the check is done!
    if (
      profile &&
      childId &&
      isProfileFetchCalled &&
      !isAuthorized &&
      !loadingIsAuthorized &&
      !isProfileLoading
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        // eslint-disable-next-line max-len
        'The user should be navigated away from child page, since the user was not authorized to view the content',
        {
          profile,
          childId,
          isProfileFetchCalled,
          isAuthorized,
          loadingIsAuthorized,
          isProfileLoading,
          pathname: location.pathname,
        }
      );
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
    }
  }, [
    childId,
    getPathname,
    isAuthorized,
    isProfileFetchCalled,
    isProfileLoading,
    loadingIsAuthorized,
    location,
    navigate,
    profile,
  ]);

  useEffect(() => {
    if (
      childId &&
      !profile &&
      !isProfileLoading &&
      !loadingIsAuthorized &&
      !location.pathname.includes(unauthorizedPath) // prevent forever loop
    ) {
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
  }, [
    childId,
    getPathname,
    isProfileLoading,
    loadingIsAuthorized,
    location,
    navigate,
    profile,
  ]);

  return {
    loading: loadingIsAuthorized,
    isAuthorized,
  };
};
