import unsubscribeFromFreeSpotNotificationMutation from './mutations/unsubscribeFromFreeSpotNotificationMutation';
import { UnsubscribeFromFreeSpotNotificationMutation } from '../api/generatedTypes/graphql';
import useMutation from '../api/useMutation';
import eventQuery from './queries/eventQuery';

function useUnsubscribeFromFreeSpotNotificationMutation(
  eventId: string,
  childId: string
) {
  return useMutation<UnsubscribeFromFreeSpotNotificationMutation>(
    unsubscribeFromFreeSpotNotificationMutation,
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
    }
  );
}

export default useUnsubscribeFromFreeSpotNotificationMutation;
