import {
  Route,
  Switch,
  RouteComponentProps,
  Redirect,
  useParams,
} from 'react-router';
// eslint-disable-next-line import/order
import React, { FunctionComponent } from 'react';

import 'react-toastify/dist/ReactToastify.css';

import { useQuery } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';

import Home from '../home/Home';
import NotFound from './notFound/NotFound';
import NotEligible from '../registration/notEligible/NotEligible';
import PrivateRoute from '../auth/route/PrivateRoute';
import RegistrationForm from '../registration/form/RegistrationForm';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { isLoadingUserSelector } from '../auth/state/AuthenticationSelectors';
import Welcome from '../registration/welcome/Welcome';
import Profile from '../profile/Profile';
import AccessibilityStatement from '../accessibilityStatement/AccessibilityStatement';
import profileQuery from '../profile/queries/ProfileQuery';
import { profileQuery as ProfileQueryType } from '../api/generatedTypes/profileQuery';
import { saveProfile } from '../profile/state/ProfileActions';

type AppProps = RouteComponentProps<{ locale: string }>;

const App: FunctionComponent<AppProps> = () => {
  const isLoadingUser = useSelector(isLoadingUserSelector);
  const { locale } = useParams<{
    locale: string;
  }>();

  const { loading, data } = useQuery<ProfileQueryType>(profileQuery);

  const dispatch = useDispatch();

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (data?.myProfile) {
    dispatch(saveProfile(data.myProfile));
  }

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
