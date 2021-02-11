import { Route, Switch, Redirect, useParams } from 'react-router';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

import Home from '../home/Home';
import NotFound from './notFound/NotFound';
import NotEligible from '../registration/notEligible/NotEligible';
import PrivateRoute from '../auth/route/PrivateRoute';
import WrongLoginMethod from '../auth/WrongLoginMethod';
import RegistrationForm from '../registration/form/RegistrationForm';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import {
  isLoadingUserSelector,
  mustRenewApiTokenSelector,
  userSelector,
} from '../auth/state/AuthenticationSelectors';
import Welcome from '../registration/welcome/Welcome';
import AccessibilityStatement from '../accessibilityStatement/AccessibilityStatement';
import { userHasProfileSelector } from '../registration/state/RegistrationSelectors';
import TermsOfService from '../termsOfService/TermsOfService';
import { authenticateWithBackend } from '../auth/authenticate';
import { isSessionExpiredPromptOpen } from './state/ui/UISelectors';
import {
  tokenFetched,
  fetchTokenError,
} from '../auth/state/BackendAuthenticationActions';
import ProfileRoute from '../profile/route/ProfileRoute';
import EventRoute from '../event/route/EventRoute';
import SessionAlert from './sessionAlert/SessionAlert';
import useHashAnchorLinks from './useHashAnchorLinks';
import AppTitleAnnouncer from './AppTitleAnnouncer';

const App = () => {
  useHashAnchorLinks();

  const isLoadingUser = useSelector(isLoadingUserSelector);
  const { locale } = useParams<{ locale: string }>();
  const userHasProfile = useSelector(userHasProfileSelector);
  const isSessionPromptOpen = useSelector(isSessionExpiredPromptOpen);
  const mustRenewApiToken = useSelector(mustRenewApiTokenSelector);
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  useEffect(() => {
    if (!mustRenewApiToken) {
      dispatch(tokenFetched());
      // Start fetching apiToken when logged in
    } else if (user?.access_token && mustRenewApiToken) {
      dispatch(authenticateWithBackend(user.access_token));
    } else {
      // No access token, usually first time user
      // Dispatch this as last resort to close the spinner
      // And end authentication part.
      dispatch(
        fetchTokenError({
          message: 'No access token',
          name: 'fetchTokenError',
        })
      );
    }
  }, [mustRenewApiToken, dispatch, user]);

  return (
    <>
      <AppTitleAnnouncer />
      <LoadingSpinner isLoading={isLoadingUser}>
        {isSessionPromptOpen && <SessionAlert isOpen={isSessionPromptOpen} />}
        <Switch>
          <Redirect exact path={`/${locale}/`} to={`/${locale}/home`} />
          <Route exact path={`/${locale}/home`} component={Home} />
          <Route
            exact
            path={`/${locale}/registration/not-eligible`}
            component={NotEligible}
          />
          <Route
            exact
            path={`/${locale}/wrong-login-method`}
            component={WrongLoginMethod}
          />
          <Route
            exact
            path={`/${locale}/accessibility`}
            component={AccessibilityStatement}
          />
          <Route exact path={`/${locale}/terms`} component={TermsOfService} />
          {!userHasProfile && (
            <PrivateRoute exact path={`/${locale}/registration/form`}>
              <RegistrationForm />
            </PrivateRoute>
          )}
          <PrivateRoute exact path={`/${locale}/registration/success`}>
            <Welcome />
          </PrivateRoute>

          <PrivateRoute path={`/${locale}/profile`}>
            <ProfileRoute />
          </PrivateRoute>

          <PrivateRoute path={`/${locale}/event`}>
            <EventRoute />
          </PrivateRoute>

          {userHasProfile && <Redirect to={`/${locale}/profile`} />}

          <Route component={NotFound} />
        </Switch>
      </LoadingSpinner>
    </>
  );
};

export default App;
