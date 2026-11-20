import {
  ApolloClient,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/browser';
import {
  removeApiTokensFromStorage,
  removeUserReferenceFromStorage,
} from 'hds-react';

import i18n from '../../common/translation/i18n/i18nInit';
import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import { getKukkuuApiTokenFromStorage } from '../auth/kukkuuApiUtils';
import { flushAllState } from '../auth/reduxState/utils';
import { getEnvValue } from '../../common/utils/envUtils';
import { createApolloCache } from './cacheConfig';

const httpLink = createHttpLink({
  uri: getEnvValue('VITE_API_URI'),
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      const errorCode = extensions?.code;

      // eslint-disable-next-line max-len
      const errorMessage = `[GraphQL error]: Message: ${message}, Code: ${errorCode}, Location: ${locations}, Path: ${path}`;

      // TODO: We probably don't want to send AUTHENTICATION_EXPIRED_ERROR to Sentry.
      //  However, now that the whole authentication and its' error handling has been
      //  overhauled to some degree in the backend, let's play it safe and send all
      //  errors to Sentry for now, and remove some later if needed when everything is
      //  proven to work.
      Sentry.captureMessage(errorMessage);

      if (import.meta.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(errorMessage);
      }

      if (errorCode === 'AUTHENTICATION_ERROR') {
        // It is not possible to recover from AUTHENTICATION_ERROR at least with the
        // same API token, so to minimize further problems it is probably best to just
        // log the user out completely.
        removeApiTokensFromStorage();
        removeUserReferenceFromStorage();
        flushAllState({ keepUserFormData: true });
      }
    });
  }

  if (networkError) {
    Sentry.captureMessage('Network error');
  }
});

const authLink = setContext((_, { headers }) => {
  const kukkuuApiToken = getKukkuuApiTokenFromStorage();
  return {
    headers: {
      'accept-language': getCurrentLanguage(i18n),
      ...headers,
      authorization: kukkuuApiToken ? `Bearer ${kukkuuApiToken}` : null,
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: createApolloCache(),
});

type SupportedLanguage =
  (typeof SUPPORT_LANGUAGES)[keyof typeof SUPPORT_LANGUAGES];

const isSupportedLanguage = (lang?: string): lang is SupportedLanguage =>
  Boolean(
    lang && Object.values(SUPPORT_LANGUAGES).includes(lang as SupportedLanguage)
  );

let lastLanguage = isSupportedLanguage(i18n.language)
  ? i18n.language
  : undefined;

/**
 * Subscribes to i18n language change events to reset the Kukkuu API Apollo store
 * when switching between supported languages, so localized fields refetch with
 * the updated `accept-language` header.
 */
export function setupApiLanguageChangeListener(targetClient = client) {
  let currentLanguage = lastLanguage;
  const handleLanguageChanged = (newLang: string) => {
    if (!isSupportedLanguage(newLang)) {
      return;
    }
    if (!currentLanguage) {
      currentLanguage = newLang;
      lastLanguage = newLang;
      return;
    }
    if (newLang !== currentLanguage) {
      currentLanguage = newLang;
      lastLanguage = newLang;
      void targetClient.resetStore().catch(() => {
        // Ignore resetStore errors (e.g. cancelled in-flight queries)
      });
    }
  };

  i18n.on('languageChanged', handleLanguageChanged);

  return () => {
    i18n.off('languageChanged', handleLanguageChanged);
  };
}

setupApiLanguageChangeListener(client);

export default client;
