import { graphql, HttpResponse } from 'msw';
import { SynchronousCachePersistor } from 'apollo3-cache-persist';
import { PageDocument } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { toast } from 'react-toastify';

import i18n from '../../../common/translation/i18n/i18nInit';
import { server } from '../../../test/msw/server';
import { fakePage } from '../../../utils/cmsMockDataUtils';
import AppConfig from '../../app/AppConfig';
import {
  clearCmsClientCache,
  createCmsApolloClient,
  revalidateStaleCmsCache,
  setupCmsLanguageChangeListener,
} from '../client';
import {
  LogLevel,
  PersistedCacheState,
  TimedApolloCachePersistor,
} from '../persistor';

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

    expect(data.page.id).toEqual(page!.id);
  });

  describe('persisted cache', () => {
    afterEach(() => {
      localStorage.clear();
      vi.restoreAllMocks();
      vi.useRealTimers();
      client.cache.reset(); // Reset the cache after each test.
    });

    it('clears the local storage on initialization when the persisted cache is missing', async () => {
      const getPersistedCacheStateSpy = vi
        .spyOn(TimedApolloCachePersistor.prototype, 'getPersistedCacheState')
        .mockReturnValue(PersistedCacheState.Missing);
      const clearLocalStorageSpy = vi.spyOn(
        TimedApolloCachePersistor.prototype,
        'clearLocalStorage'
      );
      const cachePersistor = new TimedApolloCachePersistor(
        client.cache as InMemoryCache,
        {
          logLevel: LogLevel.WARN,
          persistedCacheTimeToLiveMs: 0,
        }
      );
      expect(cachePersistor.getPersistedCacheState()).toBe(
        PersistedCacheState.Missing
      );
      expect(getPersistedCacheStateSpy).toHaveBeenCalled();
      expect(clearLocalStorageSpy).toHaveBeenCalledTimes(1);
    });

    it('does not clear the local storage when the persisted cache is fresh', async () => {
      const getPersistedCacheStateSpy = vi
        .spyOn(TimedApolloCachePersistor.prototype, 'getPersistedCacheState')
        .mockReturnValue(PersistedCacheState.Fresh);
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
      expect(cachePersistor.getPersistedCacheState()).toBe(
        PersistedCacheState.Fresh
      );
      expect(getPersistedCacheStateSpy).toHaveBeenCalled();
      expect(clearLocalStorageSpy).not.toHaveBeenCalled();
    });

    it('does not clear the local storage when the persisted cache is stale (SWR preservation)', async () => {
      const getPersistedCacheStateSpy = vi
        .spyOn(TimedApolloCachePersistor.prototype, 'getPersistedCacheState')
        .mockReturnValue(PersistedCacheState.Stale);
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
      expect(cachePersistor.getPersistedCacheState()).toBe(
        PersistedCacheState.Stale
      );
      expect(getPersistedCacheStateSpy).toHaveBeenCalled();
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

    it('synchronously restores non-expired cache from localStorage via restoreSync', async () => {
      await client.query({
        query: PageDocument,
        variables: {
          id: page!.id,
          language: 'EN',
        },
        fetchPolicy: 'network-only',
      });

      const cachePersistor = new TimedApolloCachePersistor(
        client.cache as InMemoryCache,
        {
          logLevel: LogLevel.WARN,
          persistedCacheTimeToLiveMs: 10000,
        }
      );

      await cachePersistor.persist();
      client.cache.reset();

      cachePersistor.restoreSync();

      const { data: dataAfterSyncRestore } = await client.query({
        query: PageDocument,
        variables: {
          id: page!.id,
          language: 'EN',
        },
        fetchPolicy: 'cache-only',
      });
      expect(dataAfterSyncRestore.page.id).toEqual(page!.id);
    });

    it('logs an error and continues when synchronously restoring the persisted cache fails', () => {
      vi.spyOn(
        TimedApolloCachePersistor.prototype,
        'getPersistedCacheState'
      ).mockReturnValue(PersistedCacheState.Fresh);
      const restoreError = new Error('restore failed');
      vi.spyOn(
        SynchronousCachePersistor.prototype,
        'restoreSync'
      ).mockImplementation(() => {
        throw restoreError;
      });
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => createCmsApolloClient()).not.toThrow();

      expect(errorSpy).toHaveBeenCalledWith(
        'Failed to synchronously restore persisted cache:',
        restoreError
      );
    });

    it('purges the persisted cache from Apollo cache and localStorage', async () => {
      const cachePersistor = new TimedApolloCachePersistor(
        client.cache as InMemoryCache,
        {
          logLevel: LogLevel.WARN,
          persistedCacheTimeToLiveMs: 10000,
        }
      );

      await cachePersistor.persist();
      expect(
        localStorage.getItem(cachePersistor.persistorLocalStorageKey)
      ).not.toBeNull();
      expect(
        localStorage.getItem(cachePersistor.timePersistedLocalStorageKey)
      ).not.toBeNull();

      await cachePersistor.purge();

      expect(
        localStorage.getItem(cachePersistor.persistorLocalStorageKey)
      ).toBeNull();
      expect(
        localStorage.getItem(cachePersistor.timePersistedLocalStorageKey)
      ).toBeNull();
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

    it('revalidates stale CMS cache in background exactly once', async () => {
      // Simulate stale cache by setting timestamp older than TTL
      localStorage.setItem(
        AppConfig.cmsApolloCachePersistedAtLocalStorageKey,
        (Date.now() - 1000 * 60 * 20).toString()
      );
      const staleClient = createCmsApolloClient();
      const refetchSpy = vi
        .spyOn(staleClient, 'refetchQueries')
        .mockResolvedValue([]);

      revalidateStaleCmsCache(staleClient);
      expect(refetchSpy).toHaveBeenCalledWith({ include: 'active' });

      // Second call should be a no-op
      refetchSpy.mockClear();
      revalidateStaleCmsCache(staleClient);
      expect(refetchSpy).not.toHaveBeenCalled();
    });

    it('triggers a deduplicated toast error when CMS query fails', async () => {
      const toastErrorSpy = vi.spyOn(toast, 'error');
      const link =
        process.env.VITE_CMS_URI ||
        'https://kukkuu.app-staging.hkih.hion.dev/graphql';
      const headlessCms = graphql.link(link);
      server.use(
        headlessCms.query('page', () => {
          return HttpResponse.json(
            { errors: [{ message: 'Internal server error' }] },
            { status: 500 }
          );
        })
      );

      await expect(
        client.query({
          query: PageDocument,
          variables: { id: 'error-page', language: 'FI' },
          fetchPolicy: 'network-only',
        })
      ).rejects.toThrow();

      expect(toastErrorSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ toastId: 'cms-error' })
      );
    });

    it('clears CMS in-memory cache and localStorage persistence when clearCmsClientCache is called', async () => {
      const customClient = createCmsApolloClient();
      const clearStoreSpy = vi
        .spyOn(customClient, 'clearStore')
        .mockResolvedValue(undefined as any);

      localStorage.setItem(
        AppConfig.cmsApolloCacheLocalStorageKey,
        JSON.stringify({ some: 'cache' })
      );
      localStorage.setItem(
        AppConfig.cmsApolloCachePersistedAtLocalStorageKey,
        Date.now().toString()
      );

      await clearCmsClientCache(customClient);

      expect(clearStoreSpy).toHaveBeenCalledTimes(1);
      expect(
        localStorage.getItem(AppConfig.cmsApolloCacheLocalStorageKey)
      ).toBeNull();
      expect(
        localStorage.getItem(AppConfig.cmsApolloCachePersistedAtLocalStorageKey)
      ).toBeNull();
    });

    it('triggers cache purge automatically on i18n languageChanged event', async () => {
      const customClient = createCmsApolloClient();
      const clearStoreSpy = vi
        .spyOn(customClient, 'clearStore')
        .mockResolvedValue(undefined as any);
      const cleanup = setupCmsLanguageChangeListener(customClient);

      localStorage.setItem(
        AppConfig.cmsApolloCacheLocalStorageKey,
        JSON.stringify({ some: 'cache' })
      );

      // Trigger language change to 'sv'
      i18n.changeLanguage('sv');

      expect(clearStoreSpy).toHaveBeenCalledTimes(1);
      expect(
        localStorage.getItem(AppConfig.cmsApolloCacheLocalStorageKey)
      ).toBeNull();

      cleanup();
      // Restore default language
      i18n.changeLanguage('fi');
    });
  });
});
