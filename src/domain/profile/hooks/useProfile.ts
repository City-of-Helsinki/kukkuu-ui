import { useQuery, QueryResult as GenericQueryResult } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from '@sentry/browser';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import { isAuthenticatedSelector } from '../../auth/state/AuthenticationSelectors';
import {
  profileQuery as ProfileQueryType,
  profileQuery_myProfile as Profile,
} from '../../api/generatedTypes/profileQuery';
import { clearEvent, saveChildrenEvents } from '../../event/state/EventActions';
import profileQuery from '../queries/ProfileQuery';
import { clearProfile, saveProfile } from '../state/ProfileActions';
import { defaultProfileData } from '../state/ProfileReducers';

export type ProfileQueryResult = Omit<
  GenericQueryResult<ProfileQueryType>,
  'data'
> & {
  data: Profile | null | undefined;
};

function useProfile(): ProfileQueryResult {
  const { i18n } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(isAuthenticatedSelector);

  const result = useQuery<ProfileQueryType>(profileQuery, {
    skip: !isAuthenticated,
    onCompleted: (data) => {
      // Sync data to redux. Note that the redux state won't be updated
      // when apollo re-fetches queries based on refetchQueries. It's
      // better to source data from Apollo instead.
      dispatch(saveProfile(data?.myProfile || defaultProfileData));
      dispatch(clearEvent());
      dispatch(saveChildrenEvents(data?.myProfile?.children || undefined));

      // If the user has no profile it means that they have not yet
      // registered to kukkuu. In this case we want to redirect them
      // into the landing page where they can start the registration
      // process.

      // This query should be skipped when the user is not
      // authenticated. However, it seems that this does not always
      // hold and we have to check authentication again in the callback.
      if (isAuthenticated && !data?.myProfile) {
        history.replace(`/${i18n.language}/home#register`);
      }
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      dispatch(clearProfile());
      Sentry.captureException(error);
    },
  });

  return { ...result, data: result.data?.myProfile };
}

export default useProfile;
