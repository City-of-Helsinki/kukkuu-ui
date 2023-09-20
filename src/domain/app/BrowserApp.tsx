import { FunctionComponent } from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import { ToastContainer } from 'react-toastify';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';
import { ConfigProvider } from 'react-helsinki-headless-cms';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { ScrollToTop } from '../../common/route/RouteUtils';
import AriaLiveProvider from '../../common/AriaLive/AriaLiveProvider';
import graphqlClient from '../api/client';
import enableOidcLogging from '../auth/enableOidcLogging';
import userManager from '../auth/userManager';
import { persistor, store } from './state/AppStore';
import App from './App';
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

const BrowserApp: FunctionComponent = () => {
  const config = useRHHCConfig();

  return (
    <AriaLiveProvider>
      <Provider store={store}>
        <PersistGate
          loading={<LoadingSpinner isLoading={true} />}
          persistor={persistor}
        >
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore Property 'children' does not exist on type */}
          <OidcProvider store={store} userManager={userManager}>
            <ApolloProvider client={graphqlClient}>
              <ConfigProvider config={config}>
                <BrowserRouter>
                  <ScrollToTop />
                  <MatomoProvider value={instance}>
                    <App />
                  </MatomoProvider>
                </BrowserRouter>
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
