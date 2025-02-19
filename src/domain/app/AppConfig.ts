import i18n from '../../common/translation/i18n/i18nInit';

/**
 * Allowed environments for the application.
 */
const ALLOWED_ENVIRONMENTS = [
  'development',
  'review',
  'testing',
  'staging',
  'production',
] as const;

/**
 * Type alias for allowed environments.
 */
type Environment = (typeof ALLOWED_ENVIRONMENTS)[number];

/**
 * Typeguard to check if a string is a valid `Environment`.
 *
 * @param env - The string to check.
 * @returns `true` if the string is a valid `Environment`, `false` otherwise.
 */
function isEnvironment(env: string): env is Environment {
  return ALLOWED_ENVIRONMENTS.includes(env as Environment);
}

/**
 * Centralized configuration for the application.
 * Fetches configuration values from environment variables.
 */
class AppConfig {
  /**
   * Checks if the application is running in production mode.
   *
   * Whether the app is running in production (running the dev server with
   * NODE_ENV='production' or running an app built with NODE_ENV='production').
   *
   * @returns `true` if the app is in production mode, `false` otherwise.
   */
  static get isAppInProductionMode(): boolean {
    return import.meta.env.PROD;
  }

  /**
   * Gets the current environment of the application.
   *
   * The possible values are defined by `ALLOWED_ENVIRONMENTS`.
   * Defaults to 'development' if the environment variable `VITE_ENVIRONMENT` is not set.
   *
   * @returns The current environment as a string.
   * @throws {Error} If the environment variable `VITE_ENVIRONMENT` has an invalid value.
   */
  static get environment(): Environment {
    const env =
      (import.meta.env.VITE_ENVIRONMENT as Environment) || 'development';

    if (!isEnvironment(env)) {
      throw new Error(`Invalid environment: ${env}`);
    }

    return env;
  }

  /**
   * The origin URL (protocol + hostname + port) of the application.
   *
   * @throws {Error} If the `VITE_ORIGIN` environment variable is not defined.
   * @example
   * // In your environment:
   * VITE_ORIGIN='https://kummilapset.hel.fi'
   */
  static get origin() {
    return getEnvAsUrl('VITE_ORIGIN').origin;
  }

  /**
   * The hostname (e.g., 'kummilapset.hel.fi') of the application.
   *
   * @throws {Error} If the `VITE_ORIGIN` environment variable is not defined.
   */
  static get hostname() {
    return getEnvAsUrl('VITE_ORIGIN').hostname;
  }

  /**
   * The Helsinki-profiile url for single sign on
   *
   * @throws {Error} If the `VITE_HELSINKI_PROFILE_URL` environment variable is not defined.
   */
  static get helsinkiProfileUrl() {
    return getEnvOrError(
      import.meta.env.VITE_HELSINKI_PROFILE_URL,
      'VITE_HELSINKI_PROFILE_URL'
    );
  }

  /**
   * The Graphql API URL (e.g., 'https://kukkuu.api.hel.fi/graphql').
   *
   * @throws {Error} If the `VITE_API_URI` environment variable is not defined.
   */
  static get apiUrl() {
    return getEnvOrError(import.meta.env.VITE_API_URI, 'VITE_API_URI');
  }

  /**
   * The OIDC (OpenID Connect) authority URL.
   *
   * @throws {Error} If the `VITE_OIDC_AUTHORITY` environment variable is not defined.
   */
  static get oidcAuthority() {
    const origin = getEnvOrError(
      import.meta.env.VITE_OIDC_AUTHORITY,
      'VITE_OIDC_AUTHORITY'
    );
    return new URL(origin).href;
  }

  /**
   * The audiences for OIDC tokens.
   * Can be a string or a comma-separated list of strings.
   *
   * @example
   * - Tunnistamo: undefined (leave the env var empty)
   * - Keycloak: 'kukkuu-api-test,profile-api-test'
   */
  static get oidcAudiences() {
    return getEnvAsList(import.meta.env.VITE_OIDC_AUDIENCES);
  }

  /**
   * OIDC client id for (this) kukkuu-ui client.
   * Read env variable `VITE_OIDC_CLIENT_ID`.
   */
  static get oidcClientId() {
    return getEnvOrError(
      import.meta.env.VITE_OIDC_CLIENT_ID,
      'VITE_OIDC_CLIENT_ID'
    );
  }

  /**
   * OIDC auth scope.
   * Read env variable `VITE_OIDC_SCOPE`.
   */
  static get oidcScope() {
    return getEnvOrError(import.meta.env.VITE_OIDC_SCOPE, 'VITE_OIDC_SCOPE,');
  }

  /**
   * OIDC authorization code grant type.
   * Read env variable `VITE_OIDC_RETURN_TYPE`.
   * Defaults to 'code' which is for "authorization code flow".
   * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.
   */
  static get oidcReturnType() {
    // "code" for authorization code flow.
    return import.meta.env.VITE_OIDC_RETURN_TYPE ?? 'code';
  }

  static get oidcKukkuuApiClientId() {
    return getEnvOrError(
      import.meta.env.VITE_OIDC_KUKKUU_API_CLIENT_ID,
      'VITE_OIDC_KUKKUU_API_CLIENT_ID'
    );
  }

  /**
   * Indicates the type of OIDC server being used.
   *
   * This is not a standard OIDC client attribute; it's used internally to determine
   * the appropriate configuration for the login provider.
   *
   * @throws {Error} If the `VITE_OIDC_SERVER_TYPE` environment variable is not defined
   *                or has an invalid value (not 'KEYCLOAK' or 'TUNNISTAMO').
   */
  static get oidcServerType(): 'KEYCLOAK' | 'TUNNISTAMO' {
    const oidcServerType =
      import.meta.env.VITE_OIDC_SERVER_TYPE ?? 'TUNNISTAMO';
    if (!['KEYCLOAK', 'TUNNISTAMO'].includes(oidcServerType)) {
      throw new Error(`Invalid OIDC server type: ${oidcServerType}`);
    }
    return oidcServerType;
  }

  /**
   * Read env variable `VITE_OIDC_AUTOMATIC_SILENT_RENEW_ENABLED`.
   * Defaults to true.
   * */
  static get oidcAutomaticSilentRenew(): boolean {
    return Boolean(
      import.meta.env.VITE_OIDC_AUTOMATIC_SILENT_RENEW_ENABLED ?? true
    );
  }

  /**
   * Read env variable `VITE_OIDC_SESSION_POLLING_INTERVAL_MS`.
   * Defaults to 1 minute.
   * */
  static get oidcSessionPollerIntervalInMs(): number {
    return (
      Number(import.meta.env.VITE_OIDC_SESSION_POLLING_INTERVAL_MS) || 60_000
    );
  }

  /**
   * Read env variable `VITE_IDLE_TIMEOUT_IN_MS`.
   * Defaults to 60 minutes.
   * */
  static get userIdleTimeoutInMs(): number {
    return Number(import.meta.env.VITE_IDLE_TIMEOUT_IN_MS) || 3_600_000;
  }

  /**
   * The URL of the Content Management System (CMS).
   *
   * @throws {Error} If the `VITE_CMS_URI` environment variable is not defined.
   */
  static get cmsUri() {
    return getEnvOrError(import.meta.env.VITE_CMS_URI, 'VITE_CMS_URI');
  }

  /**
   * The Matomo Base Url parameter.
   *
   * @throws {Error} If the `VITE_MATOMO_URL_BASE` environment variable is not defined.
   */
  static get matomoBaseUrl() {
    return getEnvOrError(
      import.meta.env.VITE_MATOMO_URL_BASE,
      'VITE_MATOMO_URL_BASE'
    );
  }

  /**
   * The Matomo SiteId parameter.
   *
   * @throws {Error} If the `VITE_MATOMO_SITE_ID` environment variable is not defined.
   */
  static get matomoSiteId() {
    return getEnvOrError(
      import.meta.env.VITE_MATOMO_SITE_ID,
      'VITE_MATOMO_SITE_ID'
    );
  }

  /**
   * The Matomo Source Url parameter.
   */
  static get matomoSrcUrl() {
    const srcUrl: string | undefined = import.meta.env.VITE_MATOMO_SRC_URL;
    return srcUrl;
  }

  /**
   * The Matomo Tracker Url parameter.
   */
  static get matomoTrackerUrl() {
    const trackerUrl: string | undefined = import.meta.env
      .VITE_MATOMO_TRACKER_URL;
    return trackerUrl;
  }

  /**
   * The Matomo enabled flag.
   *
   * @throws {Error} If the `VITE_MATOMO_ENABLED` environment variable is not defined.
   */
  static get matomoEnabled() {
    return Boolean(
      getEnvOrError(import.meta.env.VITE_MATOMO_ENABLED, 'VITE_MATOMO_ENABLED')
    );
  }

  /**
   * How long should the Apollo peristed cache be kept in local storage.
   * Read env variable `VITE_APOLLO_PERSISTED_CACHE_TIME_TO_LIVE_MS`.
   * Time in milliseconds. Defaults to 10 minutes.
   */
  static get apolloPersistedCacheTimeToLiveMs() {
    return (
      Number(import.meta.env.VITE_APOLLO_PERSISTED_CACHE_TIME_TO_LIVE_MS) ||
      1000 * 60 * 10
    ); // 10 minutes by default;
  }

  /**
   * An array of supported locale codes (e.g., ['fi', 'en']).
   */
  static get locales(): readonly string[] {
    return i18n.languages;
  }

  static get dateFormat() {
    return 'dd.MM.yyyy';
  }

  static get shortDatetimeFormat() {
    return 'dd.MM.yyyy HH:mm';
  }

  static get datetimeFormat() {
    return 'dd.MM.yyyy HH:mm:ss';
  }
}

// Accept both variable and name so that variable can be correctly replaced
// by build.
// import.meta.env.VAR => value
// import.meta.env["VAR"] => no value
// Name is used to make debugging easier.
function getEnvOrError(variable?: string, name?: string) {
  if (!variable) {
    throw Error(`Environment variable with name ${name} was not found`);
  }
  return variable;
}

/**
 * Fetches an environment variable value as a URL.
 *
 * @param varName The name of the environment variable.
 * @throws {Error} If the variable is not defined or is not a valid URL.
 */
function getEnvAsUrl(varName: string): URL {
  const value = getEnvOrError(import.meta.env[varName], varName);
  try {
    return new URL(value);
  } catch {
    throw new Error(
      `Environment variable ${varName} is not a valid URL: ${value}`
    );
  }
}

function getEnvAsList(variable?: string) {
  if (!variable) {
    return undefined;
  }
  return variable.split(',').map((e) => e.trim());
}

export default AppConfig;
