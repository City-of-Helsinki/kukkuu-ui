import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { loginTunnistamo } from './authenticate';
import { isSessionExpiredPromptOpenSelector } from '../app/state/ui/UISelectors';
import { isAuthenticatedSelector } from './state/AuthenticationSelectors';

function useInstantLogin(enabled = true) {
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const location = useLocation();
  const isSessionExpiredPromptOpen = useSelector(
    isSessionExpiredPromptOpenSelector
  );

  useEffect(() => {
    const justLoggedOutCookie = document.cookie
      .split(';')
      .some((item) => item.includes('loggedOut=1'));

    if (
      enabled &&
      !justLoggedOutCookie &&
      !isAuthenticated &&
      !isSessionExpiredPromptOpen
    ) {
      // If user opens an invitation link from an email, we want to log them in and
      // redirect to the invitation.
      loginTunnistamo(location?.pathname);
    }
  }, [enabled, isAuthenticated, location, isSessionExpiredPromptOpen]);

  useEffect(() => {
    document.cookie = 'loggedOut=0';
  });
}

export default useInstantLogin;
