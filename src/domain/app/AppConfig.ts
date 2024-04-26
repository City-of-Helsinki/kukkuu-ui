import i18n from '../../common/translation/i18n/i18nInit';

class AppConfig {
  static get origin() {
    const originUrl = getEnvOrError(import.meta.env.VITE_ORIGIN, 'VITE_ORIGIN');
    return new URL(originUrl).origin;
  }

  /**
   * Hostname of the app.
   */
  static get hostname() {
    return new URL(this.origin).hostname;
  }

  static get apiUrl() {
    return getEnvOrError(import.meta.env.VITE_API_URI, 'VITE_API_URI');
  }

  static get oidcAuthority() {
    const origin = getEnvOrError(
      import.meta.env.VITE_OIDC_AUTHORITY,
      'VITE_OIDC_AUTHORITY'
    );
    return new URL(origin).href;
  }

  /**
   * The audiences used in the OIDC.
   * 
   * @example
   * // In Tunnistamo it can be left undefined.
   * ["https://api.hel.fi/auth/kukkuu"]
   * // In Keycloak:
   * [
        'kukkuu-api-test',
        'profile-api-test',
      ]
   */
  static get oidcAudiences() {
    return getEnvAsList(import.meta.env.VITE_OIDC_AUDIENCES);
  }

  static get oidcClientId() {
    return getEnvOrError(
      import.meta.env.VITE_OIDC_CLIENT_ID,
      'VITE_OIDC_CLIENT_ID'
    );
  }

  static get oidcScope() {
    return getEnvOrError(import.meta.env.VITE_OIDC_SCOPE, 'VITE_OIDC_SCOPE,');
  }

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
   * NOTE: The oidcServerType is not an OIDC client attribute.
   * It's purely used to help to select a configuration for the LoginProvider.
   * */
  static get oidcServerType(): 'KEYCLOAK' | 'TUNNISTAMO' {
    const oidcServerType =
      import.meta.env.VITE_OIDC_SERVER_TYPE ?? 'TUNNISTAMO';
    if (!['KEYCLOAK', 'TUNNISTAMO'].includes(oidcServerType)) {
      throw new Error(`Invalid OIDC server type: ${oidcServerType}`);
    }
    return oidcServerType;
  }

  static get cmsUri() {
    return getEnvOrError(import.meta.env.VITE_CMS_URI, 'VITE_CMS_URI');
  }

  static get locales() {
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

function getEnvAsList(variable?: string) {
  if (!variable) {
    return undefined;
  }
  return variable.split(',').map((e) => e.trim());
}

export default AppConfig;
