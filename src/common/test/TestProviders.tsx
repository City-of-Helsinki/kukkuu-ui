import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router';
import {
  ConfigProvider as RHHCConfigProvider,
  defaultConfig as rhhcDefaultConfig,
  Config as RHHCConfig,
  TemplateEnum,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  PageByTemplateDocument,
  PageDocument,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { ApolloClient } from '@apollo/client/core/ApolloClient';
import { useApolloClient } from '@apollo/client/react/hooks/useApolloClient';

import { store } from '../../domain/app/state/AppStore';
import { createApolloCache } from '../../domain/api/cacheConfig';
import ProfileProvider from '../../domain/profile/ProfileProvider';
import KukkuuHDSLoginProvider from '../../domain/auth/KukkuuHDSLoginProvider';
import IdleTimer from '../../domain/auth/IdleTimerProvider';
import { getRoutedInternalHref } from '../../utils/cmsUtils';
import { SUPPORT_LANGUAGES } from '../translation/TranslationConstants';

type Props = {
  children: ReactElement | ReactNode;
  mocks?: MockedResponse[];
};

const defaultCmsMocks: MockedResponse[] = [
  {
    request: {
      query: PageDocument,
      variables: { id: 'search' },
    },
    maxUsageCount: Infinity,
    result: {
      data: { page: null },
    },
  },
  {
    request: {
      query: PageDocument,
      variables: { id: 'profile' },
    },
    maxUsageCount: Infinity,
    result: {
      data: { page: null },
    },
  },
  ...Object.values(SUPPORT_LANGUAGES).flatMap((language) => [
    {
      request: {
        query: PageByTemplateDocument,
        variables: { template: TemplateEnum.FrontPage, language },
      },
      maxUsageCount: Infinity,
      result: {
        data: { pageByTemplate: null },
      },
    },
    {
      request: {
        query: PageByTemplateDocument,
        variables: { template: TemplateEnum.PostsPage, language },
      },
      maxUsageCount: Infinity,
      result: {
        data: { pageByTemplate: null },
      },
    },
  ]),
];

function mergeWithDefaultCmsMocks(mocks: MockedResponse[] = []): MockedResponse[] {
  const fallbackMocks = defaultCmsMocks.filter(
    (defaultMock) =>
      !mocks.some(
        (m) =>
          m.request.query === defaultMock.request.query &&
          JSON.stringify(m.request.variables) ===
            JSON.stringify(defaultMock.request.variables)
      )
  );
  return [...mocks, ...fallbackMocks];
}

const TestProviders = (props: Props) => {
  const { children, mocks } = props;
  const mergedMocks = mergeWithDefaultCmsMocks(mocks);
  return (
    <Provider store={store}>
      <MockedProvider mocks={mergedMocks} cache={createApolloCache()}>
        <KukkuuHDSLoginProvider>
          <IdleTimer>
            <ProfileProvider>
              <RHHCConfigProviderWithMockedApolloClient {...props}>
                <HelmetProvider>
                  <BrowserRouter>{children}</BrowserRouter>
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
    utils: {
      ...rhhcDefaultConfig.utils,
      getRoutedInternalHref: (link, type) =>
        getRoutedInternalHref(link, type, 'fi'),
    },
    currentLanguageCode: 'FI',
    apolloClient,
  } as RHHCConfig;
}

export default TestProviders;
