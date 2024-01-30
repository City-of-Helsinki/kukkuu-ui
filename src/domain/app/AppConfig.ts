import i18n from '../../common/translation/i18n/i18nInit';
class AppConfig {
  static get origin() {
    return getEnvOrError(import.meta.env.VITE_ORIGIN, 'VITE_ORIGIN');
  }

  /**
   * Hostname of the app.
   */
  static get hostname() {
    return new URL(this.origin).hostname;
  }

  static get ApiUrl() {
    return getEnvOrError(import.meta.env.VITE_API_URI, 'VITE_API_URI');
  }

  static get oidcAuthority() {
    return getEnvOrError(
      import.meta.env.VITE_OIDC_AUTHORITY,
      'VITE_OIDC_AUTHORITY'
    );
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

export default AppConfig;
