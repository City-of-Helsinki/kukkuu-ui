import React from 'react';
import * as Sentry from '@sentry/browser';

import { ProfileContext, ProfileType } from './ProfileContext';
import useProfileFetcher from './hooks/useProfileFetcher';

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

  const refetchProfile = React.useCallback(async () => {
    try {
      const { data: refreshedData } = await refetch();
      setProfileToContext(refreshedData?.myProfile || null);
      // eslint-disable-next-line no-console
      console.info('ProfileContext', 'profile refetched');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      Sentry.captureException(error);
    }
  }, [refetch]);

  const clearProfile = React.useCallback(() => {
    // eslint-disable-next-line no-console
    console.info('ProfileContext', 'profile cleared');
    setProfileToContext(null);
  }, []);

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

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}
