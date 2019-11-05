import React, { FunctionComponent } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';

import App from './App';
import graphqlClient from '../api/client';
import enableOidcLogging from '../auth/enableOidcLogging';
import OidcCallback from '../auth/OidcCallback';
import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import userManager from '../auth/userManager';
import PageLayout from './layout/Layout';
import { persistor, store } from './state/AppStore';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';

const localeParam = `:locale(${SUPPORT_LANGUAGES.EN}|${SUPPORT_LANGUAGES.FI}|${SUPPORT_LANGUAGES.SV})`;

if (process.env.NODE_ENV !== 'production') {
  enableOidcLogging();
}

// Export for testing purpose
export const appRoutes = (
  <PageLayout>
    <Switch>
      <Route exact path="/callback" component={OidcCallback} />
      <Redirect exact path="/" to="/fi/home" />
      <Route path={`/${localeParam}/*`} component={App} />
      <Route exact path={`/${localeParam}/callback`} component={OidcCallback} />
      <Route
        render={props => <Redirect to={`/fi${props.location.pathname}`} />}
      />
    </Switch>
  </PageLayout>
);
const BrowserApp: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingSpinner isLoading={true} />}
        persistor={persistor}
      >
        <OidcProvider store={store} userManager={userManager}>
          <ApolloProvider client={graphqlClient}>
            <BrowserRouter>{appRoutes}</BrowserRouter>
          </ApolloProvider>
        </OidcProvider>
      </PersistGate>
    </Provider>
  );
};

export default BrowserApp;
