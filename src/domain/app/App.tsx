import { Route, Switch, RouteComponentProps, Redirect } from 'react-router';
import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import Home from '../home/Home';
import NotFound from '../notFound/NotFound';
import { changeLanguage } from '../../common/translation/utils';
import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import PrivateRoute from '../auth/route/PrivateRoute';
import RegistrationForm from '../registration/form/RegistrationForm';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { StoreState } from './types/stateTypes';
import { isLoadingUserSelector } from '../auth/state/authSelectors';
const App: FunctionComponent<
  RouteComponentProps<{ locale: SUPPORT_LANGUAGES }> & {
    isLoadingUser: boolean;
  }
> = ({
  match: {
    params: { locale },
  },
  isLoadingUser,
}) => {
  changeLanguage(locale);

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
};

const mapStateToProps = (state: StoreState) => ({
  isLoadingUser: isLoadingUserSelector(state),
});

export const UnconnectedApp = App;
export default connect(mapStateToProps)(App);
