import React, { useEffect } from 'react';
import { Route, RouteProps, useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import {
  isLoadingUserSelector,
  isAuthenticatedSelector,
} from '../auth/state/AuthenticationSelectors';
import { loginTunnistamo } from '../auth/authenticate';

function useAuthenticated(enabled = true) {
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const isLoadingUser = useSelector(isLoadingUserSelector);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!isLoadingUser && !isAuthenticated && enabled) {
      history.replace('/home', { from: location });
    }
  }, [isAuthenticated, enabled, history, location, isLoadingUser]);
}

function useInstantLogin(enabled = true) {
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const location = useLocation();

  useEffect(() => {
    const justLoggedOutCookie = document.cookie
      .split(';')
      .some((item) => item.includes('loggedOut=1'));

    if (enabled && !justLoggedOutCookie && !isAuthenticated) {
      // If user opens an invitation link from an email, we want to log them in and
      // redirect to the invitation.
      loginTunnistamo(location?.pathname);
    }
  }, [enabled, isAuthenticated, location]);

  useEffect(() => {
    document.cookie = 'loggedOut=0';
  });
}

type Props = RouteProps & {
  isPrivate?: boolean;
};

function AppRoute({
  isPrivate = false,
  render,
  component,
  ...routeProps
}: Props) {
  // Note that instant login should be checked first so that it has
  // access to the path the user attempted to navigate to.
  //
  // For instance, the useAuthenticated hook replaces the current path,
  // in which case the original navigation target would be lost.
  useInstantLogin(isPrivate);
  useAuthenticated(isPrivate);
  const isLoadingUser = useSelector(isLoadingUserSelector);

  if (render) {
    // eslint-disable-next-line no-console
    console.warn(
      'Render support is not implemented in AppRoute! Implement it or use the component prop.'
    );
  }

  return (
    <Route
      {...routeProps}
      render={(routeRenderProps) => (
        <LoadingSpinner isLoading={isLoadingUser}>
          {/* @ts-ignore */}
          {React.createElement(component, routeRenderProps)}
        </LoadingSpinner>
      )}
    />
  );
}

export default AppRoute;
