import React, { FunctionComponent, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Router, Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';
import {
  ConfigProvider,
  defaultConfig,
  LanguageCodeEnum,
  Link as RHHCLink,
} from 'react-helsinki-headless-cms';
import { History } from 'history';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { ScrollToTop } from '../../common/route/RouteUtils';
import useSyncLanguageBetweenI18nAndReactRouter from '../../common/route/useSyncLanguageBetweenI18nAndReactRouter';
import AriaLiveProvider from '../../common/AriaLive/AriaLiveProvider';
import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import graphqlClient from '../api/client';
import enableOidcLogging from '../auth/enableOidcLogging';
import userManager from '../auth/userManager';
import headlessCmsClient from '../headlessCms/client';
import HeadlessCmsPage from '../headlessCms/HeadlessCmsPage';
import { persistor, store } from './state/AppStore';
import App from './App';
import appRoutes from './appRoutes';

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

const ReactRouterLinkWrapper = ({
  href,
  ...delegatedProps
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <Link {...delegatedProps} to={href as string} />
);

const ReactRouterStyledLinkWrapper = ({
  href,
  target,
  ...delegatedProps
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const internalLink = !href?.startsWith('http');

  if (internalLink) {
    return (
      <Link {...delegatedProps} to={href as string} component={RHHCLink} />
    );
  }

  return (
    <RHHCLink
      {...delegatedProps}
      openInNewTab={target === '_blank'}
      href={href}
    />
  );
};

const appLanguageToRHHCLanguageMap = {
  [SUPPORT_LANGUAGES.FI]: LanguageCodeEnum.Fi,
  [SUPPORT_LANGUAGES.SV]: LanguageCodeEnum.Sv,
  [SUPPORT_LANGUAGES.EN]: LanguageCodeEnum.En,
};

type Props = {
  history: History;
};

const BrowserApp: FunctionComponent<Props> = ({ history }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const config = useMemo(
    () => ({
      siteName: t('appName'),
      apolloClient: headlessCmsClient,
      currentLanguageCode:
        appLanguageToRHHCLanguageMap[language] ?? LanguageCodeEnum.Fi,
      components: {
        Img: defaultConfig.components.Img,
        A: ReactRouterLinkWrapper,
        Link: ReactRouterStyledLinkWrapper,
      },
      copy: {
        breadcrumbNavigationLabel: t('common.breadcrumbNavigationLabel'),
        breadcrumbListLabel: t('common.breadcrumbListLabel'),
        menuToggleAriaLabel: t('common.menuToggleAriaLabel'),
        skipToContentLabel: t('common.skipToContentLabel'),
        openInExternalDomainAriaLabel: t(
          'common.openInExternalDomainAriaLabel'
        ),
        openInNewTabAriaLabel: t('common.openInNewTabAriaLabel'),
        closeButtonLabelText: t('common.closeButtonLabelText'),
      },
      utils: {
        getIsHrefExternal: defaultConfig.utils.getIsHrefExternal,
      },
    }),
    [t, language]
  );

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
