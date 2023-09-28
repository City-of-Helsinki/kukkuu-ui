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
import { logoutTunnistamo } from '../auth/authenticate';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URI,
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

      // If JWT is expired it means that we want people to log in again.
      if (
        // TODO: This first check is just to maintain compatibility with old backend
        //  versions, it can be removed later.
        message === 'Invalid Authorization header. JWT has expired.' ||
        errorCode === 'AUTHENTICATION_EXPIRED_ERROR'
      ) {
        store.dispatch(showExpiredSessionPrompt());

        // Clear old token in favor of avoiding Apollo loop
        store.dispatch(
          fetchTokenError({ message: 'Token expired', name: 'fetchTokenError' })
        );
      }

      if (errorCode === 'AUTHENTICATION_ERROR') {
        // It is not possible to recover from AUTHENTICATION_ERROR at least with the
        // same API token, so to minimize further problems it is probably best to just
        // log the user out completely.
        logoutTunnistamo();
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
