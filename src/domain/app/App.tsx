import { Route, Switch, RouteComponentProps, Redirect } from 'react-router';
import React from 'react';
import { connect } from 'react-redux';
import { loadUser } from 'redux-oidc';

import Home from '../home/Home';
import NotFound from '../notFound/NotFound';
import PrivateRoute from '../auth/route/PrivateRoute';
import RegistrationForm from '../registration/form/RegistrationForm';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { StoreState } from './types/AppTypes';
import { isLoadingUserSelector } from '../auth/state/AuthenticationSelectors';
import { store } from './state/AppStore';
import userManager from '../auth/userManager';
import { authenticateWithBackend } from '../auth/authenticate';
import { fetchTokenError } from '../auth/state/BackendAuthenticationActions';

type AppProps = RouteComponentProps<{ locale: string }> & {
  isLoadingUser: boolean;
  fetchApiToken: (accessToken: string) => void;
  fetchApiTokenError: (errors: object) => void;
};

class App extends React.Component<AppProps> {
  componentDidMount() {
    loadUser(store, userManager)
      .then(user => {
        if (user) {
          this.props.fetchApiToken(user.access_token || '');
        } else {
          this.props.fetchApiTokenError({ message: 'No user found' });
        }
      })
      .catch(error => this.props.fetchApiTokenError(error));
  }

  public render() {
    const {
      isLoadingUser,
      match: {
        params: { locale },
      },
    } = this.props;

    return (
      <LoadingSpinner isLoading={isLoadingUser}>
        <Switch>
          <Redirect exact path={`/${locale}/`} to={`/${locale}/home`} />
          <Route exact path={`/${locale}/home`} component={Home} />
          <PrivateRoute exact path={`/${locale}/registration/form`}>
            <RegistrationForm />
          </PrivateRoute>
          <Route component={NotFound} />
        </Switch>
      </LoadingSpinner>
    );
  }
}

const mapStateToProps = (state: StoreState) => ({
  isLoadingUser: isLoadingUserSelector(state),
});

const actions = {
  fetchApiToken: authenticateWithBackend,
  fetchApiTokenError: fetchTokenError,
};

export const UnconnectedApp = App;
export default connect(
  mapStateToProps,
  actions
)(App);
