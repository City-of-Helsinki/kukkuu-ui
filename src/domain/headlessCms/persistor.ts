import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache';
import {
  LocalStorageWrapper,
  SynchronousCachePersistor,
} from 'apollo3-cache-persist';
import { NormalizedCacheObject } from '@apollo/client';

import AppConfig from '../app/AppConfig';

// Using console for logging for simplicity, consider a logging library
export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export enum PersistedCacheState {
  Missing = 'missing',
  Fresh = 'fresh',
  Stale = 'stale',
}

class TimedApolloCachePersistorLogger {
  private readonly logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.logLevel = logLevel;
  }

  debug(message: string, ...optionalParams: unknown[]) {
    if (this.logLevel <= LogLevel.DEBUG) {
      // eslint-disable-next-line no-console
      console.debug(message, ...optionalParams);
    }
  }

  info(message: string, ...optionalParams: unknown[]) {
    if (this.logLevel <= LogLevel.INFO) {
      // eslint-disable-next-line no-console
      console.info(message, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: unknown[]) {
    if (this.logLevel <= LogLevel.WARN) {
      // eslint-disable-next-line no-console
      console.warn(message, ...optionalParams);
    }
  }

  error(message: string, ...optionalParams: unknown[]) {
    if (this.logLevel <= LogLevel.ERROR) {
      // eslint-disable-next-line no-console
      console.error(message, ...optionalParams);
    }
  }
}

export interface TimedApolloCachePersistorOptions {
  /**
   * The time-to-live for the persisted cache in milliseconds.
   * Defaults to 10 minutes (600000 milliseconds).
   */
  persistedCacheTimeToLiveMs?: number;
  /**
   * The logging level to use. Defaults to LogLevel.INFO.
   */
  logLevel?: LogLevel;
}

export class TimedApolloCachePersistor {
  persistorLocalStorageKey: string;
  timePersistedLocalStorageKey: string;
  persistedCacheTimeToLiveMs: number;
  persistor: SynchronousCachePersistor<NormalizedCacheObject>;
  private readonly logger: TimedApolloCachePersistorLogger;

  /**
   * Creates a new TimedApolloCachePersistor instance to manage the Apollo cache
   * with an expiration time. This class automatically clears expired caches
   * and provides methods for persisting and restoring the cache to/from localStorage.
   *
   * NOTE: React-Router enables client-side routing. The React-router might be configured
   * to be used e.g. with the header navigation, that is rendered by Headless CMS
   * React Components -lib (configured through config provider). Instead of requesting a new page,
   * React Router intercepts the navigation and updates the URL and the displayed
   * components within the existing page. This avoids full page reloads, resulting
   * in a faster and more seamless user experience, but it also means that the Apollo
   * client is not re-initialized on each page load, which leads to Apollo cache not being
   * reinitialized (but can also lead to stale data, e.g not refreshed navigation menu).
   * Full page reload is needed to reinitialize the Apollo client and to get the latest data.
   * Using the basic a-elements (anchors) in the header navigation will cause full page reloads
   * and reinitialization of the Apollo client.
   * See more: https://v5.reactrouter.com/web/api/Link.
   *
   * @example
   * const cache = new InMemoryCache();
   * const persistor = new TimedApolloCachePersistor(cache, {
   * persistedCacheTimeToLiveMs: 1000 * 60 * 5, // 5 minute expiry
   * logLevel: LogLevel.DEBUG
   * });
   */
  constructor(
    cache: InMemoryCache,
    options: TimedApolloCachePersistorOptions = {}
  ) {
    const {
      persistedCacheTimeToLiveMs = 1000 * 60 * 10, // 10 minutes
      logLevel = LogLevel.INFO,
    } = options;
    this.logger = new TimedApolloCachePersistorLogger(logLevel);
    this.persistorLocalStorageKey = AppConfig.cmsApolloCacheLocalStorageKey;
    this.timePersistedLocalStorageKey =
      AppConfig.cmsApolloCachePersistedAtLocalStorageKey;
    this.persistedCacheTimeToLiveMs = persistedCacheTimeToLiveMs;
    this.persistor = this.createApolloCachePersistor(cache);
  }

  /**
   * @private
   * Creates and configures the Apollo CachePersistor instance.
   * This method initializes storage timestamp if not present.
   */
  private createApolloCachePersistor(cache: InMemoryCache) {
    if (this.getPersistedCacheState() === PersistedCacheState.Missing) {
      try {
        this.clearLocalStorage();
      } catch (e: unknown) {
        if (e instanceof Error) {
          this.logger.error(
            'Failed to clear local storage:',
            e.message,
            e.stack
          );
        } else {
          this.logger.error('Failed to clear local storage:', e); //log the unknown error.
        }
      }

      localStorage.setItem(
        this.timePersistedLocalStorageKey,
        Date.now().toString()
      );

      this.logger.debug(
        'timePersistedLocalStorageKey has been set to',
        this.timePersistedLocalStorageKey
      );
    }
    return new SynchronousCachePersistor({
      cache,
      storage: new LocalStorageWrapper(localStorage),
      key: this.persistorLocalStorageKey,
    });
  }

  /**
   * Evaluates whether the persisted Apollo cache is missing, fresh (within TTL),
   * or stale (past TTL but still retained for synchronous SWR hydration).
   */
  getPersistedCacheState(): PersistedCacheState {
    const persistedAt = Number.parseInt(
      localStorage.getItem(this.timePersistedLocalStorageKey) ?? '',
      10
    );

    if (Number.isNaN(persistedAt)) {
      this.logger.debug('Persisted cache has not been set.');
      return PersistedCacheState.Missing;
    }

    const age = Date.now() - persistedAt;
    if (age <= this.persistedCacheTimeToLiveMs) {
      this.logger.debug(
        'Persisted cache is fresh, expires in',
        (this.persistedCacheTimeToLiveMs - age) / 1000,
        'seconds.'
      );
      return PersistedCacheState.Fresh;
    }

    this.logger.debug(
      'Persisted cache is stale by',
      (age - this.persistedCacheTimeToLiveMs) / 1000,
      'seconds.'
    );
    return PersistedCacheState.Stale;
  }

  /**
   * Checks if the persisted Apollo cache has expired based on the
   * `persistedCacheTimeToLiveMs` value.
   */
  hasPersistedCacheExpired() {
    return this.getPersistedCacheState() !== PersistedCacheState.Fresh;
  }

  /**
   * A synchronous way to clear the persisted Apollo cache data from localStorage.
   * Note: This does not clear the cache from the Apollo cache itself.
   * `this.purge()` should be used to clear the cache from the Apollo cache,
   * but it should be noted that it is an async function.
   */
  clearLocalStorage() {
    localStorage.removeItem(this.timePersistedLocalStorageKey);
    localStorage.removeItem(this.persistorLocalStorageKey);
    this.logger.info('Persisted cache localStorage has been cleared.');
  }

  /**
   * Clears the persisted Apollo cache from both the Apollo cache and localStorage.
   */
  async purge() {
    await this.persistor.purge();
    this.clearLocalStorage();
    this.logger.info('Persisted cache has been purged.');
  }

  /**
   * Persists the current Apollo cache to localStorage.
   */
  async persist() {
    await this.persistor.persist();
    this.logger.info('Cache has been persisted.');
  }

  /**
   * Synchronously restores the Apollo cache from localStorage if available.
   * Ensures cached queries (such as the CMS navigation menu) are available
   * on the initial React render without a loading blink.
   */
  restoreSync() {
    try {
      this.persistor.restoreSync();
      this.logger.info('Persisted cache has been restored synchronously.');
    } catch (e: unknown) {
      this.logger.error(
        'Failed to synchronously restore persisted cache:',
        e
      );
    }
  }
}
