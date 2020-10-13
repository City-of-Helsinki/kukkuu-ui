import { ApolloError } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import subscribeToFreeSpotNotificationMutation from './mutations/subscribeToFreeSpotNotificationMutation';
// eslint-disable-next-line max-len
import { subscribeToFreeSpotNotificationMutation as SubscribeToFreeSpotNotificationMutation } from '../api/generatedTypes/subscribeToFreeSpotNotificationMutation';
import useMutation from '../api/useMutation';
import useDefaultErrorHandler from '../api/useDefaultErrorHandler';
import getIsError from '../api/utils/getIsError';
import eventQuery from './queries/eventQuery';
import { SubscribeToFreeSpotNotificationGQLErrors } from './EventConstants';

function useSubscribeToFreeSpotNotificationMutation(
  eventId: string,
  childId: string
) {
  const defaultErrorHandler = useDefaultErrorHandler();
  const { t } = useTranslation();
  const history = useHistory();

  return useMutation<SubscribeToFreeSpotNotificationMutation>(
    subscribeToFreeSpotNotificationMutation,
    {
      useDefaultErrorHandling: true,
      refetchQueries: [
        {
          query: eventQuery,
          variables: {
            id: eventId,
            childId,
          },
        },
      ],
      onError: (error: ApolloError) => {
        error.graphQLErrors?.forEach((graphQLError) => {
          if (
            getIsError(
              graphQLError,
              SubscribeToFreeSpotNotificationGQLErrors.ALREADY_SUBSCRIBED_ERROR
            )
          ) {
            // Reload in order to refresh page data. The current page is
            // likely just out of date. After a refresh, the user should
            // see an UI which reflects the correct subscription status.
            history.go(0);
          } else if (
            getIsError(
              graphQLError,
              SubscribeToFreeSpotNotificationGQLErrors.OCCURRENCE_IS_NOT_FULL_ERROR
            )
          ) {
            toast.error(t('enrollment.enroll.error.capacityHasChanged'));
          } else {
            defaultErrorHandler(error);
          }
        });
      },
    }
  );
}

export default useSubscribeToFreeSpotNotificationMutation;
