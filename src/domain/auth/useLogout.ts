import { useCallback } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import {
  removeApiTokensFromStorage,
  removeUserReferenceFromStorage,
  useOidcClient,
} from 'hds-react';

import { flushAllState } from './reduxState/utils';
import { useProfileContext } from '../profile/hooks/useProfileContext';

function useLogout() {
  const { trackEvent } = useMatomo();
  const { logout } = useOidcClient();
  const { clearProfile } = useProfileContext();
  const logoutFromOidc = useCallback(() => {
    trackEvent({ category: 'action', action: 'Log out' });
    removeApiTokensFromStorage();
    removeUserReferenceFromStorage();
    flushAllState({ keepUserFormData: false });
    clearProfile();
    logout();
  }, [clearProfile, logout, trackEvent]);

  return logoutFromOidc;
}

export default useLogout;
