import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import * as Sentry from '@sentry/browser';

import i18n from '../../common/translation/i18n/i18nInit';
import { apiTokenSelector } from '../auth/state/AuthenticationSelectors';
import { store } from '../app/state/AppStore';
import { showExpiredSessionPrompt } from '../app/state/ui/UIActions';
import { fetchTokenError } from '../auth/state/BackendAuthenticationActions';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';

// TODO: Ensure that the accept-language changes when user changes language in the menu.
// Now it is only correct after page reloads.
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URI,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      Sentry.captureMessage(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) {
    Sentry.captureMessage('Network error');
  }

  // Show session timeout for all kinds of errors.
  // TODO: When backend comes up with better statusCode from error body
  // Error can be handle better here.
  store.dispatch(showExpiredSessionPrompt());

  // Clear old token in favor of avoiding Apollo loop
  store.dispatch(
    fetchTokenError({ message: 'Token expired', name: 'fetchTokenError' })
  );
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
