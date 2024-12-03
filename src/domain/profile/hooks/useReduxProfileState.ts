import { useDispatch, useSelector } from 'react-redux';
import { ApolloError } from '@apollo/client';
import React from 'react';
import { useOidcClient } from 'hds-react';
import * as Sentry from '@sentry/browser';

import { ProfileQuery } from '../../api/generatedTypes/graphql';
import { clearEvent, saveChildrenEvents } from '../../event/state/EventActions';
import { clearProfile, saveProfile } from '../state/ProfileActions';
import { defaultProfileData } from '../state/ProfileReducers';
import { persistor } from '../../app/state/AppStore';
import { profileSelector } from '../state/ProfileSelectors';

/**
 * Store the Guardian Profile to the redux store.
 * @deprecated the redux profile should be removed in favor of ProfileContext.
 * @returns the onSuccess and onError handlers for Apollo client query.
 */
function useReduxProfileState() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useOidcClient();
  // TODO: Get rid of profile redux storage
  const reduxStorageProfile = useSelector(profileSelector);

  // TODO: Get rid of profile redux storage
  React.useEffect(() => {
    if (reduxStorageProfile?.id && !isAuthenticated()) {
      // eslint-disable-next-line no-console
      console.info('Clearing profile from redux');
      clearProfile();
      persistor
        .purge()
        .then(() => {
          // eslint-disable-next-line no-console
          console.info('Redux-persistor purged');
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  }, [isAuthenticated, reduxStorageProfile?.id]);

  const onSuccess = (data: ProfileQuery) => {
    // Sync data to redux. Note that the redux state won't be updated
    // when apollo re-fetches queries based on refetchQueries. It's
    // better to source data from Apollo instead.
    dispatch(saveProfile(data?.myProfile || defaultProfileData));
    dispatch(clearEvent());
    dispatch(saveChildrenEvents(data?.myProfile?.children || undefined));
  };

  const onError = (error: ApolloError) => {
    Sentry.captureException(error);
    dispatch(clearProfile());
  };

  return { onSuccess, onError };
}

export default useReduxProfileState;
