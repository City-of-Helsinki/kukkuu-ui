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
  const { isAuthenticated } = useOidcClient();
  const [isLoginReady, loginInProgress] = useIsFullyLoggedIn();

  const [fetchProfile, { data, loading, refetch, called }] = useProfile({
    setProfileToContext: setProfileToContext,
  });

  const isLoading = loginInProgress || (loading && !called);

  const clearProfile = () => setProfileToContext(null);

  const refetchProfile = () => {
    refetch().then(() => {
      setProfileToContext(data?.myProfile || null);
    });
  };

  const contextValue = React.useMemo(
    () => ({
      profile,
      clearProfile,
      updateProfile: setProfileToContext,
      refetchProfile,
      loading: isLoading,
      fetchCalled: called,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile]
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
    }
  }, [isAuthenticated, reduxStorageProfile?.id]);

  return (
    <ProfileContext.Provider value={contextValue}>
      <LoadingSpinner isLoading={isLoading}>{children}</LoadingSpinner>
    </ProfileContext.Provider>
  );
}
