import React, { FunctionComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';

import App from './App';
import userManager from '../auth/userManager';
import enableOidcLogging from '../auth/enableOidcLogging';
import OidcCallback from '../auth/OidcCallback';
import { SUPPORT_LANGUAGES } from '../../common/translation/constants';
import { persistor, store } from './state/AppStore';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';

const localeParam = `:locale(${SUPPORT_LANGUAGES.EN}|${SUPPORT_LANGUAGES.FI}|${SUPPORT_LANGUAGES.SV})`;

if (process.env.NODE_ENV !== 'production') {
  enableOidcLogging();
}

// Export for testing purpose
export const appRoutes = (
  <Switch>
    <Route
      path="/silent_renew"
      render={() => {
        userManager.signinSilentCallback();
        return null;
      }}
    />
    <Route exact path="/callback" component={OidcCallback} />
    <Redirect exact path="/" to="/fi/home" />
    <Route path={`/${localeParam}/*`} component={App} />
    <Route exact path={`/${localeParam}/callback`} component={OidcCallback} />
    <Route
      render={props => <Redirect to={`/fi${props.location.pathname}`} />}
    />
  </Switch>
);
const BrowserApp: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingSpinner isLoading={true} />}
        persistor={persistor}
      >
        <OidcProvider store={store} userManager={userManager}>
          <BrowserRouter>{appRoutes}</BrowserRouter>
        </OidcProvider>
      </PersistGate>
    </Provider>
  );
};

export default BrowserApp;
