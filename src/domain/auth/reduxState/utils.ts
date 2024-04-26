import { store, persistor } from '../../app/state/AppStore';
import { resetFormValues } from '../../registration/state/RegistrationActions';
import { clearProfile } from '../../profile/state/ProfileActions';
import client from '../../api/client';
import { clearEvent } from '../../event/state/EventActions';

type FlushStateOptions = {
  keepUserFormData?: boolean;
};

export const flushAllState = (options: FlushStateOptions) => {
  if (!options.keepUserFormData) {
    // Clear user form data
    store.dispatch(resetFormValues());
  }

  // Clear profile (fetched from API)
  store.dispatch(clearProfile());

  // Clear event child state
  store.dispatch(clearEvent());

  // Flush data in redux store and localStorage
  persistor.flush();

  // Clear Apollo cache
  client.clearStore();
};
