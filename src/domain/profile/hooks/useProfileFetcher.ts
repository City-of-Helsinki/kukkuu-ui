import React from 'react';
import { useLazyQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';

import { useIsAuthorizationReady } from '../../auth/useIsAuthorizationReady';
import useReduxProfileState from './useReduxProfileState';
import {
  ProfileQuery,
  ProfileQueryDocument,
} from '../../api/generatedTypes/graphql';
import type { UpdateProfileType } from '../ProfileContext';

function useProfileFetcher({
  setProfileToContext,
}: {
  setProfileToContext: UpdateProfileType;
}) {
  const [isFullyCalled, setIsFullyCalled] = React.useState(false);
  const [isLoginReady, loginInProgress] = useIsAuthorizationReady();

  // TODO: Get rid of redux store
  const { onSuccess: onSuccessForRedux, onError: onErrorForRedux } =
    useReduxProfileState();

  const [fetchProfile, { loading, refetch, called }] =
    useLazyQuery<ProfileQuery>(ProfileQueryDocument, {
      onCompleted: (data) => {
        setProfileToContext(data?.myProfile || null);
        onSuccessForRedux(data);
        // eslint-disable-next-line no-console
        console.info('Guardian profile fetched and set in the context.');
        setIsFullyCalled(true);
      },
      onError: (error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        setProfileToContext(null);
        setIsFullyCalled(true);
        onErrorForRedux(error);
        Sentry.captureException(error);
      },
    });

  const isLoading = Boolean(loginInProgress || loading);

  // Fetch the profile information from the Kukkuu API
  // when the login provider has authenticated successfully to serve the API tokens.
  React.useEffect(() => {
    if (!called && isLoginReady) {
      // eslint-disable-next-line no-console
      console.info('Fetching profile from Kukkuu API...');
      fetchProfile();
    }
    return () => {
      setIsFullyCalled(false);
      // eslint-disable-next-line no-console
      console.info('Cleaned the fetchProfile effect.');
    };
  }, [called, fetchProfile, isLoginReady]);

  return {
    loading: isLoading,
    refetch,
    called: isFullyCalled,
  };
}

export default useProfileFetcher;
