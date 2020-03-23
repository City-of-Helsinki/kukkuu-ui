import { Route, Switch, Redirect, useParams } from 'react-router';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

import Home from '../home/Home';
import NotFound from './notFound/NotFound';
import NotEligible from '../registration/notEligible/NotEligible';
import PrivateRoute from '../auth/route/PrivateRoute';
import RegistrationForm from '../registration/form/RegistrationForm';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import {
  isLoadingUserSelector,
  apiTokenSelector,
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

const App: React.FunctionComponent = (props) => {
  const isLoadingUser = useSelector(isLoadingUserSelector);
  const { locale } = useParams<{ locale: string }>();
  const userHasProfile = useSelector(userHasProfileSelector);
  const isSessionPromptOpen = useSelector(isSessionExpiredPromptOpen);
  const apiToken = useSelector(apiTokenSelector);
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  useEffect(() => {
    if (apiToken) {
      // Skip token fetch if token already existed
      dispatch(tokenFetched());

      // If no token but access token is ready for exchange
      // start to fetch apiToken
    } else if (user?.access_token) {
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
    // TODO: useEffect subscribe for changes from apiToken and user data
    // When silent-renew is fixed here in KK-261
    // !apiToken can be removed so silent-renew will auto make api token exchange
  }, [apiToken, dispatch, user]);

  return (
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
  );
};

export default App;
