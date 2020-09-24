import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/browser';

import i18n from '../../common/translation/i18n/i18nInit';
import { apiTokenSelector } from '../auth/state/AuthenticationSelectors';
import { store } from '../app/state/AppStore';
import { showExpiredSessionPrompt } from '../app/state/ui/UIActions';
import { fetchTokenError } from '../auth/state/BackendAuthenticationActions';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URI,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      const errorMessage = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
      Sentry.captureMessage(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(errorMessage);
      }

      // If JWT is expired it means that we want people to log in again.
      if (message === 'Invalid Authorization header. JWT has expired.') {
        store.dispatch(showExpiredSessionPrompt());

        // Clear old token in favor of avoiding Apollo loop
        store.dispatch(
          fetchTokenError({ message: 'Token expired', name: 'fetchTokenError' })
        );
      }
    });
  }

  if (networkError) {
    Sentry.captureMessage('Network error');
  }
});

const authLink = setContext((_, { headers }) => {
  const token = apiTokenSelector(store.getState());
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
      'accept-language': getCurrentLanguage(i18n),
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
