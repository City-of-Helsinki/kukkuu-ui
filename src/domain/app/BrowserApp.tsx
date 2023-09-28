import { FunctionComponent } from 'react';
import { ApolloProvider } from '@apollo/client';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import { ToastContainer } from 'react-toastify';
import {
  MatomoProvider,
  createInstance as createMatomoInstance,
} from '@jonkoops/matomo-tracker-react';
import { ConfigProvider } from 'react-helsinki-headless-cms';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import AriaLiveProvider from '../../common/AriaLive/AriaLiveProvider';
import graphqlClient from '../api/client';
import enableOidcLogging from '../auth/enableOidcLogging';
import userManager from '../auth/userManager';
import { persistor, store } from './state/AppStore';
import useRHHCConfig from '../../hooks/useRHHCConfig';
import browserRouter from './routes/browserRouter';

if (import.meta.env.NODE_ENV === 'development') {
  enableOidcLogging();
}

// TODO maybe: Variables for these:
const matomoInstance = createMatomoInstance({
  urlBase: 'https://analytics.hel.ninja/',
  siteId: 56,
});

// Prevent non-production data from being submitted to Matomo
// by pretending to require consent to process analytics data and never ask for it.
// https://developer.matomo.org/guides/tracking-javascript-guide#step-1-require-consent
if (import.meta.env.VITE_ENVIRONMENT !== 'production') {
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
                <MatomoProvider value={matomoInstance}>
                  <RouterProvider router={browserRouter} />
                </MatomoProvider>
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
