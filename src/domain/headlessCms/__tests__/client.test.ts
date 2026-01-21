import { graphql, HttpResponse } from 'msw';
import { PageDocument } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

import { server } from '../../../test/msw/server';
import { fakePage } from '../../../utils/cmsMockDataUtils';
import { createCmsApolloClient } from '../client';
import { LogLevel, TimedApolloCachePersistor } from '../persistor';

let client: ApolloClient<NormalizedCacheObject>;
const page = fakePage();

beforeEach(() => {
  client = createCmsApolloClient();
  const link =
    process.env.VITE_CMS_URI ||
    'https://kukkuu.app-staging.hkih.hion.dev/graphql';
  const headlessCms = graphql.link(link);
  server.use(
    headlessCms.query('page', () => HttpResponse.json({ data: { page } }))
  );
});

describe('Headless CMS Client', () => {
  it('returns a page when a page query is requested', async () => {
    const { data } = await client.query({
      query: PageDocument,
      variables: {
        id: page!.id,
        language: 'EN',
      },
      // NOTE: The React-helsinki-headless-cms library sets a cache here by default
      fetchPolicy: 'no-cache',
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(data.page.id).toEqual(page!.id);
  });

  it('returns a page from the cache when a page query is requested', async () => {
    const variables = {
      id: page!.id,
      language: 'EN',
    };
    // First query to populate the cache
    await client.query({
      query: PageDocument,
      variables,
      fetchPolicy: 'cache-first',
    });

    // Second query to test cache retrieval
    const { data } = await client.query({
      query: PageDocument,
      variables,
      fetchPolicy: 'cache-only',
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(data.page.id).toEqual(page!.id);
  });

  describe('persisted cache', () => {
    afterEach(() => {
      localStorage.clear();
      vi.restoreAllMocks();
      vi.useRealTimers();
      client.cache.reset(); // Reset the cache after each test.
    });

    it('clears the local storage on initialization when the persisted cache has expired', async () => {
      const hasPersistedCacheExpiredSpy = vi
        .spyOn(TimedApolloCachePersistor.prototype, 'hasPersistedCacheExpired')
        .mockImplementation(() => true);
      const clearLocalStorageSpy = vi.spyOn(
        TimedApolloCachePersistor.prototype,
        'clearLocalStorage'
      );
      const cachePersistor = new TimedApolloCachePersistor(
        client.cache as InMemoryCache,
        {
          logLevel: LogLevel.WARN,
          persistedCacheTimeToLiveMs: 0, // Set TTL to 0 to simulate expiration
        }
      );
      expect(cachePersistor.hasPersistedCacheExpired()).toBe(true);
      expect(hasPersistedCacheExpiredSpy).toHaveBeenCalledTimes(2);
      expect(clearLocalStorageSpy).toHaveBeenCalledTimes(1);
    });

    it('does not clear the local storage when the persisted cache has not expired', async () => {
      const hasPersistedCacheExpiredSpy = vi
        .spyOn(TimedApolloCachePersistor.prototype, 'hasPersistedCacheExpired')
        .mockReturnValue(false);
      const clearLocalStorageSpy = vi.spyOn(
        TimedApolloCachePersistor.prototype,
        'clearLocalStorage'
      );
      const cachePersistor = new TimedApolloCachePersistor(
        client.cache as InMemoryCache,
        {
          logLevel: LogLevel.WARN,
          persistedCacheTimeToLiveMs: 10000,
        }
      );
      expect(cachePersistor.hasPersistedCacheExpired()).toBe(false);
      expect(hasPersistedCacheExpiredSpy).toHaveBeenCalledTimes(2);
      expect(clearLocalStorageSpy).not.toHaveBeenCalled();
    });

    it('persists the cache to localStorage', async () => {
      const cachePersistor = new TimedApolloCachePersistor(
        client.cache as InMemoryCache,
        {
          logLevel: LogLevel.WARN,
          persistedCacheTimeToLiveMs: 10000,
        }
      );

      await cachePersistor.persist();
      const persistedData = localStorage.getItem(
        cachePersistor.persistorLocalStorageKey
      );
      expect(persistedData).not.toBeNull();
      const persistedTimestamp = localStorage.getItem(
        cachePersistor.timePersistedLocalStorageKey
      );
      expect(persistedTimestamp).not.toBeNull();
    });

    it('restores the cache from localStorage', async () => {
      // Make a query to write cache
      await client.query({
        query: PageDocument,
        variables: {
          id: page!.id,
          language: 'EN',
        },
        fetchPolicy: 'network-only',
      });

      // Create a persistor
      const cachePersistor = new TimedApolloCachePersistor(
        client.cache as InMemoryCache,
        {
          logLevel: LogLevel.WARN,
          persistedCacheTimeToLiveMs: 10000,
        }
      );

      // Persist to localStorage
      cachePersistor.persist();

      // reset the client cache
      client.cache.reset();

      // Test that the cache is empty
      const { data: dataBeforeRestore } = await client.query({
        query: PageDocument,
        variables: {
          id: page!.id,
          language: 'EN',
        },
        fetchPolicy: 'cache-only',
      });
      expect(dataBeforeRestore).toEqual({});

      // Restore the cache from locaStorage
      await cachePersistor.restore();

      // Test that the cache is restored
      const { data: dataAfterRestore } = await client.query({
        query: PageDocument,
        variables: {
          id: page!.id,
          language: 'EN',
        },
        fetchPolicy: 'cache-only',
      });
      expect(dataAfterRestore.page.id).toEqual(page!.id);
    });

    it.each([600000, 10000])(
      'expires the persisted cache in set time (%i ms)',
      async (persistedCacheTimeToLiveMs) => {
        vi.useFakeTimers();
        const cachePersistor = new TimedApolloCachePersistor(
          client.cache as InMemoryCache,
          {
            persistedCacheTimeToLiveMs,
          }
        );

        const persistedAt = Date.now();
        localStorage.setItem(
          cachePersistor.timePersistedLocalStorageKey,
          persistedAt.toString()
        );

        expect(cachePersistor.hasPersistedCacheExpired()).toBe(false);

        vi.advanceTimersByTime(persistedCacheTimeToLiveMs + 1);
        expect(cachePersistor.hasPersistedCacheExpired()).toBe(true);
      }
    );
  });
});
