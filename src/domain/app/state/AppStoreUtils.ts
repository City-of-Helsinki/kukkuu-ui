import { persistor, store } from './AppStore';
import { resetBackendAuthentication } from '../../auth/state/BackendAuthenticationActions';
import client from '../../api/client';
import { clearProfile } from '../../profile/state/ProfileActions';
import { resetFormValues } from '../../registration/state/RegistrationActions';

/**
 * Flush entire Redux data store
 * as well as persisted data
 * Apollo cache
 */
export const flushData = () => {
  // Clear backend auth data
  store.dispatch(resetBackendAuthentication());
  // Clear user form data
  store.dispatch(resetFormValues());
  // Clear profile (fetched from API)
  store.dispatch(clearProfile());
  // Flush data in redux store and localStorage
  persistor.flush();
  // Clear Apollo cache
  client.clearStore();
};
