import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import {
  ConfigProvider as RHHCConfigProvider,
  defaultConfig as rhhcDefaultConfig,
  Config as RHHCConfig,
} from 'react-helsinki-headless-cms';
import { ApolloClient } from '@apollo/client/core/ApolloClient';
import { useApolloClient } from '@apollo/client/react/hooks/useApolloClient';

import type { RouterType } from './types';
import { store } from '../../domain/app/state/AppStore';
import ProfileProvider from '../../domain/profile/ProfileProvider';
import KukkuuHDSLoginProvider from '../../domain/auth/KukkuuHDSLoginProvider';
import IdleTimer from '../../domain/auth/IdleTimerProvider';

type Props = {
  children: ReactElement | ReactNode;
  // eslint-disable-next-line react/no-unused-prop-types
  mocks?: MockedResponse[];
  // eslint-disable-next-line react/no-unused-prop-types
  router?: RouterType;
};

const TestProviders = (props: Props) => {
  const { children, mocks, router = 'BrowserRouter' } = props;
  return (
    <Provider store={store}>
      <MockedProvider mocks={mocks}>
        <KukkuuHDSLoginProvider>
          <IdleTimer>
            <ProfileProvider>
              <RHHCConfigProviderWithMockedApolloClient {...props}>
                <HelmetProvider>
                  {router === 'MemoryRouter' ? (
                    <MemoryRouter>{children}</MemoryRouter>
                  ) : (
                    <BrowserRouter>{children}</BrowserRouter>
                  )}
                </HelmetProvider>
              </RHHCConfigProviderWithMockedApolloClient>
            </ProfileProvider>
          </IdleTimer>
        </KukkuuHDSLoginProvider>
      </MockedProvider>
    </Provider>
  );
};

function RHHCConfigProviderWithMockedApolloClient({ children }: Props) {
  const cmsApolloClient = useApolloClient();
  return (
    <RHHCConfigProvider config={getRHHCConfig(cmsApolloClient)}>
      {children}
    </RHHCConfigProvider>
  );
}

function getRHHCConfig(apolloClient: ApolloClient<object>) {
  return {
    ...rhhcDefaultConfig,
    copy: {
      ...rhhcDefaultConfig.copy,
      openInNewTabAriaLabel: 'Avautuu uudessa välilehdessä.',
      openInExternalDomainAriaLabel: 'Avautuu uudella sivustolla.',
    },
    currentLanguageCode: 'FI',
    apolloClient,
  } as RHHCConfig;
}

export default TestProviders;
