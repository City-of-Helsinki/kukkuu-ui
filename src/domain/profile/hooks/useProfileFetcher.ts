import React from 'react';
import { ApolloError, useLazyQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';

import { useIsAuthorizationReady } from '../../auth/useIsAuthorizationReady';
import useReduxProfileState from './useReduxProfileState';
import {
  ProfileQuery,
  ProfileQueryDocument,
} from '../../api/generatedTypes/graphql';
import type { UpdateProfileType } from '../ProfileContext';

const isAuthenticationError = (error: ApolloError): boolean => {
  const hasAuthGraphQLError = error.graphQLErrors?.some(
    (gqlError) =>
      gqlError.extensions?.code === 'AUTHENTICATION_ERROR' ||
      gqlError.extensions?.code === 'AUTHENTICATION_EXPIRED_ERROR'
  );
  if (hasAuthGraphQLError) {
    return true;
  }
  if (error.networkError && 'statusCode' in error.networkError) {
    const { statusCode } = error.networkError;
    return statusCode === 401 || statusCode === 403;
  }
  return false;
};

function useProfileFetcher({
  setProfileToContext,
}: {
  setProfileToContext: UpdateProfileType;
}) {
  const [isFullyCalled, setIsFullyCalled] = React.useState(false);
  const hasFetchedRef = React.useRef(false);
  const hasSuccessfulProfileRef = React.useRef(false);
  const [isLoginReady, loginInProgress] = useIsAuthorizationReady();

  // TODO: Get rid of redux store
  const { onSuccess: onSuccessForRedux, onError: onErrorForRedux } =
    useReduxProfileState();

  const [fetchProfile, { data, loading, refetch }] =
    useLazyQuery<ProfileQuery>(ProfileQueryDocument, {
      notifyOnNetworkStatusChange: true,
      onCompleted: (completedData) => {
        hasSuccessfulProfileRef.current = Boolean(completedData?.myProfile);
        setProfileToContext(completedData?.myProfile || null);
        onSuccessForRedux(completedData);
        // eslint-disable-next-line no-console
        console.info('Guardian profile fetched and set in the context.');
        setIsFullyCalled(true);
      },
      onError: (error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        const isAuthError = isAuthenticationError(error);
        if (isAuthError || !hasSuccessfulProfileRef.current) {
          hasSuccessfulProfileRef.current = false;
          setProfileToContext(null);
          onErrorForRedux(error);
        }
        if (!isAuthError) {
          // Allow future recovery attempts instead of leaving the guard stuck.
          hasFetchedRef.current = false;
        }
        setIsFullyCalled(true);
        Sentry.captureException(error);
      },
    });

  React.useEffect(() => {
    if (data) {
      hasSuccessfulProfileRef.current = Boolean(data.myProfile);
      setProfileToContext(data.myProfile || null);
      onSuccessForRedux(data);
    }
  }, [data, onSuccessForRedux, setProfileToContext]);

  const isLoading = Boolean(loginInProgress || (loading && !isFullyCalled));

  // Fetch the profile information from the Kukkuu API
  // when the login provider has authenticated successfully to serve the API tokens.
  React.useEffect(() => {
    if (!isLoginReady) {
      hasFetchedRef.current = false;
      return;
    }
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      // eslint-disable-next-line no-console
      console.info('Fetching profile from Kukkuu API...');
      fetchProfile();
    }
  }, [fetchProfile, isLoginReady]);

  return {
    loading: isLoading,
    refetch,
    called: isFullyCalled,
  };
}

export default useProfileFetcher;
