import React from 'react';
import { useSelector } from 'react-redux';
import { useOidcClient } from 'hds-react';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { ProfileContext } from './ProfileContext';
import useProfile from './hooks/useProfile';
import { MyProfile } from './types/ProfileQueryTypes';
import { useIsFullyLoggedIn } from '../auth/useIsFullyLoggedIn';
import { profileSelector } from './state/ProfileSelectors';
import { clearProfile as clearProfileFromRedux } from './state/ProfileActions';
import { persistor } from '../app/state/AppStore';

export default function ProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Get rid of profile redux storage
  // Must be used here now in order to get the profile for component's first render.
  const reduxStorageProfile = useSelector(profileSelector);
  const [profile, setProfileToContext] = React.useState<MyProfile | null>(
    reduxStorageProfile?.id ? reduxStorageProfile : null
  );
  const [loadingProfileToContext, setLoadingProfileToContext] =
    React.useState(true);

  const { isAuthenticated } = useOidcClient();
  const [isLoginReady, loginInProgress] = useIsFullyLoggedIn();

  const [fetchProfile, { data, loading, refetch, called }] = useProfile({
    setProfileToContext: setProfileToContext,
    setLoading: setLoadingProfileToContext,
  });

  const isLoading =
    loginInProgress || loading || (loadingProfileToContext && called);

  const clearProfile = () => setProfileToContext(null);

  const refetchProfile = React.useCallback(() => {
    if (refetch && data?.myProfile)
      refetch().then(() => {
        setProfileToContext(data?.myProfile || null);
      });
  }, [data?.myProfile, refetch]);

  const contextValue = React.useMemo(
    () => ({
      profile,
      clearProfile,
      updateProfile: setProfileToContext,
      refetchProfile,
      loading: isLoading,
      fetchCalled: called,
    }),
    [called, isLoading, profile, refetchProfile]
  );

  React.useEffect(() => {
    if (isLoginReady) {
      fetchProfile();
    }
  }, [fetchProfile, isLoginReady]);

  React.useEffect(() => {
    if (reduxStorageProfile?.id && !isAuthenticated()) {
      // eslint-disable-next-line no-console
      console.info('Clearing profile from redux');
      clearProfileFromRedux();
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

  return (
    <ProfileContext.Provider value={contextValue}>
      <LoadingSpinner isLoading={isLoading}>{children}</LoadingSpinner>
    </ProfileContext.Provider>
  );
}
