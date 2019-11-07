import { Route, Switch, RouteComponentProps, Redirect } from 'react-router';
import React from 'react';
import { connect } from 'react-redux';
import { loadUser } from 'redux-oidc';

import Home from '../home/Home';
import NotFound from '../notFound/NotFound';
import {
  changeLanguage,
  getCurrentLanguage,
} from '../../common/translation/utils';
import PrivateRoute from '../auth/route/PrivateRoute';
import RegistrationForm from '../registration/form/RegistrationForm';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { StoreState } from './types/AppTypes';
import { isLoadingUserSelector } from '../auth/state/AuthenticationSelectors';
import { store } from './state/AppStore';
import userManager from '../auth/userManager';
import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import { authenticateWithBackend } from '../auth/authenticate';

class App extends React.Component<
  RouteComponentProps<{ locale: SUPPORT_LANGUAGES }> & {
    isLoadingUser: boolean;
    fetchApiToken: (accessToken: string) => void;
  }
> {
  componentDidMount() {
    const {
      match: {
        params: { locale },
      },
    } = this.props;

    const currentLocale = getCurrentLanguage();
    if (currentLocale !== locale) {
      changeLanguage(locale);
    }

    loadUser(store, userManager).then(user => {
      if (user) {
        this.props.fetchApiToken(user.access_token);
      }

      // TODO: add error handler
    });
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
};

export const UnconnectedApp = App;
export default connect(
  mapStateToProps,
  actions
)(App);
