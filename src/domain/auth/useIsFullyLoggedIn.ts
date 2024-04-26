import {
  useApiTokensClient,
  useApiTokensClientTracking,
  useOidcClient,
  useOidcClientTracking,
} from 'hds-react';
import React from 'react';

/**
 * Checks whether the OIDC and the API tokens clients have finished authenticating and
 * fetching the API tokens.
 */
export function useIsFullyLoggedIn() {
  const { isAuthenticated, isRenewing: isRenewingSession } = useOidcClient();
  const { getTokens, isRenewing: isRenewingApiToken } = useApiTokensClient();
  const [lastOidcClientSignal] = useOidcClientTracking();
  const [lastApiTokensClientSignal] = useApiTokensClientTracking();

  const loading = isRenewingSession() || isRenewingApiToken();

  const isLoginReady = React.useMemo(() => {
    return isAuthenticated() && !loading && !!getTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lastOidcClientSignal,
    lastApiTokensClientSignal,
    getTokens,
    isAuthenticated,
    isRenewingApiToken,
    isRenewingSession,
  ]);

  return [isLoginReady, loading];
}
