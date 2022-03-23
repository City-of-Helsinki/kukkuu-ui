import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/browser';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_CMS_URI,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      const errorCode = extensions?.code;

      // eslint-disable-next-line max-len
      const errorMessage = `[GraphQL error]: Message: ${message}, Code: ${errorCode}, Location: ${locations}, Path: ${path}`;

      Sentry.captureMessage(errorMessage);

      if (process.env.NODE_ENV === 'development') {
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

export default client;
