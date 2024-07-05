import BrowserTestJWTConfig from './config';

class HdsLoginProviderStorage {
  static apiTokenStorageKey = 'hds_login_api_token_storage_key';
  static apiTokenUserReferenceKey = 'hds_login_api_token_user_reference';

  /**
   * Get the session storage key for the user data.
   *
   * @param oidcAuthority OIDC authority (used in JWT)
   * @param oidcClientId OIDC client id (used in JWT)
   * @returns session storage key
   */
  static getUserStoreKey(
    oidcAuthority = BrowserTestJWTConfig.oidcAuthority,
    oidcClientId = BrowserTestJWTConfig.oidcClientId
  ): string {
    return `oidc.user:${oidcAuthority}:${oidcClientId}`;
  }
}

export default HdsLoginProviderStorage;
