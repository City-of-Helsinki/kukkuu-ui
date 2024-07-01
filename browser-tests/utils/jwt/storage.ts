import {
  oidcAuthority as defaultOidcAuthority,
  oidcClientId as defaultOidcClientId,
} from './constants';

export const apiTokenStorageKey = 'hds_login_api_token_storage_key';
export const apiTokenUserReferenceKey = 'hds_login_api_token_user_reference';

/**
 * Get the session storage key for the user data.
 * @param oidcAuthority OIDC authority (used in JWT)
 * @param oidcClientId OIDC client id (used in JWT)
 * @returns session storage key
 */
export const getUserStoreKey = (
  oidcAuthority = defaultOidcAuthority,
  oidcClientId = defaultOidcClientId
): string =>
  // "oidc" is the default prefix in oidc-client-ts
  // "user" is the userStoreKey in oidc-client-ts
  `oidc.user:${oidcAuthority}:${oidcClientId}`;
