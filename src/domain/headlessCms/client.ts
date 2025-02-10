import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/browser';
import { LanguagesDocument } from 'react-helsinki-headless-cms/apollo';

import AppConfig from '../app/AppConfig';
import { HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE } from '../languages/constants';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_CMS_URI,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      const errorCode = extensions?.code;

      // eslint-disable-next-line max-len
      const errorMessage = `[GraphQL error]: Message: ${message}, Code: ${errorCode}, Location: ${locations}, Path: ${path}`;

      Sentry.captureMessage(errorMessage);

      if (!AppConfig.isAppInProductionMode) {
        // eslint-disable-next-line no-console
        console.error(errorMessage);
      }
    });
  }

  if (networkError) {
    Sentry.captureMessage('Network error');
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

// Make sure the hardcoded CMS languages response is always in cache
client.writeQuery({
  query: LanguagesDocument,
  data: { ...HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE },
  variables: {},
});

export default client;
