import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import {
  ConfigProvider as RHHCConfigProvider,
  defaultConfig as rhhcDefaultConfig,
  Config as RHHCConfig,
} from 'react-helsinki-headless-cms';
import { ApolloClient } from '@apollo/client/core/ApolloClient';
import { useApolloClient } from '@apollo/client/react/hooks/useApolloClient';

import { store } from '../../domain/app/state/AppStore';
import ProfileProvider from '../../domain/profile/ProfileProvider';
import KukkuuHDSLoginProvider from '../../domain/auth/KukkuuHDSLoginProvider';

type Props = {
  children: ReactElement | ReactNode;
  // eslint-disable-next-line react/no-unused-prop-types
  mocks?: MockedResponse[];
};

const TestProviders = (props: Props) => {
  const { children, mocks } = props;
  return (
    <Provider store={store}>
      <MockedProvider mocks={mocks}>
        <KukkuuHDSLoginProvider>
          <ProfileProvider>
            <RHHCConfigProviderWithMockedApolloClient {...props}>
              <HelmetProvider>
                <BrowserRouter>{children}</BrowserRouter>
              </HelmetProvider>
            </RHHCConfigProviderWithMockedApolloClient>
          </ProfileProvider>
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
