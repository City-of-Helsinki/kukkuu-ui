import {
  ApolloClient,
  createHttpLink,
  ApolloLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/browser';
import { toast } from 'react-toastify';

import i18n from '../../common/translation/i18n/i18nInit';
import AppConfig from '../app/AppConfig';
import { getEnvValue } from '../../common/utils/envUtils';
import {
  createApolloCache,
  isConfiguredQueryPolicy,
  queryPolicies,
} from './cache';
import {
  LogLevel,
  PersistedCacheState,
  TimedApolloCachePersistor,
} from './persistor';

const staleClients = new WeakSet<ApolloClient<NormalizedCacheObject>>();

const notifyCmsFailure = () => {
  toast.error(i18n.t('cms.error.failedToLoadContent'), {
    toastId: 'cms-error',
  });
};

export function createCmsApolloClient() {
  const httpLink = createHttpLink({
    uri: getEnvValue('VITE_CMS_URI'),
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      notifyCmsFailure();
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
      notifyCmsFailure();
      Sentry.captureMessage('Network error');
    }
  });

  const cache = createApolloCache();
  const kukkuuApolloCachePersistor = new TimedApolloCachePersistor(cache, {
    logLevel: LogLevel.WARN,
    persistedCacheTimeToLiveMs: AppConfig.apolloPersistedCacheTimeToLiveMs,
  });

  const cacheState = kukkuuApolloCachePersistor.getPersistedCacheState();
  if (
    cacheState === PersistedCacheState.Fresh ||
    cacheState === PersistedCacheState.Stale
  ) {
    kukkuuApolloCachePersistor.restoreSync();
  }

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
          // because the languages never change. Also, menus do not change often and layout
          // flashing should be avoided, so the menu query uses cache-first.
          if (isConfiguredQueryPolicy(observable.queryName)) {
            return queryPolicies[observable.queryName];
          }
          // Leave all other fetch policies unchanged.
          return currentFetchPolicy;
        },
      },
    },
  });

  if (cacheState === PersistedCacheState.Stale) {
    staleClients.add(client);
  }

  return client;
}

const client = createCmsApolloClient();

/**
 * Revalidates active CMS queries in the background if the client holds stale persisted cache.
 * Executes once per stale client instance, updating cache in-place without triggering skeletons.
 */
export function revalidateStaleCmsCache(
  targetClient: ApolloClient<NormalizedCacheObject> = client
) {
  if (staleClients.delete(targetClient)) {
    if (!AppConfig.isAppInProductionMode) {
      // eslint-disable-next-line no-console
      console.info('Revalidating stale CMS cache in background.');
    }
    void targetClient.refetchQueries({ include: 'active' }).catch(() => {});
  }
}

export default client;
