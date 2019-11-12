import React, { FunctionComponent } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import { useTranslation } from 'react-i18next';

import App from './App';
import graphqlClient from '../api/client';
import enableOidcLogging from '../auth/enableOidcLogging';
import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import userManager from '../auth/userManager';
import PageLayout from './layout/Layout';
import { persistor, store } from './state/AppStore';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import OidcCallback from '../auth/OidcCallback';

const localeParam = `:locale(${SUPPORT_LANGUAGES.EN}|${SUPPORT_LANGUAGES.FI}|${SUPPORT_LANGUAGES.SV})`;

if (process.env.NODE_ENV !== 'production') {
  enableOidcLogging();
}

// Export for testing purpose
export const AppRoutes: FunctionComponent = () => {
  const { i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  return (
    <PageLayout>
      <Switch>
        <Route
          path="/silent_renew"
          render={() => {
            userManager.signinSilentCallback();
            return null;
          }}
        />
        <Route exact path="/callback" component={OidcCallback} />
        <Redirect exact path="/" to={`/${currentLocale}/home`} />
        <Route path={`/${localeParam}/*`} component={App} />
        <Route
          render={props => {
            return (
              <Redirect to={`/${currentLocale}${props.location.pathname}`} />
            );
          }}
        />
      </Switch>
    </PageLayout>
  );
};
const BrowserApp: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingSpinner isLoading={true} />}
        persistor={persistor}
      >
        <OidcProvider store={store} userManager={userManager}>
          <ApolloProvider client={graphqlClient}>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ApolloProvider>
        </OidcProvider>
      </PersistGate>
    </Provider>
  );
};

export default BrowserApp;
