import { ApolloProvider } from '@apollo/client';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import {
  MatomoProvider,
  createInstance as createMatomoInstance,
} from '@jonkoops/matomo-tracker-react';
import { ConfigProvider } from 'react-helsinki-headless-cms';
import React from 'react';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import AriaLiveProvider from '../../common/AriaLive/AriaLiveProvider';
import graphqlClient from '../api/client';
import { persistor, store } from './state/AppStore';
import useRHHCConfig from '../../hooks/useRHHCConfig';
import browserRouter from './routes/browserRouter';
import { CookieConfigProvider } from '../../common/components/cookieConfigProvider';
import KukkuuHDSLoginProvider from '../auth/KukkuuHDSLoginProvider';
import ProfileProvider from '../profile/ProfileProvider';

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

type BrowserAppProps = {
  cookieDomain: string;
};

const BrowserApp: React.FunctionComponent<BrowserAppProps> = ({
  cookieDomain,
}) => {
  const config = useRHHCConfig();
  return (
    <CookieConfigProvider cookieDomain={cookieDomain}>
      <AriaLiveProvider>
        <Provider store={store}>
          <PersistGate
            loading={<LoadingSpinner isLoading={true} />}
            persistor={persistor}
          >
            <ApolloProvider client={graphqlClient}>
              <KukkuuHDSLoginProvider>
                <ProfileProvider>
                  <ConfigProvider config={config}>
                    <MatomoProvider value={matomoInstance}>
                      <RouterProvider router={browserRouter} />
                    </MatomoProvider>
                  </ConfigProvider>
                </ProfileProvider>
              </KukkuuHDSLoginProvider>
            </ApolloProvider>
          </PersistGate>
          <ToastContainer />
        </Provider>
      </AriaLiveProvider>
    </CookieConfigProvider>
  );
};

export default BrowserApp;
