import {
  Route,
  Switch,
  RouteComponentProps,
  Redirect,
  useParams,
} from 'react-router';
import React, { FunctionComponent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from 'redux-oidc';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import 'react-toastify/dist/ReactToastify.css';

import Home from '../home/Home';
import NotFound from './notFound/NotFound';
import NotEligible from '../registration/notEligible/NotEligible';
import PrivateRoute from '../auth/route/PrivateRoute';
import RegistrationForm from '../registration/form/RegistrationForm';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import {
  isLoadingUserSelector,
  isAuthenticatedSelector,
} from '../auth/state/AuthenticationSelectors';
import { store } from './state/AppStore';
import userManager from '../auth/userManager';
import i18n from '../../common/translation/i18n/i18nInit';
import Welcome from '../registration/welcome/Welcome';
import Profile from '../profile/Profile';
import AccessibilityStatement from '../accessibilityStatement/AccessibilityStatement';
import { authenticateWithBackend } from '../auth/authenticate';
import { fetchTokenError } from '../auth/state/BackendAuthenticationActions';

type AppProps = RouteComponentProps<{ locale: string }>;

const App: FunctionComponent<AppProps> = () => {
  const isLoadingUser = useSelector(isLoadingUserSelector);
  const { locale } = useParams<{
    locale: string;
  }>();

  const dispatch = useDispatch();

  const isAuthenticated = useSelector(isAuthenticatedSelector);

  useEffect(() => {
    if (!isAuthenticated) {
      loadUser(store, userManager)
        .then(user => {
          if (user.access_token) {
            dispatch(authenticateWithBackend(user.access_token));
          } else {
            dispatch(
              fetchTokenError({
                name: 'fetchTokenError',
                message: 'No user found',
              })
            );
          }
        })
        .catch(error => {
          // TODO: Clear oidc local storage when this happens.
          toast(i18n.t('authentication.loadUserError.message'), {
            type: toast.TYPE.ERROR,
          });
          dispatch(fetchTokenError(error));
          Sentry.captureException(error);
        });
    }
  }, [dispatch, isAuthenticated]);

  return (
    <LoadingSpinner isLoading={isLoadingUser}>
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
        <PrivateRoute exact path={`/${locale}/registration/form`}>
          <RegistrationForm />
        </PrivateRoute>
        <PrivateRoute exact path={`/${locale}/registration/success`}>
          <Welcome />
        </PrivateRoute>
        <PrivateRoute path={`/${locale}/profile`}>
          <Profile />
        </PrivateRoute>
        <Route component={NotFound} />
      </Switch>
    </LoadingSpinner>
  );
};

export default App;
