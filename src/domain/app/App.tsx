import { Route, Switch, Redirect, useParams } from 'react-router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from 'redux-oidc';
import { toast } from 'react-toastify';
// eslint-disable-next-line import/order
import * as Sentry from '@sentry/browser';
import 'react-toastify/dist/ReactToastify.css';

import { useQuery } from '@apollo/react-hooks';

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
import { authenticateWithBackend } from '../auth/authenticate';
import { fetchTokenError } from '../auth/state/BackendAuthenticationActions';
import Welcome from '../registration/welcome/Welcome';
import Profile from '../profile/Profile';
import AccessibilityStatement from '../accessibilityStatement/AccessibilityStatement';
import TermsOfService from '../termsOfService/TermsOfService';
import profileQuery from '../profile/queries/ProfileQuery';
import { clearProfile, saveProfile } from '../profile/state/ProfileActions';
import { profileQuery as ProfileQueryType } from '../api/generatedTypes/profileQuery';

const App: React.FunctionComponent = () => {
  const { locale } = useParams<{ locale: string }>();
  const isLoadingUser = useSelector(isLoadingUserSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);

  const { loading, error, data } = useQuery<ProfileQueryType>(profileQuery, {
    skip: !isAuthenticated,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    loadUser(store, userManager)
      .then(user => {
        if (user) {
          dispatch(authenticateWithBackend(user.access_token || ''));
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
  }, [dispatch]);

  if (!data || error) {
    dispatch(clearProfile());
  }
  if (data?.myProfile) {
    dispatch(saveProfile(data.myProfile));
  }

  const userHasProfile = !!data?.myProfile;

  return (
    <LoadingSpinner isLoading={isLoadingUser || loading}>
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
          <Profile />
        </PrivateRoute>

        {userHasProfile && <Redirect to={`/${locale}/profile`} />}

        <Route component={NotFound} />
      </Switch>
    </LoadingSpinner>
  );
};

export default App;
