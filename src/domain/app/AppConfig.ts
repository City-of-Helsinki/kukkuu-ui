import i18n from '../../common/translation/i18n/i18nInit';
class AppConfig {
  static get origin() {
    return getEnvOrError(process.env.REACT_APP_ORIGIN, 'REACT_APP_ORIGIN');
  }

  static get ApiUrl() {
    return getEnvOrError(process.env.REACT_APP_API_URI, 'REACT_APP_API_URI');
  }

  static get oidcAuthority() {
    return getEnvOrError(
      process.env.REACT_APP_OIDC_AUTHORITY,
      'REACT_APP_OIDC_AUTHORITY'
    );
  }

  static get cmsUri() {
    return getEnvOrError(process.env.REACT_APP_CMS_URI, 'REACT_APP_CMS_URI');
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
// process.env.VAR => value
// process.env["VAR"] => no value
// Name is used to make debugging easier.
function getEnvOrError(variable?: string, name?: string) {
  if (!variable) {
    throw Error(`Environment variable with name ${name} was not found`);
  }
  return variable;
}

export default AppConfig;
