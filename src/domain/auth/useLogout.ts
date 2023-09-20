import { useCallback } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

import { logoutTunnistamo } from './authenticate';
import { flushAllState } from './state/AuthenticationUtils';

function useLogout() {
  const { trackEvent } = useMatomo();

  const logout = useCallback(() => {
    trackEvent({ category: 'action', action: 'Log out' });

    // Flush all cached state
    flushAllState({});

    // Log out
    logoutTunnistamo();
  }, [trackEvent]);

  return logout;
}

export default useLogout;
