import {
  useApiTokensClient,
  useApiTokensClientTracking,
  useOidcClient,
} from 'hds-react';

/**
 * Checks whether the OIDC and the API tokens clients have finished authenticating and
 * fetching the API tokens.
 */
export function useIsAuthorizationReady() {
  const { isAuthenticated, isRenewing: isRenewingSession } = useOidcClient();
  const { getTokens, isRenewing: isRenewingApiToken } = useApiTokensClient();

  // The isRenewing* -properties are not updating the hook!
  // All the signals needs to be tracked,
  // because othrerwise the initial loading is not returned properly
  // and the profile provider will keep spinning forever.
  useApiTokensClientTracking();

  const isLoggedIn = isAuthenticated();
  const hasTokens = Boolean(getTokens());
  const loading = isRenewingSession() || isRenewingApiToken();
  const isReady = isLoggedIn && hasTokens;

  return [isReady, loading];
}
