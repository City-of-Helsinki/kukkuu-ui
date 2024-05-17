import {
  LazyQueryExecFunction,
  OperationVariables,
  QueryResult,
  useLazyQuery,
} from '@apollo/client';
import { useDispatch } from 'react-redux';
import * as Sentry from '@sentry/browser';

import {
  ProfileQuery,
  ProfileQueryDocument,
} from '../../api/generatedTypes/graphql';
import { clearEvent, saveChildrenEvents } from '../../event/state/EventActions';
import { clearProfile, saveProfile } from '../state/ProfileActions';
import { defaultProfileData } from '../state/ProfileReducers';
import { MyProfile } from '../types/ProfileQueryTypes';

function useProfile({
  setProfileToContext,
  setLoading,
}: {
  setProfileToContext: (guardian: MyProfile | null) => void;
  setLoading?: (loading: boolean) => void;
}): [
  LazyQueryExecFunction<ProfileQuery, OperationVariables>,
  QueryResult<ProfileQuery, OperationVariables>,
] {
  const dispatch = useDispatch();

  const [fetchProfile, queryResult] = useLazyQuery<ProfileQuery>(
    ProfileQueryDocument,
    {
      onCompleted: (data) => {
        setLoading && setLoading(false);
        setProfileToContext(data?.myProfile || null);
        // Sync data to redux. Note that the redux state won't be updated
        // when apollo re-fetches queries based on refetchQueries. It's
        // better to source data from Apollo instead.
        dispatch(saveProfile(data?.myProfile || defaultProfileData));
        dispatch(clearEvent());
        dispatch(saveChildrenEvents(data?.myProfile?.children || undefined));
      },
      onError: (error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        setProfileToContext(null);
        dispatch(clearProfile());
        Sentry.captureException(error);
      },
    }
  );

  return [fetchProfile, queryResult];
}

export default useProfile;
