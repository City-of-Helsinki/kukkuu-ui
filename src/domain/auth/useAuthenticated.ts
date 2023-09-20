import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux/es/hooks/useSelector';

import useGetPathname from '../../common/route/utils/useGetPathname';
import {
  isAuthenticatedSelector,
  isLoadingUserSelector,
} from './state/AuthenticationSelectors';

function useAuthenticated(enabled = true) {
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const isLoadingUser = useSelector(isLoadingUserSelector);
  const navigate = useNavigate();
  const location = useLocation();
  const getPathname = useGetPathname();

  useEffect(() => {
    if (!isLoadingUser && !isAuthenticated && enabled) {
      navigate(getPathname('/home'), { replace: true, state: location });
    }
  }, [
    isAuthenticated,
    enabled,
    location,
    isLoadingUser,
    getPathname,
    navigate,
  ]);

  return !enabled || (!isLoadingUser && isAuthenticated);
}

export default useAuthenticated;
