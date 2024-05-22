import React from 'react';

import { ProfileContext, ProfileType } from './ProfileContext';
import useProfileFetcher from './hooks/useProfileFetcher';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';

export default function ProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfileToContext] = React.useState<ProfileType>(null);
  const {
    refetch,
    loading: isProfileFetcherLoading,
    called: isFetchCalled,
  } = useProfileFetcher({
    setProfileToContext,
  });

  const refetchProfile = React.useCallback(() => {
    refetch().then(({ data: refreshedData }) => {
      setProfileToContext(refreshedData?.myProfile || null);
    });
  }, [refetch]);

  const clearProfile = React.useCallback(() => setProfileToContext(null), []);

  const contextValue = React.useMemo(
    () => ({
      profile,
      clearProfile,
      updateProfile: setProfileToContext,
      refetchProfile,
      isLoading: isProfileFetcherLoading,
      isFetchCalled,
    }),
    // The profile object is always changing when the useIsAuthorizationReady runs
    [
      clearProfile,
      isFetchCalled,
      isProfileFetcherLoading,
      profile,
      refetchProfile,
    ]
  );

  // The profile provider might load the children
  // while the profile fetching is still on going
  // and won't refresh the children when it is;
  // This situation needs to be waited.
  // TODO: Get rid of this loading spinner and sync issue.
  if (isProfileFetcherLoading && !profile) {
    // eslint-disable-next-line no-console
    console.info(
      'Using a loading spinner to wait for profile to be fully fetched from the Kukkuu API.'
    );
    return <LoadingSpinner isLoading={true} />;
  }

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}
