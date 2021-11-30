import { createElement, useEffect } from 'react';
import { Route, RouteProps, useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import {
  isLoadingUserSelector,
  isAuthenticatedSelector,
} from '../auth/state/AuthenticationSelectors';
import { loginTunnistamo } from '../auth/authenticate';
import { isSessionExpiredPromptOpenSelector } from './state/ui/UISelectors';

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

type Props = RouteProps & {
  isPrivate?: boolean;
  title?: string;
  noTitle?: boolean;
};

function AppRoute({
  isPrivate = false,
  title,
  noTitle,
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
  const { t } = useTranslation();

  if (render) {
    // eslint-disable-next-line no-console
    console.warn(
      'Render support is not implemented in AppRoute! Implement it or use the component prop.'
    );
  }

  if (!title && !noTitle) {
    // eslint-disable-next-line no-console
    console.warn(
      // eslint-disable-next-line max-len
      'Most app routes should have a title. If a route does not need one, explicitly state is by toggling the noTitle prop.'
    );
  }

  return (
    <>
      <Helmet>
        {title && (
          <title>
            {title} - {t('appName')}
          </title>
        )}
      </Helmet>
      <Route
        {...routeProps}
        render={(routeRenderProps) => (
          <LoadingSpinner isLoading={isLoadingUser}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {createElement(component, routeRenderProps)}
          </LoadingSpinner>
        )}
      />
    </>
  );
}

export default AppRoute;
