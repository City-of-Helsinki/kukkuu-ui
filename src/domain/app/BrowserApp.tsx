import React, { FunctionComponent } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Router } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import { ToastContainer } from 'react-toastify';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';
import { ConfigProvider } from 'react-helsinki-headless-cms';
import { History } from 'history';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { ScrollToTop } from '../../common/route/RouteUtils';
import useSyncLanguageBetweenI18nAndReactRouter from '../../common/route/useSyncLanguageBetweenI18nAndReactRouter';
import AriaLiveProvider from '../../common/AriaLive/AriaLiveProvider';
import graphqlClient from '../api/client';
import enableOidcLogging from '../auth/enableOidcLogging';
import userManager from '../auth/userManager';
import HeadlessCmsPage from '../headlessCms/HeadlessCmsPage';
import { persistor, store } from './state/AppStore';
import App from './App';
import appRoutes from './appRoutes';
import useRHHCConfig from '../../hooks/useRHHCConfig';

if (process.env.NODE_ENV === 'development') {
  enableOidcLogging();
}

// TODO maybe: Variables for these:
const instance = createInstance({
  urlBase: 'https://analytics.hel.ninja/',
  siteId: 56,
});

// Prevent non-production data from being submitted to Matomo
// by pretending to require consent to process analytics data and never ask for it.
// https://developer.matomo.org/guides/tracking-javascript-guide#step-1-require-consent
if (process.env.REACT_APP_ENVIRONMENT !== 'production') {
  window._paq.push(['requireConsent']);
}

const pathsWithAppLayout = Object.values(appRoutes).map(
  ({ path, exact = false }) => (exact ? path : `${path}*`)
) as string[];

// Export for testing purpose
export const AppRoutes: FunctionComponent = () => {
  useSyncLanguageBetweenI18nAndReactRouter();

  return (
    <Switch>
      {/* Try to find from app specific pages. */}
      <Route exact path={pathsWithAppLayout} component={App} />
      {/* If not found, try to find from the CMS. */}
      {/* Also handles not found pages. */}
      <Route path="*" component={HeadlessCmsPage} />
    </Switch>
  );
};

type Props = {
  history: History;
};

const BrowserApp: FunctionComponent<Props> = ({ history }) => {
  const config = useRHHCConfig();

  return (
    <AriaLiveProvider>
      <Provider store={store}>
        <PersistGate
          loading={<LoadingSpinner isLoading={true} />}
          persistor={persistor}
        >
          <OidcProvider store={store} userManager={userManager}>
            <ApolloProvider client={graphqlClient}>
              <ConfigProvider config={config}>
                <Router history={history}>
                  <ScrollToTop />
                  <MatomoProvider value={instance}>
                    <AppRoutes />
                  </MatomoProvider>
                </Router>
              </ConfigProvider>
            </ApolloProvider>
          </OidcProvider>
        </PersistGate>
        <ToastContainer />
      </Provider>
    </AriaLiveProvider>
  );
};

export default BrowserApp;
