import { ApolloClient, createHttpLink, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/browser';

import AppConfig from '../app/AppConfig';
import {
  createApolloCache,
  isConfiguredQueryPolicy,
  queryPolicies,
} from './cache';
import { LogLevel, TimedApolloCachePersistor } from './persistor';

export function createCmsApolloClient() {
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

  const cache = createApolloCache();
  const kukkuuApolloCachePersistor = new TimedApolloCachePersistor(cache, {
    logLevel: LogLevel.WARN,
    persistedCacheTimeToLiveMs: AppConfig.apolloPersistedCacheTimeToLiveMs,
  });

  (async () => {
    if (kukkuuApolloCachePersistor.hasPersistedCacheExpired()) {
      // eslint-disable-next-line no-console
      console.info('Persisted cache has expired.');
      await kukkuuApolloCachePersistor.purge();
    } else {
      await kukkuuApolloCachePersistor.restore();
      // eslint-disable-next-line no-console
      console.info('Persisted cache has been restored.');
    }
  })();

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache,
    defaultOptions: {
      watchQuery: {
        nextFetchPolicy(
          currentFetchPolicy,
          {
            // Either "after-fetch" or "variables-changed", indicating why the
            // nextFetchPolicy function was invoked.
            reason,
            // The rest of the options (currentFetchPolicy === options.fetchPolicy).
            // The original value of options.fetchPolicy, before nextFetchPolicy was
            // applied for the first time.
            initialFetchPolicy,
            // The ObservableQuery associated with this client.watchQuery call.
            observable,
          }
        ) {
          // When variables change, the default behavior is to reset
          // options.fetchPolicy to context.initialFetchPolicy. If you omit this logic,
          // your nextFetchPolicy function can override this default behavior to
          // prevent options.fetchPolicy from changing in this case.
          if (reason === 'variables-changed') {
            return initialFetchPolicy;
          }
          // The languages are hardcoded in the cache, so we can always return cache-only,
          // because the languages never changes. Also, flashing on menus should be avoided,
          // so the menu query should first try from cache, but could still update cache
          // on background.
          if (isConfiguredQueryPolicy(observable.queryName)) {
            return queryPolicies[observable.queryName];
          }
          // Leave all other fetch policies unchanged.
          return currentFetchPolicy;
        },
      },
    },
  });

  return client;
}

const client = createCmsApolloClient();

export default client;
